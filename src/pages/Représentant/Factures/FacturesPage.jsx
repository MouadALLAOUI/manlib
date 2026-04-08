import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import factService from "../../../api/services/factService";
import factSequenceService from "../../../api/services/factSequenceService";
import representantService from "../../../api/services/representantService";

function FacturesPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [sequences, setSequences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogMode, setDialogMode] = useState("add");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowId, setRowId] = useState("");

    const [formData, setFormData] = useState({
        rep_id: "",
        sequence_id: "",
        year_session: "",
        number: "",
        fact_number: "",
        date_facture: "",
        total_ht: "",
        tva_rate: "",
        total_ttc: "",
        status: "Brouillon",
        remarques: "",
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps, seq] = await Promise.all([
                factService.getAll(),
                representantService.getAll(),
                factSequenceService.getAll(),
            ]);
            setRows(res.data.data || res.data || []);
            setRepresentants(reps.data.data || reps.data || []);
            setSequences(seq.data.data || seq.data || []);
        } catch (error) {
            logger("Error fetching factures:", error);
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
            sequence_id: "",
            year_session: "",
            number: "",
            fact_number: "",
            date_facture: "",
            total_ht: "",
            tva_rate: "",
            total_ttc: "",
            status: "Brouillon",
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
            description: "Êtes-vous sûr de vouloir supprimer cette facture ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await factService.delete(row.id);
                    toast.success("Facture supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting facture:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("Élément non supprimé"),
        },
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "N° Facture", accessor: "fact_number || num_facture" },
        { header: "Date", accessor: "date_facture", type: "date" },
        { header: "Total HT", accessor: "total_ht", type: "money" },
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
                name: "sequence_id",
                label: "Saison",
                placeholder: "Choisir une saison",
                inputType: "select",
                required: true,
                items: sequences.map((s) => ({ label: s.nom, value: s.id })),
                value: formData.sequence_id,
                onChange: (v) => setFormData((prev) => ({ ...prev, sequence_id: v })),
            },
            {
                name: "year_session",
                label: "Année session",
                placeholder: "Ex: 2025-2026",
                required: true,
                value: formData.year_session,
                onChange: (v) => setFormData((prev) => ({ ...prev, year_session: v })),
            },
            {
                name: "number",
                label: "Numéro",
                type: "number",
                required: true,
                value: formData.number,
                onChange: (v) => setFormData((prev) => ({ ...prev, number: v })),
            },
            {
                name: "fact_number",
                label: "Facture (optionnel)",
                placeholder: "Ex: FAC-2026-001",
                value: formData.fact_number,
                onChange: (v) => setFormData((prev) => ({ ...prev, fact_number: v })),
            },
            {
                name: "date_facture",
                label: "Date facture",
                type: "date",
                required: true,
                value: formData.date_facture,
                onChange: (v) => setFormData((prev) => ({ ...prev, date_facture: v })),
            },
            {
                name: "total_ht",
                label: "Total HT",
                type: "number",
                value: formData.total_ht,
                onChange: (v) => setFormData((prev) => ({ ...prev, total_ht: v })),
            },
            {
                name: "tva_rate",
                label: "TVA (%)",
                type: "number",
                value: formData.tva_rate,
                onChange: (v) => setFormData((prev) => ({ ...prev, tva_rate: v })),
            },
            {
                name: "total_ttc",
                label: "Total TTC",
                type: "number",
                value: formData.total_ttc,
                onChange: (v) => setFormData((prev) => ({ ...prev, total_ttc: v })),
            },
            {
                name: "status",
                label: "Statut",
                inputType: "select",
                items: ["Brouillon", "Validée", "Payée", "Annulée"],
                value: formData.status,
                onChange: (v) => setFormData((prev) => ({ ...prev, status: v })),
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
        [formData, representants, sequences]
    );

    const onSubmit = async () => {
        try {
            if (dialogMode === "add") {
                await factService.create(formData);
                toast.success("Facture ajoutée");
            } else if (dialogMode === "update" && rowId) {
                await factService.update(rowId, formData);
                toast.success("Facture mise à jour");
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            logger("Error saving facture:", error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleAction = (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setRowId(row.id);
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                sequence_id: row.sequence_id || row.sequence?.id || "",
                year_session: row.year_session || "",
                number: row.number ?? "",
                fact_number: row.fact_number || row.facture_number || "",
                date_facture: row.date_facture || "",
                total_ht: row.total_ht ?? "",
                tva_rate: row.tva_rate ?? "",
                total_ttc: row.total_ttc ?? "",
                status: row.status || "Brouillon",
                remarques: row.remarques || "",
            });
            setIsDialogOpen(true);
            return;
        }
        if (type === "view") {
            setDialogMode("view");
            setFormData({
                rep_id: row.rep_id || row.representant?.id || "",
                sequence_id: row.sequence_id || row.sequence?.id || "",
                year_session: row.year_session || "",
                number: row.number ?? "",
                fact_number: row.fact_number || row.facture_number || "",
                date_facture: row.date_facture || "",
                total_ht: row.total_ht ?? "",
                tva_rate: row.tva_rate ?? "",
                total_ttc: row.total_ttc ?? "",
                status: row.status || "Brouillon",
                remarques: row.remarques || "",
            });
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Factures</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Ajouter
                        </Button>
                    }
                    schema={schema}
                    onSubmit={onSubmit}
                    config={{
                        title: { add: "Nouvelle facture", update: "Modifier la facture", view: "Détails" },
                        subtitle: { add: "Créer une facture.", update: "Mettre à jour la facture.", view: "Consultation." },
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

export default FacturesPage;
