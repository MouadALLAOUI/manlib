import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import repRemboursementService from "../../../api/services/repRemboursementService";
import representantService from "../../../api/services/representantService";
import banqueService from "../../../api/services/banqueService";

function RembourserFacturePage() {
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
        name: "date_payment",
        label: "Date",
        type: "date",
        required: true,
        value: formData.date_payment,
        onChange: (v) => setFormData((prev) => ({ ...prev, date_payment: v })),
      },
      {
        name: "banque_id",
        label: "Banque",
        placeholder: "Choisir banque",
        inputType: "select",
        items: banques.map((b) => ({ label: b.nom, value: b.id })),
        value: formData.banque_id,
        onChange: (v) => {
          const selected = banques.find((b) => b.id === v);
          setFormData((prev) => ({
            ...prev,
            banque_id: v,
            banque_nom: selected ? selected.nom : "",
          }));
        },
      },
      {
        name: "banque_nom",
        label: "Banque (texte)",
        placeholder: "Banque si non listée",
        value: formData.banque_nom,
        onChange: (v) => setFormData((prev) => ({ ...prev, banque_nom: v })),
      },
      {
        name: "cheque_number",
        label: "N° chèque",
        placeholder: "Numéro de chèque",
        value: formData.cheque_number,
        onChange: (v) => setFormData((prev) => ({ ...prev, cheque_number: v })),
      },
      {
        name: "type_versement",
        label: "Type de versement",
        inputType: "select",
        items: ["En main propre", "Virement", "Versement"],
        value: formData.type_versement,
        onChange: (v) => setFormData((prev) => ({ ...prev, type_versement: v })),
      },
      {
        name: "montant",
        label: "Montant (DH)",
        type: "number",
        required: true,
        value: formData.montant,
        onChange: (v) => setFormData((prev) => ({ ...prev, montant: v })),
      },
      {
        name: "date_prevue",
        label: "Date prévue",
        type: "date",
        value: formData.date_prevue,
        onChange: (v) => setFormData((prev) => ({ ...prev, date_prevue: v })),
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
    [formData, representants, banques]
  );

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
              + Ajouter
            </Button>
          }
          schema={schema}
          onSubmit={onSubmit}
          config={{
            title: { add: "Nouveau remboursement", update: "Modifier", view: "Détails" },
            subtitle: { add: "Créer un remboursement.", update: "Mettre à jour.", view: "Consultation." },
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

export default RembourserFacturePage;
