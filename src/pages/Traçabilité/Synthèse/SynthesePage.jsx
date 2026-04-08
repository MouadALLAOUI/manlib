import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { BarChart3, Download } from "lucide-react";
import clientService from "../../../api/services/clientService";
import bVentesClientService from "../../../api/services/bVentesClientService";
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
    return [
        ...firstData,
        ...rest.flatMap((r) => r?.data?.data || r?.data || []),
    ];
};

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const SyntheseTracabilitePage = () => {
    const [rows, setRows] = useState([]);
    const [kpis, setKpis] = useState({
        ventes: 0,
        remboursements: 0,
        solde: 0,
        clientsActifs: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [clients, ventes, remboursements, livres] = await Promise.all([
                fetchAllPaginated(clientService.getAll),
                fetchAllPaginated(bVentesClientService.getAll),
                fetchAllPaginated(clientRemboursementService.getAll),
                fetchAllPaginated(livreService.getAll),
            ]);

            const livreById = new Map(livres.map((l) => [l.id, l]));

            const blNumbersByClient = new Map();
            const ventesByClient = new Map();
            for (const v of ventes) {
                const clientId = v.client_id || v.client?.id;
                if (!clientId) continue;

                const bNumber = v.b_vente_number;
                if (bNumber) {
                    const set = blNumbersByClient.get(clientId) || new Set();
                    set.add(String(bNumber));
                    blNumbersByClient.set(clientId, set);
                }

                const livre = livreById.get(v.livre_id || v.livre?.id);
                const unit = toNumber(livre?.prix_vente ?? livre?.prix_public ?? 0);
                const qty = toNumber(v.quantite);
                const remisePct = toNumber(v.remise);
                const total = unit * qty * (1 - remisePct / 100);
                ventesByClient.set(clientId, (ventesByClient.get(clientId) || 0) + total);
            }

            const rembByClient = new Map();
            for (const r of remboursements) {
                const clientId = r.client_id || r.client?.id;
                if (!clientId) continue;
                rembByClient.set(clientId, (rembByClient.get(clientId) || 0) + toNumber(r.montant));
            }

            const computed = clients.map((c) => {
                const clientId = c.id;
                const totalVentes = ventesByClient.get(clientId) || 0;
                const totalRemb = rembByClient.get(clientId) || 0;
                const nbBL = blNumbersByClient.get(clientId)?.size || 0;
                return {
                    id: clientId,
                    client: c.raison_sociale || c.nom || c.id,
                    nbBL,
                    totalVentes,
                    totalRemb,
                    solde: totalVentes - totalRemb,
                };
            }).filter((row) => row.nbBL > 0 || row.totalRemb > 0 || row.totalVentes > 0);

            const ventesTotal = computed.reduce((sum, r) => sum + toNumber(r.totalVentes), 0);
            const rembTotal = computed.reduce((sum, r) => sum + toNumber(r.totalRemb), 0);
            const soldeTotal = computed.reduce((sum, r) => sum + toNumber(r.solde), 0);

            setRows(computed);
            setKpis({
                ventes: ventesTotal,
                remboursements: rembTotal,
                solde: soldeTotal,
                clientsActifs: computed.length,
            });
        } catch (error) {
            logger("Error computing synthese traçabilité:", error);
            toast.error("Erreur lors du chargement de la synthèse");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            { header: "Client", accessor: "client" },
            { header: "Nb BL", accessor: "nbBL" },
            { header: "Total Ventes (DH)", accessor: "totalVentes", type: "money" },
            { header: "Total Remboursé (DH)", accessor: "totalRemb", type: "money" },
            { header: "Solde (DH)", accessor: "solde", type: "money" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="text-slate-900" />
                    <h1 className="text-2xl font-bold text-slate-800">Synthèse Traçabilité</h1>
                </div>
                <Button variant="outline" className="flex items-center gap-2"><Download size={16} /> Rapport</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Clients actifs</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.clientsActifs}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total ventes</p>
                    <p className="text-2xl font-black text-emerald-700">{kpis.ventes.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total remboursé</p>
                    <p className="text-2xl font-black text-blue-700">{kpis.remboursements.toLocaleString()} DH</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Solde</p>
                    <p className="text-2xl font-black text-slate-900">{kpis.solde.toLocaleString()} DH</p>
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

export default SyntheseTracabilitePage;
