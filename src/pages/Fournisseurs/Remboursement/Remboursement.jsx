import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { FileText, Save, RotateCcw, FileDown } from "lucide-react";

const FournisseurRemboursement = () => {
  const [formData, setFormData] = useState({
    fournisseur: "",
    date: "",
    banque: "",
    chequeNo: "",
    montant: "",
  });

  const [data] = useState([
    {
      id: 1,
      fournisseur: "WATANYA",
      date: "2026-03-25",
      banque: "BMCE",
      chequeNo: "CH-12345",
      montant: "15,000.00 DH",
      recu: true,
      rejete: false
    },
    {
      id: 2,
      fournisseur: "BEST BM",
      date: "2026-03-24",
      banque: "CIH",
      chequeNo: "CH-98765",
      montant: "8,500.00 DH",
      recu: false,
      rejete: false
    },
  ]);

  const columns = [
    { header: "Fournisseur", accessor: "fournisseur" },
    { header: "Date", accessor: "date" },
    { header: "Banque", accessor: "banque" },
    { header: "Chèque N°", accessor: "chequeNo" },
    { header: "Montant (DH)", accessor: "montant" },
    { header: "Reçu", accessor: "recu" },
    { header: "Rejeté", accessor: "rejete" },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleReset = () => {
    setFormData({
      fournisseur: "",
      date: "",
      banque: "",
      chequeNo: "",
      montant: "",
    });
  };

  const handleAction = (type, row) => {
    console.log(`Action: ${type} on row:`, row);
  };

  return (
    <div className="space-y-6">
      {/* Header section with Stats - Updated to Slate Theme */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
          <FileText className="text-white" size={20} />
          <h2 className="text-white font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Liste des Remboursements (MSM-MEDIAS --&gt; Fournisseur)</span>
            <div className="flex gap-4 text-sm font-normal border-l border-slate-700 pl-4 ml-2">
              <span>Crédit : <span className="text-slate-300 font-bold">0.00 DH</span></span>
              <span>Avance : <span className="text-slate-300 font-bold">0.00 DH</span></span>
              <span>Reste : <span className="text-slate-300 font-bold">0.00 DH</span></span>
            </div>
          </h2>
        </div>

        <div className="p-6">
          {/* Synthesis Link - Updated to Slate Theme */}
          <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer mb-8 group w-fit transition-colors">
            <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-slate-100 transition-all duration-200 shadow-sm border border-slate-100">
              <FileDown size={28} className="text-slate-700" />
            </div>
            <span className="font-bold text-xl underline underline-offset-4 decoration-1">Voir la Synthèse</span>
          </div>

          <div className="overflow-x-auto">
            <CustomDataTable
              data={data}
              columns={columns}
              actions={["edit", "delete"]}
              onAction={handleAction}
              variant="slate"
            />
          </div>
        </div>
      </div>

      {/* Form Section - Updated to Slate Theme */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-6 py-4 flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded-md">
            <span className="text-white font-black text-xl leading-none">+</span>
          </div>
          <h2 className="text-white font-bold text-xl tracking-tight">Remboursement</h2>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            <FormInputRow
              label="Fournisseur"
              inputType="select"
              items={["WATANYA", "BEST BM", "AL MANAR"]}
              value={formData.fournisseur}
              onChange={(val) => handleInputChange("fournisseur", val)}
              placeholder="Choisir fournisseur"
            />
            <FormInputRow
              label="Date"
              type="date"
              value={formData.date}
              onChange={(val) => handleInputChange("date", val)}
            />
            <FormInputRow
              label="banque"
              inputType="select"
              items={["BMCE", "CIH", "ATTIJARI", "BP"]}
              value={formData.banque}
              onChange={(val) => handleInputChange("banque", val)}
              placeholder="Choisir banque"
            />
            <FormInputRow
              label="N° de Chèque"
              value={formData.chequeNo}
              onChange={(val) => handleInputChange("chequeNo", val)}
              placeholder="Entrer n° chèque"
            />
            <FormInputRow
              label="Montant (DH)"
              type="number"
              value={formData.montant}
              onChange={(val) => handleInputChange("montant", val)}
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
            <Button className="bg-slate-900 hover:bg-black text-white px-10 h-12 rounded-lg font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] flex items-center gap-2">
              <Save size={20} /> Valider
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-10 h-12 rounded-lg font-bold shadow-sm transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <RotateCcw size={20} /> Vider les champs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FournisseurRemboursement;
