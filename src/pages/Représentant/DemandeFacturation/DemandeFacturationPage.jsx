import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import demandeFService from "../../../api/services/demandeFService";
import representantService from "../../../api/services/representantService";
import clientService from "../../../api/services/clientService";

function DemandeFacturationPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        client_id: "",
        date_demande: "",
        objet: "",
        contenu: "",
        statut: "En attente",
        remarks: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, cls] = await Promise.all([
                demandeFService.getAll(),
                representantService.getAll(),
                clientService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
            setClients(cls.data.data || cls.data || []);
        } catch (error) {
            logger("Error fetching demande facturation:", error);
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
            client_id: "",
            date_demande: "",
            objet: "",
            contenu: "",
            statut: "En attente",
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
            description: "Êtes-vous sûr de vouloir supprimer cette demande ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await demandeFService.delete(row.id);
                    toast.success("Demande supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting demande:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Client", accessor: "client.nom" },
        { header: "Date", accessor: "date_demande", type: "date" },
        { header: "Objet", accessor: "objet" },
        { header: "Statut", accessor: "statut" },
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
                name: "client_id",
                label: "Client",
                placeholder: "Choisir un client",
                inputType: "select",
                required: true,
                items: clients.map((c) => ({ label: c.nom, value: c.id })),
                value: formData.client_id,
                onChange: (v) => setFormData((prev) => ({ ...prev, client_id: v })),
            },
            {
                name: "date_demande",
                label: "Date de demande",
                type: "date",
                required: true,
                value: formData.date_demande,
                onChange: (v) => setFormData((prev) => ({ ...prev, date_demande: v })),
            },
            {
                name: "objet",
                label: "Objet",
                placeholder: "Objet",
                value: formData.objet,
                onChange: (v) => setFormData((prev) => ({ ...prev, objet: v })),
                className: "space-y-2 col-span-2",
            },
            {
                name: "contenu",
                label: "Contenu",
                inputType: "textarea",
                value: formData.contenu,
                onChange: (v) => setFormData((prev) => ({ ...prev, contenu: v })),
                className: "space-y-2 col-span-2",
            },
            {
                name: "statut",
                label: "Statut",
                inputType: "select",
                items: ["En attente", "Approuvée", "Rejetée", "Facturée"],
                value: formData.statut,
                onChange: (v) => setFormData((prev) => ({ ...prev, statut: v })),
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
        [formData, representants, clients]
    );

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await demandeFService.create(formData);
                toast.success("Demande ajoutée");
            } else if (dialogMode === "update" && rowId) {
                await demandeFService.update(rowId, formData);
                toast.success("Demande mise à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving demande:", error);
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
                date_demande: row.date_demande || "",
                objet: row.objet || "",
                contenu: row.contenu || "",
                statut: row.statut || "En attente",
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
                date_demande: row.date_demande || "",
                objet: row.objet || "",
                contenu: row.contenu || "",
                statut: row.statut || "En attente",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Demandes de facturation</h1>
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
                            add: "Créer une demande de facturation.",
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

export default DemandeFacturationPage;
