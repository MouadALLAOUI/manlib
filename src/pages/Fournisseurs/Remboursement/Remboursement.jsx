import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { FileText, Save, RotateCcw, FileDown } from "lucide-react";
import { MyTable } from "../../../components/ui/myTable";
import toast from "react-hot-toast";
import rembImpService from "../../../api/services/rembImpService";
import logger from "../../../lib/logger";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import imprimeurService from "../../../api/services/imprimeurService";
import banqueService from "../../../api/services/banqueService";

const FournisseurRemboursement = () => {
  const [formData, setFormData] = useState({
    imprimeur_id: "",
    date_payment: "",
    banque_id: "",
    banque_nom: "",
    cheque_image_path: "",
    cheque_number: "",
    montant: "",
  });
  const [remboursement, setRemboursement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imprimeurs, setImprimeurs] = useState([]);
  const [banque, setBanque] = useState([]);

  const actionsDetaille = {
    delete: {
      title: "Supprimer",
      description: "Êtes-vous sûr de vouloir supprimer cette Remboursement?",
      actionText: "Supprimer",
      cancelText: "Annuler",
      type: "delete",
      onOk: async (row) => {
        try {
          await rembImpService.delete(row.id);
          toast.success("Remboursement supprimée");
          fetchData();
        } catch (error) {
          logger("Error deleting Remboursement:", error);
          toast.error("Erreur lors de la suppression");
        }
      },
      onCancel: () => toast.error("element pas supprimé"),
    },
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentRembId, setCurrentRembId] = useState(null);

  const columns = [
    { header: "Fournisseur", accessor: "imprimeur.raison_sociale" },
    { header: "Date", accessor: "date_payment", type: "date" },
    { header: "Banque", accessor: "banque.nom || banque_nom" },
    { header: "Chèque N°", accessor: "cheque_number" },
    { header: "Montant (DH)", accessor: "montant", type: "money" },
    { header: "Reçu", accessor: "statut_recu", type: "bool", onClick: (row) => handleUpdateStatusRecuRemb(row) },
    { header: "Rejeté", accessor: "statut_rejete", type: "bool", onClick: (row) => handleUpdateStatusRejeteRemb(row) },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [impRemb, imp, bank] = await Promise.all([
        rembImpService.getAll(),
        imprimeurService.getAll(),
        banqueService.getAll()
      ]);
      setRemboursement(impRemb.data.data || impRemb.data);
      setImprimeurs(imp.data.data || imp.data);
      setBanque(bank.data.data || bank.data);
      logger({ remb: impRemb.data, imp: imp.data.data, bank: bank.data })
    } catch (error) {
      console.error("Error fetching Rembourcement:", error);
      toast.error("Erreur lors du chargement des Rembourcement");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    logger(formData);
  }, [formData]);

  const handleReset = () => {
    setFormData({
      imprimeur_id: "",
      date_payment: "",
      banque_id: "",
      banque_nom: "",
      cheque_image_path: "",
      cheque_number: "",
      montant: "",
    });
  };

  const handleAction = (type, row) => {
    if (type === "edit") {
      setCurrentRembId(row.id);
      setFormData({
        imprimeur_id: row.imprimeur_id,
        date_payment: row.date_payment,
        banque_id: row.banque_id || "",
        banque_nom: row.banque_nom || "",
        cheque_number: row.cheque_number,
        montant: row.montant,
      });
      setIsUpdateDialogOpen(true);
    }
  };

  const handleUpdateStatusRecuRemb = async (row) => {
    try {
      const newStatus = !row.statut_recu;
      await rembImpService.update(row.id, { statut_recu: newStatus });
      toast.success(newStatus ? "Marqué comme reçu" : "Marqué comme non reçu");
      fetchData(); // Refresh the table
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    }
  }
  const handleUpdateStatusRejeteRemb = async (row) => {
    try {
      const newStatus = !row.statut_rejete;
      await rembImpService.update(row.id, { statut_rejete: newStatus });
      toast.success(newStatus ? "Paiement rejeté" : "Rejet annulé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    }
  }

  const handleUpdateRemb = async () => {
    setIsLoading(true);
    try {
      await rembImpService.update(currentRembId, formData);
      toast.success("Remboursement mis à jour avec succès");
      setIsUpdateDialogOpen(false);
      handleReset();
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la modification");
      logger(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRemb = async () => {
    setIsLoading(true)
    try {
      const data = formData;
      await rembImpService.create(data);
      toast.success("Remboursements ajouté avec succès");
      setIsAddDialogOpen(false);
      handleReset();
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la Remboursements");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header section with Stats - Updated to Slate Theme */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des Remboursements (MSM-MEDIAS --&gt; Fournisseur)</h1>
        <RembAddDialog
          fields={formData}
          fieldsFunc={setFormData}
          onSubmit={handleAddRemb}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          handleReset={handleReset}
          imprimeurs={imprimeurs}
          banque={banque}
        />

        <RembUpdateDialog
          fields={formData}
          fieldsFunc={setFormData}
          onSubmit={handleUpdateRemb}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          imprimeurs={imprimeurs}
          banque={banque}
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
          <FileText className="text-white" size={20} />
          <h2 className="text-white font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex gap-4 text-sm font-normal border-l border-slate-700 pl-4 ml-2">
              <span>Crédit : <span className="text-slate-300 font-bold">0.00 DH</span></span>
              <span>Avance : <span className="text-slate-300 font-bold">0.00 DH</span></span>
              <span>Reste : <span className="text-slate-300 font-bold">0.00 DH</span></span>
            </div>
          </h2>
        </div>

        <div className="p-6">
          {/* Synthesis Link - Updated to Slate Theme */}
          <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer mb-2 group w-fit transition-colors">
            <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-slate-100 transition-all duration-200 shadow-sm border border-slate-100">
              <FileDown size={28} className="text-slate-700" />
            </div>
            <span className="font-bold text-xl underline underline-offset-4 decoration-1">Voir la Synthèse</span>
          </div>

          <div className="overflow-x-auto">
            <MyTable
              data={remboursement}
              columns={columns}
              pageSize={5}
              actions={["edit", "delete"]}
              onAction={handleAction}
              variant="slate"
              isLoading={isLoading}
              actionsDetaille={actionsDetaille}
              enableSearch enableSorting
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RembAddDialog = ({
  fields,
  fieldsFunc,
  imprimeurs,
  banque,
  onSubmit = () => { },
  handleReset = () => { },
  open,
  onOpenChange
}) => {
  const contentText = {
    header: {
      title: "Nouvelle Remboursement",
      subtitle: "Enregistrer une nouvelle Remboursement dans le système."
    },
    fieldsText: {
      imprimeur_id: {
        label: "Fournisseur",
        placeholder: "Choisir fournisseur",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2 col-span-2",
      },
      date_payment: {
        label: "Date",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
      banque: {
        label: "Banque",
        placeholder: "Choisir banque",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
      cheque_number: {
        label: "N° de Chèque",
        placeholder: "Entrer n° chèque",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
      montant: {
        label: "Montant (DH)",
        placeholder: "0.00",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
    },
    footer: {
      cancel: "Annuler",
      submit: "Enregistrer Remboursement"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
          + Ajouter un Remboursement
        </Button>
      </DialogTrigger>
      <MyDialogContent
        contentText={contentText}
        fields={fields}
        fieldsFunc={fieldsFunc}
        onSubmit={onSubmit}
        imprimeurs={imprimeurs}
        handleReset={handleReset}
        banque={banque}
      />
    </Dialog>
  );
};

const RembUpdateDialog = ({ fields, fieldsFunc, imprimeurs, banque, onSubmit = () => { }, open, onOpenChange }) => {
  const contentText = {
    header: {
      title: "Modifier le Remboursement",
      subtitle: "Mettre à jour les informations du paiement fournisseur."
    },
    fieldsText: {
      imprimeur_id: {
        label: "Fournisseur",
        placeholder: "Choisir fournisseur",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2 col-span-2",
      },
      date_payment: {
        label: "Date",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
      banque: {
        label: "Banque",
        placeholder: "Choisir banque",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
      cheque_number: {
        label: "N° de Chèque",
        placeholder: "Entrer n° chèque",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
      montant: {
        label: "Montant (DH)",
        placeholder: "0.00",
        labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
        inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
        className: "space-y-2"
      },
    },
    footer: {
      cancel: "Annuler",
      submit: "Enregistrer les modifications"
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <MyDialogContent
        contentText={contentText}
        fields={fields}
        fieldsFunc={fieldsFunc}
        onSubmit={onSubmit}
        imprimeurs={imprimeurs}
        banque={banque}
        // Hide the reset button for update
        handleReset={null}
      />
    </Dialog>
  );
};

const MyDialogContent = ({
  contentText,
  fields,
  imprimeurs,
  banque,
  fieldsFunc = () => { },
  onSubmit = () => { },
  handleReset = () => { },
  footer = true
}) => {
  return (
    <DialogContent className="sm:max-w-[800px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
      <DialogHeader className="bg-slate-900 p-8 text-white">
        <DialogTitle className="text-2xl font-black tracking-tight uppercase">{contentText.header.title}</DialogTitle>
        <p className="text-slate-400 text-sm mt-1">{contentText.header.subtitle}</p>
      </DialogHeader>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">

        <FormInputRow
          inputType="select"
          items={imprimeurs.map(i => ({ label: i.raison_sociale, value: i.id }))}
          value={fields.imprimeur_id}
          onChange={(val) => fieldsFunc({ ...fields, imprimeur_id: val })}
          {...contentText.fieldsText.imprimeur_id}
        />
        <FormInputRow
          {...contentText.fieldsText.date_payment}
          type="date"
          value={fields.date_payment}
          onChange={(val) => fieldsFunc({ ...fields, date_payment: val })}
        />
        <FormInputRow
          {...contentText.fieldsText.banque}
          inputType="select"
          items={banque.map(i => ({ label: i.nom, value: i.id }))}
          value={fields.banque_id}
          onChange={(val) => {
            const selectedBank = banque.find(b => b.id === val);
            fieldsFunc({
              ...fields,
              banque_id: val,
              banque_nom: selectedBank ? selectedBank.nom : ""
            });
          }}
        />
        <FormInputRow
          value={fields.cheque_number}
          onChange={(val) => fieldsFunc({ ...fields, cheque_number: val })}
          {...contentText.fieldsText.cheque_number}
        />
        <FormInputRow
          type="number"
          value={fields.montant}
          onChange={(val) => fieldsFunc({ ...fields, montant: val })}
          {...contentText.fieldsText.montant}
        />
      </div>
      <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
        <DialogClose asChild>
          <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200">{contentText.footer.cancel}</Button>
        </DialogClose>
        <Button
          variant="outline"
          onClick={handleReset}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-10 h-12 rounded-lg font-bold shadow-sm transition-all hover:scale-[1.02] flex items-center gap-2"
        >
          <RotateCcw size={20} />
        </Button>
        {footer && <Button
          onClick={onSubmit}
          className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 transition-all"
        >
          <Save size={20} />{contentText.footer.submit}
        </Button>}
      </DialogFooter>
    </DialogContent>
  )
}

export default FournisseurRemboursement;
