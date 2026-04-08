import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import depotService from "../../../api/services/depotService";
import representantService from "../../../api/services/representantService";
import livreService from "../../../api/services/livreService";

function DeclarationDepotPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [livres, setLivres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        livre_id: "",
        quantite_balance: "",
        status: "Actif",
        remarks: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, livresRes] = await Promise.all([
                depotService.getAll(),
                representantService.getAll(),
                livreService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
            setLivres(livresRes.data.data || livresRes.data || []);
        } catch (error) {
            logger("Error fetching depots:", error);
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
            livre_id: "",
            quantite_balance: "",
            status: "Actif",
            remarks: "",
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
            description: "Êtes-vous sûr de vouloir supprimer cette déclaration ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await depotService.delete(row.id);
                    toast.success("Déclaration supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting depot:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Livre", accessor: "livre.titre" },
        { header: "Quantité", accessor: "quantite_balance" },
        { header: "Statut", accessor: "status" },
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
                name: "livre_id",
                label: "Livre",
                placeholder: "Choisir un livre",
                inputType: "select",
                required: true,
                items: livres.map((l) => ({ label: l.titre, value: l.id })),
                value: formData.livre_id,
                onChange: (v) => setFormData((prev) => ({ ...prev, livre_id: v })),
            },
            {
                name: "quantite_balance",
                label: "Quantité",
                type: "number",
                required: true,
                value: formData.quantite_balance,
                onChange: (v) => setFormData((prev) => ({ ...prev, quantite_balance: v })),
            },
            {
                name: "status",
                label: "Statut",
                inputType: "select",
                required: true,
                items: ["Actif", "Cloturé"],
                value: formData.status,
                onChange: (v) => setFormData((prev) => ({ ...prev, status: v })),
            },
            {
                name: "remarks",
                label: "Remarques",
                inputType: "textarea",
                value: formData.remarks,
                onChange: (v) => setFormData((prev) => ({ ...prev, remarks: v })),
                className: "space-y-2 col-span-2",
            },
        ],
        [formData, representants, livres]
    );

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await depotService.create(formData);
                toast.success("Déclaration ajoutée");
            } else if (dialogMode === "update" && rowId) {
                await depotService.update(rowId, formData);
                toast.success("Déclaration mise à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving depot:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                livre_id: row.livre_id || row.livre?.id || "",
                quantite_balance: row.quantite_balance ?? "",
                status: row.status || "Actif",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                livre_id: row.livre_id || row.livre?.id || "",
                quantite_balance: row.quantite_balance ?? "",
                status: row.status || "Actif",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Déclaration dépôt</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouvelle déclaration
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: {
                            add: "Nouvelle déclaration",
                            update: "Modifier la déclaration",
                            view: "Détails",
                        },
                        subtitle: {
                            add: "Créer une déclaration de dépôt.",
                            update: "Mettre à jour la déclaration sélectionnée.",
                            view: "Consultation de la déclaration.",
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

export default DeclarationDepotPage;
