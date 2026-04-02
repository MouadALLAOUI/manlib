import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const RembourserFacturePage = () => {
  const [data, setData] = useState([
    { id: 1, rep: "ADNANE BARIBI", factRef: "FAC-2026-001", montant: "1250.00 DH", mode: "Virement", status: "Confirmé" },
    { id: 2, rep: "Noureddine", factRef: "FAC-2026-005", montant: "500.00 DH", mode: "Espèces", status: "En attente" },
  ]);

  const [formData, setFormData] = useState({
    rep: "",
    factRef: "",
    montant: "",
    mode: "Virement",
  });

  const columns = [
    { header: "Représentant", accessor: "rep" },
    { header: "Réf. Facture", accessor: "factRef" },
    { header: "Montant", accessor: "montant" },
    { header: "Mode", accessor: "mode" },
    { header: "Statut", accessor: "status" },
  ];

  const handleAction = (type, row) => {
    if (type === "delete") {
      setData(data.filter(item => item.id !== row.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Remboursement de Facture</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Rembourser une Facture</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Action - Remboursement Facture</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormInputRow
                label="Représentant"
                value={formData.rep}
                onChange={(v) => setFormData({ ...formData, rep: v })}
                placeholder="Nom du représentant"
              />
              <FormInputRow
                label="Référence Facture"
                value={formData.factRef}
                onChange={(v) => setFormData({ ...formData, factRef: v })}
                placeholder="FAC-XXXX-XXX"
              />
              <FormInputRow
                label="Montant à rembourser (DH)"
                type="number"
                value={formData.montant}
                onChange={(v) => setFormData({ ...formData, montant: v })}
                placeholder="0.00"
              />
              <FormInputRow
                label="Mode de Paiement"
                inputType="select"
                items={["Virement", "Chèque", "Espèces"]}
                value={formData.mode}
                onChange={(v) => setFormData({ ...formData, mode: v })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Annuler</Button>
              <Button className="bg-red-600 text-white">Valider Remboursement</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CustomDataTable
        data={data}
        columns={columns}
        actions={["view", "edit", "delete"]}
        onAction={handleAction}
        variant="dark"
      />
    </div>
  );
};

export default RembourserFacturePage;
