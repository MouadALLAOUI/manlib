import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import clientService from "../../../api/services/clientService";
import representantService from "../../../api/services/representantService";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

function ClientsPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        representant_id: "",
        raison_sociale: "",
        ville: "",
        adresse: "",
        tel: "",
        email: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps] = await Promise.all([
                clientService.getAll(),
                representantService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
        } catch (error) {
            logger("Error fetching clients:", error);
            toast.error("Erreur lors du chargement des clients");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!isDialogOpen) {
            setFormData({
                representant_id: "",
                raison_sociale: "",
                ville: "",
                adresse: "",
                tel: "",
                email: "",
            });
            setRowId("");
            setDialogMode("add");
        }
    }, [isDialogOpen]);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce client ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await clientService.delete(row.id);
                    toast.success("Client supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting client:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Client non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Raison Sociale", accessor: "raison_sociale" },
        { header: "Ville", accessor: "ville" },
        { header: "Téléphone", accessor: "tel" },
        { header: "Email", accessor: "email" },
    ];

    const schema = useMemo(() => {
        const rules = {
            representant_id: "required|uuid|exists:representants,id",
            raison_sociale: "required|string|max:255",
            ville: "nullable|string|max:100",
            adresse: "nullable|string",
            tel: "nullable|string|max:20",
            email: "nullable|string|email|max:255",
        };

        return buildSchemaFromControllerRules({
            rules,
            formData,
            setFormData,
            labels: {
                representant_id: "Représentant",
                raison_sociale: "Nom / Raison sociale",
                ville: "Ville",
                adresse: "Adresse",
                tel: "Téléphone",
                email: "Email",
            },
            selectItems: {
                representant_id: representants.map((r) => ({ label: r.nom, value: r.id })),
            },
            overrides: {
                adresse: { inputType: "textarea" },
            },
            gridSpan: {
                adresse: "space-y-2 col-span-2",
            },
        });
    }, [formData, representants]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await clientService.create(formData);
                toast.success("Client ajouté");
            } else if (dialogMode === "update" && rowId) {
                await clientService.update(rowId, formData);
                toast.success("Client mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving client:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                representant_id: row.representant_id || row.representant?.id || "",
                raison_sociale: row.raison_sociale || "",
                ville: row.ville || "",
                adresse: row.adresse || "",
                tel: row.tel || "",
                email: row.email || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                representant_id: row.representant_id || row.representant?.id || "",
                raison_sociale: row.raison_sociale || "",
                ville: row.ville || "",
                adresse: row.adresse || "",
                tel: row.tel || "",
                email: row.email || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gestion des clients</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouveau client
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouveau client", update: "Modifier le client", view: "Détails" },
                        subtitle: { add: "Créer un nouveau client.", update: "Mettre à jour le client.", view: "Consultation." },
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

export default ClientsPage;
