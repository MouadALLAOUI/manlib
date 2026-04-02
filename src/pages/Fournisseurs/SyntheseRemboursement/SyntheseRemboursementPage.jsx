import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Printer, Download } from "lucide-react";

const SyntheseRemboursementPage = () => {
    const [data] = useState([
        { id: 1, fournisseur: "WATANYA", totalRemb: "45,000.00 DH", mode: "Chèque", date: "2026-03-20" },
        { id: 2, fournisseur: "BEST BM", totalRemb: "12,000.00 DH", mode: "Virement", date: "2026-03-15" },
    ]);

    const columns = [
        { header: "Fournisseur", accessor: "fournisseur" },
        { header: "Montant Remboursé", accessor: "totalRemb" },
        { header: "Mode", accessor: "mode" },
        { header: "Date", accessor: "date" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fournisseurs - Synthèse Remboursements</h1>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} />
                    </Button>
                    <Button className="bg-slate-900 hover:bg-black text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg shadow-slate-200 transition-all">
                        <Printer size={18} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <CustomDataTable
                    data={data}
                    columns={columns}
                    actions={["view", "imp"]}
                    variant="slate"
                />
            </div>
        </div>
    );
};

export default SyntheseRemboursementPage;
