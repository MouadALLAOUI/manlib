import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { CreditCard, Download } from "lucide-react";
import rembImpService from "../../../api/services/rembImpService";

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
    if (ops.some((o) => !!o.statut_recu)) return "Reçu";
    return "En cours";
};

const pickMainMode = (ops = []) => {
    let cheque = 0;
    let virement = 0;
    let autre = 0;
    for (const o of ops) {
        if (o.cheque_number) cheque += 1;
        else if (o.banque_id || o.banque_nom) virement += 1;
        else autre += 1;
    }
    if (cheque >= virement && cheque >= autre) return "Chèque";
    if (virement >= cheque && virement >= autre) return "Virement";
    return "—";
};

const RemboursementFournisseursPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ total: 0, fournisseurs: 0, operations: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const ops = await fetchAllPaginated(rembImpService.getAll);
            const grouped = new Map();

            for (const o of ops) {
                const impId = o.imprimeur_id || o.imprimeur?.id;
                if (!impId) continue;
                const prev = grouped.get(impId) || { impId, fournisseur: o.imprimeur?.nom || o.imprimeur?.raison_sociale || impId, ops: [] };
                prev.ops.push(o);
                grouped.set(impId, prev);
            }

            const computed = Array.from(grouped.values()).map((g) => {
                const total = g.ops.reduce((sum, o) => sum + toNumber(o.montant), 0);
                return {
                    id: g.impId,
                    fournisseur: g.fournisseur,
                    totalRemb: total,
                    mode: pickMainMode(g.ops),
                    status: pickStatus(g.ops),
                    operations: g.ops.length,
                };
            }).sort((a, b) => b.totalRemb - a.totalRemb);

            setRows(computed);
            setKpis({
                total: computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0),
                fournisseurs: computed.length,
                operations: ops.length,
            });
        } catch (error) {
            logger("Error computing remboursements fournisseurs:", error);
            toast.error("Erreur lors du chargement des remboursements fournisseurs");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Fournisseur", accessor: "fournisseur" },
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
                    <h1 className="text-2xl font-bold text-slate-800">Remboursements Fournisseurs (Global)</h1>
                </div>
                <Button className="bg-emerald-600 text-white"><Download size={16} /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Fournisseurs</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.fournisseurs}</p>
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

export default RemboursementFournisseursPage;
