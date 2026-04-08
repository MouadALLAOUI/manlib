import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import bVentesClientService from "../../../api/services/bVentesClientService";
import representantService from "../../../api/services/representantService";
import clientService from "../../../api/services/clientService";
import livreService from "../../../api/services/livreService";

function BLClientsPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [clients, setClients] = useState([]);
    const [livres, setLivres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        client_id: "",
        b_vente_number: "",
        date_vente: "",
        type: "",
        livre_id: "",
        quantite: "",
        remise: "",
        remarks: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, cls, lvs] = await Promise.all([
                bVentesClientService.getAll(),
                representantService.getAll(),
                clientService.getAll(),
                livreService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
            setClients(cls.data.data || cls.data || []);
            setLivres(lvs.data.data || lvs.data || []);
        } catch (error) {
            logger("Error fetching ventes clients:", error);
            toast.error("Erreur lors du chargement des BL clients");
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
                rep_id: "",
                client_id: "",
                b_vente_number: "",
                date_vente: "",
                type: "",
                livre_id: "",
                quantite: "",
                remise: "",
                remarks: "",
            });
            setRowId("");
            setDialogMode("add");
        }
    }, [isDialogOpen]);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce BL client ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await bVentesClientService.delete(row.id);
                    toast.success("BL supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting b ventes client:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Client", accessor: "client.raison_sociale" },
        { header: "N° BL", accessor: "b_vente_number" },
        { header: "Date", accessor: "date_vente", type: "date" },
        { header: "Livre", accessor: "livre.titre" },
        { header: "Qté", accessor: "quantite" },
        { header: "Remise", accessor: "remise" },
    ];

    const schema = useMemo(() => {
        const rules = {
            rep_id: "required|uuid|exists:representants,id",
            client_id: "required|uuid|exists:clients,id",
            b_vente_number: "required|string|max:50",
            date_vente: "required|date",
            type: "nullable|string|max:50",
            livre_id: "required|uuid|exists:livres,id",
            quantite: "required|integer|min:0",
            remise: "sometimes|numeric|min:0|max:100",
            remarks: "nullable|string",
        };

        return buildSchemaFromControllerRules({
            rules,
            formData,
            setFormData,
            labels: {
                rep_id: "Représentant",
                client_id: "Client",
                b_vente_number: "N° BL",
                date_vente: "Date",
                type: "Type",
                livre_id: "Livre",
                quantite: "Quantité",
                remise: "Remise (%)",
                remarks: "Remarques",
            },
            overrides: {
                remarks: { inputType: "textarea" },
            },
            gridSpan: {
                remarks: "space-y-2 col-span-2",
            },
            selectItems: {
                rep_id: representants.map((r) => ({ label: r.nom, value: r.id })),
                client_id: clients.map((c) => ({ label: c.raison_sociale, value: c.id })),
                livre_id: livres.map((l) => ({ label: l.titre, value: l.id })),
            },
        });
    }, [formData, representants, clients, livres]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await bVentesClientService.create(formData);
                toast.success("BL client ajouté");
            } else if (dialogMode === "update" && rowId) {
                await bVentesClientService.update(rowId, formData);
                toast.success("BL client mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving b ventes client:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                client_id: row.client_id || row.client?.id || "",
                b_vente_number: row.b_vente_number || "",
                date_vente: row.date_vente || "",
                type: row.type || "",
                livre_id: row.livre_id || row.livre?.id || "",
                quantite: row.quantite ?? "",
                remise: row.remise ?? "",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                client_id: row.client_id || row.client?.id || "",
                b_vente_number: row.b_vente_number || "",
                date_vente: row.date_vente || "",
                type: row.type || "",
                livre_id: row.livre_id || row.livre?.id || "",
                quantite: row.quantite ?? "",
                remise: row.remise ?? "",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">BL clients</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouveau BL
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouveau BL client", update: "Modifier", view: "Détails" },
                        subtitle: { add: "Créer un BL client.", update: "Mettre à jour.", view: "Consultation." },
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

export default BLClientsPage;
