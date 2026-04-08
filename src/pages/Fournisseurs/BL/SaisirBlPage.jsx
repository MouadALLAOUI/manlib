import { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import imprimeurService from "../../../api/services/imprimeurService";
import bLivraisonImpService from "../../../api/services/bLivraisonImpService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { numberRound } from "../../../lib/utilities";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import { universalFetch } from "../../../api/helpers/methodes";

function FournisseurSaisirBl() {
    const [blData, setBlData] = useState([]);
    const [imprimeurs, setImprimeurs] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        imprimeur_id: "",
        date_reception: "",
        b_livraison_number: "",
        quantite: "",
        livre_id: "",
        remarks: "",
        details: [], // This will store items with qte > 0
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemQte, setItemQte] = useState(0);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce fornisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await bLivraisonImpService.deleteGroup(row.id);
                    toast.success("b_livraison supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting b_livraison:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    };

    const actionsSubDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce fornisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await bLivraisonImpService.delete(row.id);
                    toast.success("Livre supprimé du BL");
                    fetchData();
                    setSelectedBlItems(prev => ({
                        ...prev,
                        items: prev.items.filter(i => i.id !== row.id)
                    }));
                } catch (error) {
                    logger("Error deleting b_livraison:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
        edit: {
            title: "modifier",
            description: <FormInputRow
                type="number"
                min="1"
                value={itemQte}
                step="1"
                onChange={(val) => setItemQte(numberRound(val))} />,
            actionText: "modifier",
            cancelText: "Annuler",
            type: "edit",
            onOk: async (row) => {
                setItemQte(Number(row.quantite))
                if (itemQte && !isNaN(itemQte)) {
                    try {
                        await bLivraisonImpService.update(row.id, { quantite: itemQte });
                        toast.success("Quantité mise à jour");
                        fetchData();
                        setSelectedBlItems(prev => ({
                            ...prev,
                            items: prev.items.map(i => i.id === row.id ? { ...i, quantite: itemQte } : i)
                        }));
                        setItemQte(0)
                    } catch (error) {
                        toast.error("Erreur lors de la mise à jour");
                    }
                }
            },
            onCancel: () => {
                toast.error("element pas modifier")
                setItemQte(0)
            },
        },
    }

    const [selectedBlItems, setSelectedBlItems] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const groupedBLs = await universalFetch({
                dataService: bLivraisonImpService.getAll,
                groupOptions: {
                    keys: ['imprimeur_id', 'date_reception', 'b_livraison_number'],
                    sumField: 'quantite'
                }
            });
            setBlData(groupedBLs);

            const [impRes, livreRes, catRes] = await Promise.all([
                imprimeurService.getAll(),
                livreService.getAll(),
                categoryService.getAll()
            ]);

            setImprimeurs(impRes.data.data || impRes.data);
            setLivres(livreRes.data.data || livreRes.data);
            setCategories(catRes.data.data || catRes.data);

        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateDetail = (livreId, label, qte) => {
        setFormData(prev => {
            const filtered = prev.details.filter(item => item.livre_id !== livreId);
            if (parseInt(qte) > 0) {
                return { ...prev, details: [...filtered, { livre_id: livreId, label, qte }] };
            }
            return { ...prev, details: filtered };
        });
    };

    const handleAction = async (type, row) => {
        if (type === "view") {
            setSelectedBlItems({
                number: row.b_livraison_number,
                imprimeur: row.imprimeur?.raison_sociale,
                date: row.date_reception,
                items: row.items
            });
            console.log(row)

            // Scroll smoothly to the detail table
            setTimeout(() => {
                document.getElementById('bl-details-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleItemAction = async (type, itemRow) => {
        if (type === "edit") {
            setItemQte(Number(itemRow.quantite))
        }
    };

    const handleSubmit = async () => {
        try {
            await bLivraisonImpService.create(formData);
            toast.success("BL enregistré avec succès");
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement du BL");
        }
    };

    const resetForm = () => {
        setFormData({
            imprimeur_id: "",
            date_reception: "",
            b_livraison_number: "",
            quantite: "",
            livre_id: "",
            remarks: "",
            details: [],
        });
    }

    const booksByLevel = {};
    categories.forEach(cat => {
        booksByLevel[cat.libelle] = [];
        livres.forEach(liv => {
            if (liv.category && liv.category.libelle === cat.libelle) {
                booksByLevel[cat.libelle].push({
                    label: liv.titre,
                    value: liv.id
                });
            }
        });
    });

    const columns = [
        { header: "Fournisseur", accessor: "imprimeur.raison_sociale" },
        { header: "Date", accessor: "date_reception", type: "date" },
        { header: "N° BL", accessor: "b_livraison_number" },
        { header: "Articles", accessor: "items.length" },
    ]

    const schema = useMemo(() => [
        {
            name: "imprimeur_id",
            label: "Fournisseur",
            placeholder: "Choisir fournisseur",
            inputType: "select",
            items: imprimeurs.map(i => ({ label: i.raison_sociale, value: i.id })),
            value: formData.imprimeur_id,
            onChange: (v) => setFormData({ ...formData, imprimeur_id: v })
        },
        {
            name: "date_reception",
            label: "Date",
            inputType: "date",
            type: "date",
            value: formData.date_reception,
            onChange: (v) => setFormData({ ...formData, date_reception: v })
        },
        {
            name: "b_livraison_number",
            label: "N° BL",
            placeholder: "Ex: BL-2024-001",
            value: formData.b_livraison_number,
            onChange: (v) => setFormData({ ...formData, b_livraison_number: v })
        },
        {
            type: "section",
            label: "Détail de la Livraison"
        },
        {
            type: "book_accordion",
            data: booksByLevel,      // <--- RAW DATA
            details: formData.details, // <--- FOR VALUES
            onUpdateDetail: updateDetail // <--- YOUR LOGIC
        },
        {
            type: "section",
            label: "Summary"
        },
        {
            type: "summary",
            data: formData.details // <--- AUTOMATIC YELLOW TABLE
        }
    ], [formData, imprimeurs, booksByLevel]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des BL (Fournisseur &rarr; MSM-MEDIAS)</h1>
                <UniversalDialog
                    schema={schema}
                    config={{ title: "Saisie de Bon de Livraison" }}
                    trigger={
                        <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                            + Saisir un nouveau BL
                        </Button>
                    }
                    onSubmit={handleSubmit}
                    grid={3}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={blData}
                    variant="slate"
                    pageSize={10}
                    actions={["view", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={columns}
                    actionsDetaille={actionsDetaille}
                    enableSearch enableSorting
                />

                {selectedBlItems && (
                    <div id="bl-details-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase">
                                    Détails du BL: {selectedBlItems.number}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {selectedBlItems.imprimeur} — {selectedBlItems.date}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedBlItems(null)}
                                className="text-slate-400 hover:text-slate-900"
                            >
                                Fermer les détails
                            </Button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <MyTable
                                data={selectedBlItems.items}
                                variant="blue"
                                pageSize={20}
                                actions={["edit", "delete"]}
                                onAction={(type, itemRow) => handleItemAction(type, itemRow)}
                                columns={[
                                    { header: "Désignation du Livre", accessor: "livre.titre" },
                                    { header: "Quantité Livrée", accessor: "quantite" }
                                ]}
                                actionsDetaille={actionsSubDetaille}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FournisseurSaisirBl;
