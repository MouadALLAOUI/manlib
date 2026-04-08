import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download } from "lucide-react";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";

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
    const [kpis, setKpis] = useState({ totalBL: 0, montant: 0, reps: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const items = await fetchAllPaginated(bLivraisonItemService.getAll);
            const grouped = new Map();

            for (const it of items) {
                const livraison = it.livraison;
                const repId = livraison?.rep_id || livraison?.representant?.id;
                if (!repId) continue;

                const repNom = livraison?.representant?.nom || repId;
                const qty = toNumber(it.quantite);
                const unit = toNumber(it.livre?.prix_vente ?? it.livre?.prix_public ?? 0);
                const total = qty * unit;

                const prev = grouped.get(repId) || {
                    id: repId,
                    rep: repNom,
                    totalBL: 0,
                    totalMontant: 0,
                    lastUpdate: "",
                    blNumbers: new Set(),
                };

                prev.totalMontant += total;
                if (livraison?.bl_number) prev.blNumbers.add(String(livraison.bl_number));
                prev.totalBL = prev.blNumbers.size;
                if (livraison?.date_emission && (!prev.lastUpdate || String(livraison.date_emission) > String(prev.lastUpdate))) {
                    prev.lastUpdate = livraison.date_emission;
                }
                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).sort((a, b) => b.totalMontant - a.totalMontant);
            setRows(computed);
            setKpis({
                totalBL: computed.reduce((sum, r) => sum + toNumber(r.totalBL), 0),
                montant: computed.reduce((sum, r) => sum + toNumber(r.totalMontant), 0),
                reps: computed.length,
            });
        } catch (error) {
            logger("Error computing synthese BL:", error);
            toast.error("Erreur lors du chargement de la synthèse BL");
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
            { header: "Nombre de BL", accessor: "totalBL" },
            { header: "Montant total (DH)", accessor: "totalMontant", type: "money" },
            { header: "Dernière émission", accessor: "lastUpdate", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Synthèse des Bons de Livraison</h1>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={16} /> Exporter (CSV)
                    </Button>
                    <Button className="bg-blue-600 text-white flex items-center gap-2">
                        <Printer size={16} /> Imprimer Tout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Total BL (Saison)</p>
                    <p className="text-2xl font-bold text-blue-900">{kpis.totalBL}</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-emerald-900">{kpis.montant.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Représentants Actifs</p>
                    <p className="text-2xl font-bold text-slate-900">{kpis.reps}</p>
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
