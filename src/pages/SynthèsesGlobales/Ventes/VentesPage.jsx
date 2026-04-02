import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { TrendingUp, Download } from "lucide-react";

const VentesPage = () => {
    const [data] = useState([
        { id: 1, article: "Livre Info N1", qte: "500", prixUnit: "25.00 DH", total: "12,500.00 DH" },
        { id: 2, article: "Maths Moderne", qte: "300", prixUnit: "45.00 DH", total: "13,500.00 DH" },
    ]);

    const columns = [
        { header: "Article", accessor: "article" },
        { header: "Quantité Vendue", accessor: "qte" },
        { header: "Prix Unitaire", accessor: "prixUnit" },
        { header: "Total Ventes", accessor: "total" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-emerald-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse des Ventes</h1>
                </div>
                <Button className="bg-emerald-600 text-white flex items-center gap-2"><Download size={16} /> Exporter</Button>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view"]} variant="green" />
        </div>
    );
};

export default VentesPage;
