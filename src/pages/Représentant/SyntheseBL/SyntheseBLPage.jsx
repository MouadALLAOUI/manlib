import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Printer, Download } from "lucide-react";

const SyntheseBLPage = () => {
    const [data, setData] = useState([
        { id: 1, rep: "ADNANE BARIBI", totalBL: "15", totalMontant: "125,000.00 DH", lastUpdate: "2026-03-25" },
        { id: 2, rep: "Noureddine", totalBL: "8", totalMontant: "42,300.50 DH", lastUpdate: "2026-03-24" },
    ]);

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Nombre de BL", accessor: "totalBL" },
        { header: "Montant Total", accessor: "totalMontant" },
        { header: "Dernière Mise à Jour", accessor: "lastUpdate" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Synthèse des Bons de Livraison</h1>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Exporter (CSV)
                    </Button>
                    <Button className="bg-blue-600 text-white flex items-center gap-2">
                        <Printer size={16} /> Imprimer Tout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Total BL (Saison)</p>
                    <p className="text-2xl font-bold text-blue-900">23</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-emerald-900">167,300.50 DH</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Représentants Actifs</p>
                    <p className="text-2xl font-bold text-slate-900">2</p>
                </div>
            </div>

            <CustomDataTable
                data={data}
                columns={columns}
                actions={["view", "print"]}
                onAction={(type, row) => console.log(type, row)}
                variant="blue"
            />
        </div>
    );
};

export default SyntheseBLPage;
