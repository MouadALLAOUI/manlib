import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { CreditCard, Download } from "lucide-react";
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

const pickStatus = (ops = []) => {
    if (ops.some((o) => !!o.statut_rejete)) return "Rejeté";
    if (ops.some((o) => !!o.statut_accepte)) return "Accepté";
    if (ops.some((o) => !!o.statut_recu)) return "Reçu";
    return "En cours";
};

const pickMainMode = (ops = []) => {
    const counts = new Map();
    for (const o of ops) {
        const k = o.type_versement || "—";
        counts.set(k, (counts.get(k) || 0) + 1);
    }
    let best = "—";
    let bestCount = 0;
    for (const [k, c] of counts) {
        if (c > bestCount) {
            best = k;
            bestCount = c;
        }
    }
    return bestCount > 0 ? best : "—";
};

const RemboursementREPPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, reps: 0, operations: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const ops = await fetchAllPaginated(repRemboursementService.getAll);
            const grouped = new Map();

            for (const o of ops) {
                const repId = o.rep_id || o.representant?.id;
                if (!repId) continue;
                const prev = grouped.get(repId) || { repId, rep: o.representant?.nom || repId, ops: [] };
                prev.ops.push(o);
                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).map((g) => {
                const total = g.ops.reduce((sum, o) => sum + toNumber(o.montant), 0);
                return {
                    id: g.repId,
                    rep: g.rep,
                    totalRemb: total,
                    mode: pickMainMode(g.ops),
                    status: pickStatus(g.ops),
                    operations: g.ops.length,
                };
            }).sort((a, b) => b.totalRemb - a.totalRemb);

            setRows(computed);
            setKpis({
                total: computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0),
                reps: computed.length,
                operations: ops.length,
            });
        } catch (error) {
            logger("Error computing remboursements REP:", error);
            toast.error("Erreur lors du chargement des remboursements REP");
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
            { header: "Opérations", accessor: "operations" },
            { header: "Total remboursé (DH)", accessor: "totalRemb", type: "money" },
            { header: "Mode principal", accessor: "mode" },
            { header: "Statut", accessor: "status" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CreditCard className="text-emerald-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Remboursements REP (Global)</h1>
                </div>
                <Button className="bg-emerald-600 text-white"><Download size={16} /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Représentants</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.reps}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Opérations</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.operations}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total remboursé</p>
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

export default RemboursementREPPage;
