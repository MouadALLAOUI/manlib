import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import carteVisiteService from "../../../api/services/carteVisiteService";
import representantService from "../../../api/services/representantService";

function CartesVisitePage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        date_distribution: "",
        type_support: "Cartes Visite",
        quantite: "",
        destination: "",
        remarques: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps] = await Promise.all([
                carteVisiteService.getAll(),
                representantService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
        } catch (error) {
            logger("Error fetching carte visites:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            rep_id: "",
            date_distribution: "",
            type_support: "Cartes Visite",
            quantite: "",
            destination: "",
            remarques: "",
        });
        setRowId("");
        setDialogMode("add");
    };

    useEffect(() => {
        if (!isDialogOpen) resetForm();
    }, [isDialogOpen]);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer cette demande ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await carteVisiteService.delete(row.id);
                    toast.success("Demande supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting carte visite:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Date", accessor: "date_distribution", type: "date" },
        { header: "Support", accessor: "type_support" },
        { header: "Quantité", accessor: "quantite" },
        { header: "Destination", accessor: "destination" },
    ];

    const schema = useMemo(
        () => [
            {
                name: "rep_id",
                label: "Représentant",
                placeholder: "Choisir un représentant",
                inputType: "select",
                required: true,
                items: representants.map((r) => ({ label: r.nom, value: r.id })),
                value: formData.rep_id,
                onChange: (v) => setFormData((prev) => ({ ...prev, rep_id: v })),
            },
            {
                name: "date_distribution",
                label: "Date de distribution",
                type: "date",
                required: true,
                value: formData.date_distribution,
                onChange: (v) => setFormData((prev) => ({ ...prev, date_distribution: v })),
            },
            {
                name: "type_support",
                label: "Type de support",
                inputType: "select",
                required: true,
                items: ["Cartes Visite", "Chevalet", "Pied de Bureau"],
                value: formData.type_support,
                onChange: (v) => setFormData((prev) => ({ ...prev, type_support: v })),
            },
            {
                name: "quantite",
                label: "Quantité",
                type: "number",
                required: true,
                value: formData.quantite,
                onChange: (v) => setFormData((prev) => ({ ...prev, quantite: v })),
            },
            {
                name: "destination",
                label: "Destination",
                placeholder: "Destination",
                value: formData.destination,
                onChange: (v) => setFormData((prev) => ({ ...prev, destination: v })),
                className: "space-y-2 col-span-2",
            },
            {
                name: "remarques",
                label: "Remarques",
                inputType: "textarea",
                value: formData.remarques,
                onChange: (v) => setFormData((prev) => ({ ...prev, remarques: v })),
                className: "space-y-2 col-span-2",
            },
        ],
        [formData, representants]
    );

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await carteVisiteService.create(formData);
                toast.success("Demande ajoutée");
            } else if (dialogMode === "update" && rowId) {
                await carteVisiteService.update(rowId, formData);
                toast.success("Demande mise à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving carte visite:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_distribution: row.date_distribution || "",
                type_support: row.type_support || "Cartes Visite",
                quantite: row.quantite ?? "",
                destination: row.destination || "",
                remarques: row.remarques || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_distribution: row.date_distribution || "",
                type_support: row.type_support || "Cartes Visite",
                quantite: row.quantite ?? "",
                destination: row.destination || "",
                remarques: row.remarques || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Cartes de visite</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouvelle demande
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: {
                            add: "Nouvelle demande",
                            update: "Modifier la demande",
                            view: "Détails",
                        },
                        subtitle: {
                            add: "Créer une demande de supports.",
                            update: "Mettre à jour la demande sélectionnée.",
                            view: "Consultation de la demande.",
                        },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={rows}
                    columns={columns}
                    pageSize={5}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    variant="slate"
                    isLoading={isLoading}
                    actionsDetaille={actionsDetaille}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
}

export default CartesVisitePage;
