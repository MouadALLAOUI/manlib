import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download } from "lucide-react";
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

const SyntheseRemboursementPage = () => {
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
                const prev = grouped.get(impId) || {
                    id: impId,
                    fournisseur: o.imprimeur?.nom || o.imprimeur?.raison_sociale || impId,
                    totalRemb: 0,
                    lastDate: "",
                    ops: [],
                };
                prev.ops.push(o);
                prev.totalRemb += toNumber(o.montant);
                if (o.date_payment && (!prev.lastDate || String(o.date_payment) > String(prev.lastDate))) {
                    prev.lastDate = o.date_payment;
                }
                grouped.set(impId, prev);
            }

            const computed = Array.from(grouped.values()).map((g) => ({
                id: g.id,
                fournisseur: g.fournisseur,
                totalRemb: g.totalRemb,
                mode: pickMainMode(g.ops),
                date: g.lastDate,
                operations: g.ops.length,
            })).sort((a, b) => b.totalRemb - a.totalRemb);

            setRows(computed);
            setKpis({
                total: computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0),
                fournisseurs: computed.length,
                operations: ops.length,
            });
        } catch (error) {
            logger("Error computing fournisseurs synthese remboursements:", error);
            toast.error("Erreur lors du chargement de la synthèse");
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
            { header: "Montant remboursé (DH)", accessor: "totalRemb", type: "money" },
            { header: "Mode", accessor: "mode" },
            { header: "Dernier paiement", accessor: "date", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fournisseurs - Synthèse Remboursements</h1>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} />
                    </Button>
                    <Button className="bg-slate-900 hover:bg-black text-white flex items-center gap-2 rounded-xl h-11 px-6 font-bold shadow-lg shadow-slate-200 transition-all">
                        <Printer size={18} /> Imprimer
                    </Button>
                </div>
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
                    <p className="text-2xl font-black text-slate-900">{kpis.total.toLocaleString()} DH</p>
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
