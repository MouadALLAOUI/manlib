import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import clientRemboursementService from "../../../api/services/clientRemboursementService";
import representantService from "../../../api/services/representantService";
import clientService from "../../../api/services/clientService";
import banqueService from "../../../api/services/banqueService";

function RemboursementClientPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [clients, setClients] = useState([]);
    const [banques, setBanques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        client_id: "",
        date_payment: "",
        banque_id: "",
        banque_nom: "",
        cheque_number: "",
        cheque_image_path: "",
        a_lordre_de: "",
        montant: "",
        observation: "",
        remarks: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, cls, bq] = await Promise.all([
                clientRemboursementService.getAll(),
                representantService.getAll(),
                clientService.getAll(),
                banqueService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
            setClients(cls.data.data || cls.data || []);
            setBanques(bq.data.data || bq.data || []);
        } catch (error) {
            logger("Error fetching client remboursements:", error);
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
            date_payment: "",
            banque_id: "",
            banque_nom: "",
            cheque_number: "",
            cheque_image_path: "",
            a_lordre_de: "",
            montant: "",
            observation: "",
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
            description: "Êtes-vous sûr de vouloir supprimer ce remboursement client ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await clientRemboursementService.delete(row.id);
                    toast.success("Remboursement supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting client remboursement:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Client", accessor: "client.raison_sociale" },
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Date", accessor: "date_payment", type: "date" },
        { header: "Montant (DH)", accessor: "montant", type: "money" },
        { header: "Banque", accessor: "banque.nom || banque_nom" },
        { header: "Chèque N°", accessor: "cheque_number" },
        { header: "À l'ordre de", accessor: "a_lordre_de" },
    ];

    const schema = useMemo(() => {
        const rules = {
            rep_id: "required|uuid|exists:representants,id",
            client_id: "required|uuid|exists:clients,id",
            date_payment: "required|date",
            banque_id: "nullable|uuid|exists:banques,id",
            banque_nom: "nullable|string|max:100",
            cheque_number: "nullable|string|max:50",
            cheque_image_path: "nullable|string",
            a_lordre_de: "nullable|string|max:255",
            montant: "required|numeric|min:0",
            observation: "nullable|string",
            remarks: "nullable|string",
        };

        return buildSchemaFromControllerRules({
            rules,
            formData,
            setFormData,
            labels: {
                rep_id: "Représentant",
                client_id: "Client",
                date_payment: "Date",
                banque_id: "Banque",
                banque_nom: "Banque (texte)",
                cheque_number: "N° chèque",
                cheque_image_path: "Chemin image chèque",
                a_lordre_de: "À l'ordre de",
                montant: "Montant (DH)",
                observation: "Observation",
                remarks: "Remarques",
            },
            selectItems: {
                rep_id: representants.map((r) => ({ label: r.nom, value: r.id })),
                client_id: clients.map((c) => ({ label: c.raison_sociale, value: c.id })),
                banque_id: banques.map((b) => ({ label: b.nom, value: b.id })),
            },
            overrides: {
                observation: { inputType: "textarea" },
                remarks: { inputType: "textarea" },
            },
            gridSpan: {
                observation: "space-y-2 col-span-2",
                remarks: "space-y-2 col-span-2",
            },
        });
    }, [formData, representants, clients, banques]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await clientRemboursementService.create(formData);
                toast.success("Remboursement ajouté");
            } else if (dialogMode === "update" && rowId) {
                await clientRemboursementService.update(rowId, formData);
                toast.success("Remboursement mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving client remboursement:", error);
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
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                cheque_image_path: row.cheque_image_path || "",
                a_lordre_de: row.a_lordre_de || "",
                montant: row.montant ?? "",
                observation: row.observation || "",
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
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                cheque_image_path: row.cheque_image_path || "",
                a_lordre_de: row.a_lordre_de || "",
                montant: row.montant ?? "",
                observation: row.observation || "",
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Remboursements clients</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Nouveau remboursement
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouveau remboursement", update: "Modifier", view: "Détails" },
                        subtitle: { add: "Enregistrer un remboursement client.", update: "Mettre à jour le remboursement.", view: "Consultation." },
                        submitLabel: dialogMode === "add" ? "Créer" : "Enregistrer",
                    }}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={rows}
                    columns={columns}
                    pageSize={10}
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

export default RemboursementClientPage;
