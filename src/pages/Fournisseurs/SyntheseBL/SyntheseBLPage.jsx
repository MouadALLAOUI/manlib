import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import livreService from "../../../api/services/livreService";

const fetchAllPaginated = async (serviceGetAll, params = {}) => {
    const first = await serviceGetAll({ ...params, page: 1 });
    const firstData = first?.data?.data || first?.data || [];
    const meta = first?.data?.meta;
    if (!meta?.last_page) return firstData;

    const lastPage = meta.last_page;
    const pages = [];
    for (let page = 2; page <= lastPage; page += 1) {
        pages.push(serviceGetAll({ ...params, page }));
    }
    const rest = await Promise.all(pages);
    return [...firstData, ...rest.flatMap((r) => r?.data?.data || r?.data || [])];
};

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const SyntheseBLPage = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [lines, livres] = await Promise.all([
                fetchAllPaginated(bLivraisonImpService.getAll),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));
            const grouped = new Map();

            for (const ln of lines) {
                const key = [
                    ln.imprimeur_id || ln.imprimeur?.id || "—",
                    ln.date_reception || "—",
                    ln.b_livraison_number || "—",
                ].join("|");

                const livre = livreById.get(ln.livre_id || ln.livre?.id);
                const unit = toNumber(livre?.prix_achat ?? 0);
                const qty = toNumber(ln.quantite);

                const prev = grouped.get(key) || {
                    id: key,
                    fournisseur: ln.imprimeur?.nom || ln.imprimeur?.raison_sociale || ln.imprimeur_id || "—",
                    bl_number: ln.b_livraison_number || "—",
                    date_reception: ln.date_reception || "",
                    lignes: 0,
                    quantite: 0,
                    total_ht: 0,
                };

                prev.lignes += 1;
                prev.quantite += qty;
                prev.total_ht += unit * qty;
                grouped.set(key, prev);
            }

            setRows(Array.from(grouped.values()).sort((a, b) => String(b.date_reception).localeCompare(String(a.date_reception))));
        } catch (error) {
            logger("Error fetching fournisseurs synthese BL:", error);
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalMontant = rows.reduce((sum, item) => sum + toNumber(item.total_ht || 0), 0);
    const totalBL = rows.length;

    const columns = useMemo(
        () => [
            { header: "Fournisseur", accessor: "fournisseur" },
            { header: "BL N°", accessor: "bl_number" },
            { header: "Date réception", accessor: "date_reception", type: "date" },
            { header: "Lignes", accessor: "lignes" },
            { header: "Quantité", accessor: "quantite" },
            { header: "Total (HT) (DH)", accessor: "total_ht", type: "money" },
        ],
        []
    );

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
                <MyTable
                    data={rows}
                    columns={columns}
                    pageSize={10}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch
                    enableSorting
                />
            </div>
        </div>
    );
};

export default SyntheseBLPage;
