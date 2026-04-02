import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Printer, Download, TrendingDown } from "lucide-react";

const SyntheseRemboursementPage = () => {
    const [data, setData] = useState([
        { id: 1, rep: "ADNANE BARIBI", nbRemb: "5", totalRemb: "12,500.00 DH", lastUpdate: "2026-03-25" },
        { id: 2, rep: "Noureddine", nbRemb: "3", totalRemb: "4,200.50 DH", lastUpdate: "2026-03-24" },
    ]);

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Nb Remboursements", accessor: "nbRemb" },
        { header: "Total Remboursé", accessor: "totalRemb" },
        { header: "Dernière Mise à Jour", accessor: "lastUpdate" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Synthèse des Remboursements</h1>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Exporter
                    </Button>
                    <Button className="bg-emerald-600 text-white flex items-center gap-2">
                        <Printer size={16} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Total Remboursé REP</p>
                        <p className="text-3xl font-black text-emerald-900">16,700.50 DH</p>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                        <Printer size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Nb Total Opérations</p>
                        <p className="text-3xl font-black text-slate-900">8</p>
                    </div>
                </div>
            </div>

            <CustomDataTable
                data={data}
                columns={columns}
                actions={["view", "print"]}
                onAction={(type, row) => console.log(type, row)}
                variant="green"
            />
        </div>
    );
};

export default SyntheseRemboursementPage;
