import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Printer, Download, FileText } from "lucide-react";
import bLivraisonService from "../../../api/services/bLivraisonService";
import toast from "react-hot-toast";

const SyntheseBLPage = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await bLivraisonService.getAll();
            setData(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching synthese bl:", error);
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalMontant = data.reduce((sum, item) => sum + parseFloat(item.total_ht || 0), 0);
    const totalBL = data.length;

    const columns = [
        { header: "Fournisseur", accessor: "imprimeur_name" },
        { header: "Nombre de BL", accessor: "n_bl" },
        { header: "Montant Total (HT)", accessor: "total_ht" },
        { header: "Date Livraison", accessor: "date_livraison" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fournisseurs - Synthèse BL</h1>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} /> Exporter
                    </Button>
                    <Button className="bg-slate-900 hover:bg-black text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg shadow-slate-200 transition-all">
                        <Printer size={18} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Download size={80} />
                    </div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Achats (HT)</p>
                    <p className="text-4xl font-black tracking-tight">{totalMontant.toLocaleString()} DH</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 text-slate-900 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
                        <FileText size={80} />
                    </div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Bons de Livraison</p>
                    <p className="text-4xl font-black tracking-tight">{totalBL}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <CustomDataTable
                    data={data}
                    columns={columns}
                    actions={["view", "imp"]}
                    variant="slate"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default SyntheseBLPage;
