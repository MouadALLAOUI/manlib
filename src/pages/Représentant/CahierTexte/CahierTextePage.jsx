import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const CahierTextePage = () => {
  const [data, setData] = useState([
    { id: 1, rep: "ADNANE BARIBI", ecole: "ECOLE TEST", niveau: "Primaire", date: "2026-03-25", status: "Validé" },
    { id: 2, rep: "Noureddine", ecole: "AL AMAL", niveau: "Collège", date: "2026-03-24", status: "En attente" },
  ]);

  const [formData, setFormData] = useState({
    rep: "",
    ecole: "",
    niveau: "Primaire",
    date: "",
  });

  const columns = [
    { header: "Représentant", accessor: "rep" },
    { header: "École", accessor: "ecole" },
    { header: "Niveau", accessor: "niveau" },
    { header: "Date", accessor: "date" },
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
        <h1 className="text-2xl font-bold text-slate-800">Cahier de Texte</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ajouter une entrée</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouvelle entrée - Cahier de texte</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormInputRow
                label="Représentant"
                value={formData.rep}
                onChange={(v) => setFormData({ ...formData, rep: v })}
                placeholder="Nom du représentant"
              />
              <FormInputRow
                label="École"
                value={formData.ecole}
                onChange={(v) => setFormData({ ...formData, ecole: v })}
                placeholder="Nom de l'école"
              />
              <FormInputRow
                label="Niveau"
                inputType="select"
                items={["Primaire", "Collège", "Lycée"]}
                value={formData.niveau}
                onChange={(v) => setFormData({ ...formData, niveau: v })}
              />
              <FormInputRow
                label="Date"
                type="date"
                value={formData.date}
                onChange={(v) => setFormData({ ...formData, date: v })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Annuler</Button>
              <Button className="bg-blue-600 text-white">Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CustomDataTable
        data={data}
        columns={columns}
        actions={["view", "edit", "delete"]}
        onAction={handleAction}
        variant="blue"
      />
    </div>
  );
};

export default CahierTextePage;
