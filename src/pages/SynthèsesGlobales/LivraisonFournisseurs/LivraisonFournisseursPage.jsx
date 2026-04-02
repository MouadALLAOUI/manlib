import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Truck, Download } from "lucide-react";

const LivraisonFournisseursPage = () => {
    const [data] = useState([
        { id: 1, fournisseur: "WATANYA", nbLivres: "1500", montant: "45,000.00 DH", date: "2026-03-25" },
        { id: 2, fournisseur: "BEST BM", nbLivres: "800", montant: "24,000.00 DH", date: "2026-03-24" },
    ]);

    const columns = [
        { header: "Fournisseur", accessor: "fournisseur" },
        { header: "Nombre de Livres", accessor: "nbLivres" },
        { header: "Montant Global", accessor: "montant" },
        { header: "Date", accessor: "date" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Truck className="text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Livraisons Fournisseurs</h1>
                </div>
                <Button className="bg-blue-600 text-white"><Download size={16} /></Button>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view"]} variant="blue" />
        </div>
    );
};

export default LivraisonFournisseursPage;
