import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { TrendingUp, Download } from "lucide-react";
import bVentesClientService from "../../../api/services/bVentesClientService";
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

const VentesPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ qte: 0, total: 0, articles: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [ventes, livres] = await Promise.all([
                fetchAllPaginated(bVentesClientService.getAll),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));
            const grouped = new Map();

            for (const v of ventes) {
                const livreId = v.livre_id || v.livre?.id;
                if (!livreId) continue;
                const livre = livreById.get(livreId);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const qty = toNumber(v.quantite);
                const remisePct = toNumber(v.remise);
                const total = unit * qty * (1 - remisePct / 100);

                const prev = grouped.get(livreId) || {
                    id: livreId,
                    article: livre?.titre || livre?.nom || livreId,
                    qte: 0,
                    prixUnit: unit,
                    total: 0,
                };
                prev.qte += qty;
                prev.total += total;
                grouped.set(livreId, prev);
            }

            const computed = Array.from(grouped.values()).sort((a, b) => b.total - a.total);
            const qteTotal = computed.reduce((sum, r) => sum + toNumber(r.qte), 0);
            const totalVentes = computed.reduce((sum, r) => sum + toNumber(r.total), 0);

            setRows(computed);
            setKpis({ qte: qteTotal, total: totalVentes, articles: computed.length });
        } catch (error) {
            logger("Error computing ventes synthèse:", error);
            toast.error("Erreur lors du chargement des ventes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            { header: "Article", accessor: "article" },
            { header: "Quantité vendue", accessor: "qte" },
            { header: "Prix unitaire (DH)", accessor: "prixUnit", type: "money" },
            { header: "Total ventes (DH)", accessor: "total", type: "money" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-emerald-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse des Ventes</h1>
                </div>
                <Button className="bg-emerald-600 text-white flex items-center gap-2"><Download size={16} /> Exporter</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Articles</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.articles}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quantité vendue</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.qte.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total ventes</p>
                    <p className="text-2xl font-black text-emerald-700">{kpis.total.toLocaleString()} DH</p>
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

export default VentesPage;
