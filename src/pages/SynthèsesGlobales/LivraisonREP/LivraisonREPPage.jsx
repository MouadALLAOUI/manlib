import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Users, Download } from "lucide-react";

const LivraisonREPPage = () => {
    const [data] = useState([
        { id: 1, rep: "ADNANE BARIBI", nbLivres: "450", montant: "13,500.00 DH", date: "2026-03-25" },
        { id: 2, rep: "Noureddine", nbLivres: "320", montant: "9,600.00 DH", date: "2026-03-24" },
    ]);

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Nombre de Livres", accessor: "nbLivres" },
        { header: "Montant Global", accessor: "montant" },
        { header: "Date", accessor: "date" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Livraisons aux Représentants</h1>
                </div>
                <Button className="bg-blue-600 text-white"><Download size={16} /></Button>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view"]} variant="blue" />
        </div>
    );
};

export default LivraisonREPPage;
