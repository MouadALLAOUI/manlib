import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Users, Download } from "lucide-react";
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

const LivraisonREPPage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ reps: 0, quantite: 0, montant: 0 });
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
                    nbLivres: 0,
                    montant: 0,
                    lastDate: "",
                    blNumbers: new Set(),
                };

                prev.nbLivres += qty;
                prev.montant += total;
                if (livraison?.date_emission && (!prev.lastDate || String(livraison.date_emission) > String(prev.lastDate))) {
                    prev.lastDate = livraison.date_emission;
                }
                if (livraison?.bl_number) prev.blNumbers.add(String(livraison.bl_number));
                grouped.set(repId, prev);
            }

            const computed = Array.from(grouped.values()).map((g) => ({
                id: g.id,
                rep: g.rep,
                nbBL: g.blNumbers.size,
                nbLivres: g.nbLivres,
                montant: g.montant,
                date: g.lastDate,
            })).sort((a, b) => b.montant - a.montant);

            setRows(computed);
            setKpis({
                reps: computed.length,
                quantite: computed.reduce((sum, r) => sum + toNumber(r.nbLivres), 0),
                montant: computed.reduce((sum, r) => sum + toNumber(r.montant), 0),
            });
        } catch (error) {
            logger("Error computing livraisons REP:", error);
            toast.error("Erreur lors du chargement des livraisons REP");
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
            { header: "Nb BL", accessor: "nbBL" },
            { header: "Quantité", accessor: "nbLivres" },
            { header: "Montant estimé (DH)", accessor: "montant", type: "money" },
            { header: "Dernière émission", accessor: "date", type: "date" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="text-blue-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Livraisons aux Représentants</h1>
                </div>
                <Button className="bg-blue-600 text-white"><Download size={16} /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Représentants</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.reps}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quantité livrée</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.quantite.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Montant estimé</p>
                    <p className="text-2xl font-black text-blue-700">{kpis.montant.toLocaleString()} DH</p>
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

export default LivraisonREPPage;
