import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Archive, Download } from "lucide-react";
import depotService from "../../../api/services/depotService";

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

const DepotPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ lignes: 0, reps: 0, quantite: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const depots = await fetchAllPaginated(depotService.getAll);
            const computed = depots.map((d) => ({
                id: d.id,
                rep: d.representant?.nom || d.rep_id || "—",
                livre: d.livre?.titre || d.livre_id || "—",
                qteDepot: toNumber(d.quantite_balance),
                status: d.status || "—",
                date: d.updated_at || d.created_at || "",
            }));

            const reps = new Set(computed.map((r) => r.rep).filter(Boolean));
            setRows(computed);
            setKpis({
                lignes: computed.length,
                reps: reps.size,
                quantite: computed.reduce((sum, r) => sum + toNumber(r.qteDepot), 0),
            });
        } catch (error) {
            logger("Error fetching depots synthèse:", error);
            toast.error("Erreur lors du chargement de la synthèse dépôt");
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
            { header: "Ouvrage", accessor: "livre" },
            { header: "Qté en dépôt", accessor: "qteDepot" },
            { header: "Statut", accessor: "status" },
            { header: "Dernière opération", accessor: "date", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Archive className="text-amber-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse du Dépôt</h1>
                </div>
                <Button className="bg-amber-600 text-white"><Download size={16} /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Lignes</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.lignes}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Représentants</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.reps}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quantité en dépôt</p>
                    <p className="text-2xl font-black text-amber-700">{kpis.quantite.toLocaleString()}</p>
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

export default DepotPage;
