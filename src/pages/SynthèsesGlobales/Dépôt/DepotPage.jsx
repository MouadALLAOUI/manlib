import React, { useState } from "react";
import { CustomDataTable } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Archive, Download } from "lucide-react";

const DepotPage = () => {
    const [data] = useState([
        { id: 1, rep: "ADNANE BARIBI", livre: "Physique Appliquée", qteDepot: "100", date: "2026-03-25" },
    ]);

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Ouvrage", accessor: "livre" },
        { header: "Qté en Dépôt", accessor: "qteDepot" },
        { header: "Dernière Opération", accessor: "date" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Archive className="text-amber-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse du Dépôt</h1>
                </div>
                <Button className="bg-amber-600 text-white"><Download size={16} /></Button>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view"]} variant="dark" />
        </div>
    );
};

export default DepotPage;
