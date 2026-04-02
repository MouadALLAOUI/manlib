import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { CreditCard, Download } from "lucide-react";

const RemboursementFournisseursPage = () => {
    const [data] = useState([
        { id: 1, fournisseur: "WATANYA", totalRemb: "120,000.00 DH", mode: "Multiple", status: "En cours" },
    ]);

    const columns = [
        { header: "Fournisseur", accessor: "fournisseur" },
        { header: "Total Remboursé", accessor: "totalRemb" },
        { header: "Mode Principal", accessor: "mode" },
        { header: "Statut", accessor: "status" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CreditCard className="text-emerald-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Remboursements Fournisseurs (Global)</h1>
                </div>
                <Button className="bg-emerald-600 text-white"><Download size={16} /></Button>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view"]} variant="green" />
        </div>
    );
};

export default RemboursementFournisseursPage;
