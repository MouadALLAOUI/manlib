import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, TrendingDown } from "lucide-react";
import repRemboursementService from "../../../api/services/repRemboursementService";

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

const SyntheseRemboursementPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, operations: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const ops = await fetchAllPaginated(repRemboursementService.getAll);
            const grouped = new Map();

            for (const o of ops) {
                const repId = o.rep_id || o.representant?.id;
                if (!repId) continue;
                const prev = grouped.get(repId) || {
                    id: repId,
                    rep: o.representant?.nom || repId,
                    nbRemb: 0,
                    totalRemb: 0,
                    lastUpdate: "",
                };
                prev.nbRemb += 1;
                prev.totalRemb += toNumber(o.montant);
                if (o.date_payment && (!prev.lastUpdate || String(o.date_payment) > String(prev.lastUpdate))) {
                    prev.lastUpdate = o.date_payment;
                }
                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).sort((a, b) => b.totalRemb - a.totalRemb);
            setRows(computed);
            setKpis({
                total: computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0),
                operations: ops.length,
            });
        } catch (error) {
            logger("Error computing synthese remboursements:", error);
            toast.error("Erreur lors du chargement de la synthèse des remboursements");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Représentant", accessor: "rep" },
            { header: "Nb remboursements", accessor: "nbRemb" },
            { header: "Total remboursé (DH)", accessor: "totalRemb", type: "money" },
            { header: "Dernier paiement", accessor: "lastUpdate", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Synthèse des Remboursements</h1>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Exporter
                    </Button>
                    <Button className="bg-emerald-600 text-white flex items-center gap-2">
                        <Printer size={16} /> Imprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Total Remboursé REP</p>
                        <p className="text-3xl font-black text-emerald-900">{kpis.total.toLocaleString()} DH</p>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                        <Printer size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Nb Total Opérations</p>
                        <p className="text-3xl font-black text-slate-900">{kpis.operations}</p>
                    </div>
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

export default SyntheseRemboursementPage;
