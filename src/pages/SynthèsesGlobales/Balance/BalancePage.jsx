import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Printer, Download, Scale } from "lucide-react";

const BalancePage = () => {
    const [data] = useState([
        { id: 1, compte: "Stocks Livres", debit: "450,000.00", credit: "0.00", solde: "450,000.00" },
        { id: 2, compte: "Dettes Fournisseurs", debit: "0.00", credit: "120,500.00", solde: "-120,500.00" },
        { id: 3, compte: "Créances REP", debit: "85,200.00", credit: "0.00", solde: "85,200.00" },
    ]);

    const columns = [
        { header: "Intitulé du Compte", accessor: "compte" },
        { header: "Débit (DH)", accessor: "debit" },
        { header: "Crédit (DH)", accessor: "credit" },
        { header: "Solde (DH)", accessor: "solde" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Scale size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Balance Générale</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download size={16} /></Button>
                    <Button className="bg-blue-600 text-white flex items-center gap-2"><Printer size={16} /> Imprimer</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Actif</p>
                    <p className="text-2xl font-black text-blue-600">535,200.00 DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Passif</p>
                    <p className="text-2xl font-black text-red-600">120,500.00 DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Résultat Net</p>
                    <p className="text-2xl font-black text-emerald-600">+414,700.00 DH</p>
                </div>
            </div>

            <CustomDataTable
                data={data}
                columns={columns}
                variant="blue"
                pageSize={10}
            />
        </div>
    );
};

export default BalancePage;
