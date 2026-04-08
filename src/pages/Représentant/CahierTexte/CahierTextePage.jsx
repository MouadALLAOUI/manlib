import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import cahierCommunicationService from "../../../api/services/cahierCommunicationService";
import representantService from "../../../api/services/representantService";
import { buildSchemaFromControllerRules } from "../../../api/helpers/methodes";

function CahierTextePage() {
  const [rows, setRows] = useState([]);
  const [representants, setRepresentants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowId, setRowId] = useState("");

  const [formData, setFormData] = useState({
    rep_id: "",
    date_communication: "",
    objet: "",
    message: "",
    priorite: "Normale",
    est_lu: false,
    remarques: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [res, reps] = await Promise.all([
        cahierCommunicationService.getAll(),
        representantService.getAll(),
      ]);
      setRows(res.data.data || res.data || []);
      setRepresentants(reps.data.data || reps.data || []);
    } catch (error) {
      logger("Error fetching cahier communications:", error);
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
      date_communication: "",
      objet: "",
      message: "",
      priorite: "Normale",
      est_lu: false,
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
      description: "Êtes-vous sûr de vouloir supprimer cette entrée ?",
      actionText: "Supprimer",
      cancelText: "Annuler",
      type: "delete",
      onOk: async (row) => {
        try {
          await cahierCommunicationService.delete(row.id);
          toast.success("Entrée supprimée");
          fetchData();
        } catch (error) {
          logger("Error deleting cahier communication:", error);
          toast.error("Erreur lors de la suppression");
        }
      },
      onCancel: () => toast.error("Élément non supprimé"),
    },
  };

  const columns = [
    { header: "Représentant", accessor: "representant.nom" },
    { header: "Date", accessor: "date_communication", type: "date" },
    { header: "Objet", accessor: "objet" },
    { header: "Priorité", accessor: "priorite" },
    { header: "Lu", accessor: "est_lu", type: "bool" },
  ];

  const schema = useMemo(() => {
    const rules = {
      rep_id: "required|uuid|exists:representants,id",
      date_communication: "required|date",
      objet: "required|string|max:255",
      message: "required|string",
      priorite: "sometimes|in:Basse,Normale,Haute,Urgente",
      est_lu: "sometimes|boolean",
      remarques: "nullable|string",
    };

    return buildSchemaFromControllerRules({
      rules,
      formData,
      setFormData,
      labels: {
        rep_id: "Représentant",
        date_communication: "Date",
        objet: "Objet",
        message: "Message",
        priorite: "Priorité",
        est_lu: "Lu",
        remarques: "Remarques",
      },
      placeholders: {
        objet: "Objet",
      },
      overrides: {
        message: { inputType: "textarea" },
        remarques: { inputType: "textarea" },
      },
      selectItems: {
        rep_id: representants.map((r) => ({ label: r.nom, value: r.id })),
        est_lu: [
          { label: "Non", value: false },
          { label: "Oui", value: true },
        ],
      },
      gridSpan: {
        message: "space-y-2 col-span-2",
        remarques: "space-y-2 col-span-2",
      },
    });
  }, [formData, representants, setFormData]);

  const onSubmit = async () => {
    try {
      if (dialogMode === "add") {
        await cahierCommunicationService.create(formData);
        toast.success("Entrée ajoutée avec succès");
      } else if (dialogMode === "update" && rowId) {
        await cahierCommunicationService.update(rowId, formData);
        toast.success("Entrée mise à jour avec succès");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      logger("Error saving cahier communication:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      setDialogMode("update");
      setRowId(row.id);
      setFormData({
        rep_id: row.rep_id || row.representant?.id || "",
        date_communication: row.date_communication || "",
        objet: row.objet || "",
        message: row.message || "",
        priorite: row.priorite || "Normale",
        est_lu: !!row.est_lu,
        remarques: row.remarques || "",
      });
      setIsDialogOpen(true);
      return;
    }
    if (type === "view") {
      setDialogMode("view");
      setFormData({
        rep_id: row.rep_id || row.representant?.id || "",
        date_communication: row.date_communication || "",
        objet: row.objet || "",
        message: row.message || "",
        priorite: row.priorite || "Normale",
        est_lu: !!row.est_lu,
        remarques: row.remarques || "",
      });
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Cahier de communication</h1>
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
            title: {
              add: "Nouvelle entrée",
              update: "Modifier l'entrée",
              view: "Détails",
            },
            subtitle: {
              add: "Créer une entrée du cahier de communication.",
              update: "Mettre à jour l'entrée sélectionnée.",
              view: "Consultation de l'entrée.",
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

export default CahierTextePage;
