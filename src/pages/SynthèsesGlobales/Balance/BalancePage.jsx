import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { Printer, Download, Scale } from "lucide-react";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import bVentesClientService from "../../../api/services/bVentesClientService";
import rembImpService from "../../../api/services/rembImpService";
import repRemboursementService from "../../../api/services/repRemboursementService";
import clientRemboursementService from "../../../api/services/clientRemboursementService";
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

const BalancePage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({ ventes: 0, achats: 0, net: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [livraisonsImp, ventes, rembImp, rembRep, rembClient, livres] = await Promise.all([
                fetchAllPaginated(bLivraisonImpService.getAll),
                fetchAllPaginated(bVentesClientService.getAll),
                fetchAllPaginated(rembImpService.getAll),
                fetchAllPaginated(repRemboursementService.getAll),
                fetchAllPaginated(clientRemboursementService.getAll),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));

            const achats = livraisonsImp.reduce((sum, it) => {
                const livre = livreById.get(it.livre_id || it.livre?.id);
                const unit = toNumber(livre?.prix_achat ?? 0);
                return sum + unit * toNumber(it.quantite);
            }, 0);

            const ventesTotal = ventes.reduce((sum, v) => {
                const livre = livreById.get(v.livre_id || v.livre?.id);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const qty = toNumber(v.quantite);
                const remisePct = toNumber(v.remise);
                const total = unit * qty * (1 - remisePct / 100);
                return sum + total;
            }, 0);

            const remboursementsFournisseurs = rembImp.reduce((sum, r) => sum + toNumber(r.montant), 0);
            const remboursementsRep = rembRep.reduce((sum, r) => sum + toNumber(r.montant), 0);
            const remboursementsClients = rembClient.reduce((sum, r) => sum + toNumber(r.montant), 0);

            const net = ventesTotal - achats - remboursementsFournisseurs - remboursementsRep;

            setKpis({ ventes: ventesTotal, achats, net });
            setRows([
                { id: "achats", compte: "Achats fournisseurs (BL imprimeurs)", debit: achats, credit: 0, solde: achats },
                { id: "ventes", compte: "Ventes clients (BVentes)", debit: 0, credit: ventesTotal, solde: -ventesTotal },
                { id: "remb_f", compte: "Remboursements fournisseurs", debit: remboursementsFournisseurs, credit: 0, solde: remboursementsFournisseurs },
                { id: "remb_rep", compte: "Remboursements représentants", debit: remboursementsRep, credit: 0, solde: remboursementsRep },
                { id: "remb_client", compte: "Remboursements clients (encaissés)", debit: 0, credit: remboursementsClients, solde: -remboursementsClients },
                { id: "net", compte: "Résultat net (approx.)", debit: net < 0 ? -net : 0, credit: net > 0 ? net : 0, solde: -net },
            ]);
        } catch (error) {
            logger("Error computing balance:", error);
            toast.error("Erreur lors du chargement de la balance");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            { header: "Indicateur", accessor: "compte" },
            { header: "Débit (DH)", accessor: "debit", type: "money" },
            { header: "Crédit (DH)", accessor: "credit", type: "money" },
            { header: "Net (DH)", accessor: "solde", type: "money" },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Scale size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Balance Générale</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download size={16} /></Button>
                    <Button className="bg-blue-600 text-white flex items-center gap-2"><Printer size={16} /> Imprimer</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total ventes</p>
                    <p className="text-2xl font-black text-emerald-600">{kpis.ventes.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total achats</p>
                    <p className="text-2xl font-black text-blue-600">{kpis.achats.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Résultat net (approx.)</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.net.toLocaleString()} DH</p>
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

export default BalancePage;
