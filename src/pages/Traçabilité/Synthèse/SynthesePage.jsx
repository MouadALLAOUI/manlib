import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { BarChart3, Download } from "lucide-react";

const SyntheseTracabilitePage = () => {
    const [data] = useState([
        { id: 1, client: "LIBRAIRIE MARRAKECH", totalBL: "5", totalRemb: "1,200.00 DH", solde: "4,500.00 DH" },
        { id: 2, client: "ECOLE DU SUD", totalBL: "12", totalRemb: "0.00 DH", solde: "15,800.00 DH" },
    ]);

    const columns = [
        { header: "Client", accessor: "client" },
        { header: "Nb BL", accessor: "totalBL" },
        { header: "Total Remboursé", accessor: "totalRemb" },
        { header: "Solde Restant", accessor: "solde" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="text-slate-900" />
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse Traçabilité</h1>
                </div>
                <Button variant="outline" className="flex items-center gap-2"><Download size={16} /> Rapport</Button>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view"]} variant="dark" />
        </div>
    );
};

export default SyntheseTracabilitePage;
