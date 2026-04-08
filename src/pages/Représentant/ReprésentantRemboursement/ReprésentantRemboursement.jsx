import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";
import repRemboursementService from "../../../api/services/repRemboursementService";
import representantService from "../../../api/services/representantService";
import banqueService from "../../../api/services/banqueService";

function ReprésentantRemboursement() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [banques, setBanques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        date_payment: "",
        banque_id: "",
        banque_nom: "",
        cheque_number: "",
        cheque_image_path: "",
        type_versement: "Versement",
        montant: "",
        date_prevue: "",
        statut_recu: false,
        statut_rejete: false,
        statut_accepte: false,
        remarks: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, bq] = await Promise.all([
                repRemboursementService.getAll(),
                representantService.getAll(),
                banqueService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
            setBanques(bq.data.data || bq.data || []);
        } catch (error) {
            logger("Error fetching rep remboursements:", error);
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
            date_payment: "",
            banque_id: "",
            banque_nom: "",
            cheque_number: "",
            cheque_image_path: "",
            type_versement: "Versement",
            montant: "",
            date_prevue: "",
            statut_recu: false,
            statut_rejete: false,
            statut_accepte: false,
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
            description: "Êtes-vous sûr de vouloir supprimer ce remboursement ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await repRemboursementService.delete(row.id);
                    toast.success("Remboursement supprimé");
                    fetchData();
                } catch (error) {
                    logger("Error deleting rep remboursement:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Date", accessor: "date_payment", type: "date" },
        { header: "Banque", accessor: "banque.nom || banque_nom" },
        { header: "Type", accessor: "type_versement" },
        { header: "Montant (DH)", accessor: "montant", type: "money" },
        { header: "Reçu", accessor: "statut_recu", type: "bool" },
        { header: "Rejeté", accessor: "statut_rejete", type: "bool" },
        { header: "Accepté", accessor: "statut_accepte", type: "bool" },
    ];

    const schema = useMemo(() => {
        const rules = {
            rep_id: "required|uuid|exists:representants,id",
            date_payment: "required|date",
            banque_id: "nullable|uuid|exists:banques,id",
            banque_nom: "nullable|string|max:100",
            cheque_number: "nullable|string|max:50",
            cheque_image_path: "nullable|string",
            type_versement: "required|in:En main propre,Virement,Versement",
            montant: "required|numeric|min:0",
            date_prevue: "nullable|date",
            statut_recu: "sometimes|boolean",
            statut_rejete: "sometimes|boolean",
            statut_accepte: "sometimes|boolean",
            remarks: "nullable|string",
        };

        return buildSchemaFromControllerRules({
            rules,
            formData,
            setFormData,
            labels: {
                rep_id: "Représentant",
                date_payment: "Date",
                banque_id: "Banque",
                banque_nom: "Banque (texte)",
                cheque_number: "N° chèque",
                cheque_image_path: "Chemin image chèque",
                type_versement: "Type de versement",
                montant: "Montant (DH)",
                date_prevue: "Date prévue",
                statut_recu: "Reçu",
                statut_rejete: "Rejeté",
                statut_accepte: "Accepté",
                remarks: "Remarques",
            },
            selectItems: {
                rep_id: representants.map((r) => ({ label: r.nom, value: r.id })),
                banque_id: banques.map((b) => ({ label: b.nom, value: b.id })),
                statut_recu: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
                statut_rejete: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
                statut_accepte: [
                    { label: "Non", value: false },
                    { label: "Oui", value: true },
                ],
            },
            overrides: {
                remarks: { inputType: "textarea" },
            },
            gridSpan: {
                remarks: "space-y-2 col-span-2",
            },
        });
    }, [formData, representants, banques]);

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await repRemboursementService.create(formData);
                toast.success("Remboursement ajouté");
            } else if (dialogMode === "update" && rowId) {
                await repRemboursementService.update(rowId, formData);
                toast.success("Remboursement mis à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving rep remboursement:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                cheque_image_path: row.cheque_image_path || "",
                type_versement: row.type_versement || "Versement",
                montant: row.montant ?? "",
                date_prevue: row.date_prevue || "",
                statut_recu: !!row.statut_recu,
                statut_rejete: !!row.statut_rejete,
                statut_accepte: !!row.statut_accepte,
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                date_payment: row.date_payment || "",
                banque_id: row.banque_id || row.banque?.id || "",
                banque_nom: row.banque_nom || row.banque?.nom || "",
                cheque_number: row.cheque_number || "",
                cheque_image_path: row.cheque_image_path || "",
                type_versement: row.type_versement || "Versement",
                montant: row.montant ?? "",
                date_prevue: row.date_prevue || "",
                statut_recu: !!row.statut_recu,
                statut_rejete: !!row.statut_rejete,
                statut_accepte: !!row.statut_accepte,
                remarks: row.remarks || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Remboursements (Représentant)</h1>
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
                        subtitle: { add: "Enregistrer un remboursement.", update: "Mettre à jour le remboursement.", view: "Consultation." },
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

export default ReprésentantRemboursement;
