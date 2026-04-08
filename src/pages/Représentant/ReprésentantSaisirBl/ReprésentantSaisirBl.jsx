import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { AccordionComponent } from "../../../components/ui/accordion";
import { CustomSelectComponent } from "../../../components/ui/select";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import bLivraisonService from "../../../api/services/bLivraisonService";
import toast from "react-hot-toast";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";
import representantService from "../../../api/services/representantService";
import bLivraisonItemService from "../../../api/services/bLivraisonItemService";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { numberRound } from "../../../lib/utilities";

function ReprésentantSaisirBl() {
    const [blData, setBlData] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        rep_id: "",
        bl_number: "",
        date_emission: "",
        mode_envoi: "",
        type: "",
        statut_recu: false,
        statut_vu: false,
        status: "",
        details: []
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
                    await bLivraisonItemService.delete(row.id);
                    toast.success("Livre supprimé du BL");
                    setSelectedBlItems(prev => ({
                        ...prev,
                        items: prev.items.filter(i => i.id !== row.id)
                    }));
                    fetchData();
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
                        await bLivraisonItemService.update(row.id, { quantite: itemQte });
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
        }
    };

    const [selectedBlItems, setSelectedBlItems] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [blRes, livreRes, catRes, repRes] = await Promise.all([
                bLivraisonService.getAll(),
                livreService.getAll(),
                categoryService.getAll(),
                representantService.getAll()
            ]);
            console.log(blRes.data.data || blRes.data)
            setBlData(blRes.data.data || blRes.data);
            setLivres(livreRes.data.data || livreRes.data);
            setCategories(catRes.data.data || catRes.data);
            setRepresentants(repRes.data.data || repRes.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    }

    // logger({ blData, livres, categories, representants })

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
            setIsLoading(true)
            try {
                const res = await bLivraisonItemService.getById(row.id)
                const items = res.data.data || res.data

                setSelectedBlItems({
                    representant: row.representant?.nom,
                    number: row.bl_number,
                    date: row.date_emission,
                    items: items
                });
            } catch (error) {
                console.log(error)
                toast.error("Erreur lors du chargement des sous données");
            } finally {
                setIsLoading(false)
                setTimeout(() => {
                    document.getElementById('bl-details-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    };

    const handleItemAction = async (type, itemRow) => {
        if (type === "edit") {
            setItemQte(Number(itemRow.quantite))
        }
    };

    const handleSubmit = async () => {
        try {
            await bLivraisonService.create(formData);
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
            rep_id: "",
            bl_number: "",
            date_emission: "",
            mode_envoi: "",
            type: "",
            statut_recu: false,
            statut_vu: false,
            status: "",
            details: []
        });
    }

    const BOOKS_BY_LEVEL = {};
    categories.forEach(cat => {
        BOOKS_BY_LEVEL[cat.libelle] = [];
        livres.forEach(liv => {
            if (liv.category && liv.category.libelle === cat.libelle) {
                BOOKS_BY_LEVEL[cat.libelle].push({
                    label: liv.titre,
                    value: liv.id
                });
            }
        });
    });

    const columns = [
        { header: "Representant", accessor: "representant.nom" },
        { header: "Date", accessor: "date_emission", type: "date" },
        { header: "Type", accessor: "type" },
        { header: "N° BL", accessor: "bl_number" },
        { header: "Mode d'envoi", accessor: "mode_envoi" },
        { header: "Vu", accessor: "statut_vu", type: "bool", onClick: (row) => handleVu(row) },
        { header: "Reçu", accessor: "statut_recu", type: "bool", onClick: (row) => handleRecu(row) },
    ]
    const handleVu = async (row) => {
        try {
            const newStatus = !row.statut_vu;
            await bLivraisonService.update(row.id, { statut_vu: newStatus });
            toast.success(newStatus ? "Marqué comme vu" : "Marqué comme non vu");
            fetchData(); // Refresh the table
        } catch (error) {
            toast.error("Erreur lors de la modification du statut");
        }
    }
    const handleRecu = async (row) => {
        try {
            const newStatus = !row.statut_recu;
            await bLivraisonService.update(row.id, { statut_recu: newStatus });
            toast.success(newStatus ? "Marqué comme Recu" : "Marqué comme non Recu");
            fetchData(); // Refresh the table
        } catch (error) {
            toast.error("Erreur lors de la modification du statut");
        }
    }

    const schema = useMemo(() => [
        {
            name: "rep_id",
            label: "Représentant",
            placeholder: "Choisir un représentant",
            inputType: "select",
            required: true,
            items: representants.map(r => ({ label: r.nom, value: r.id })),
            value: formData.rep_id,
            onChange: (v) => setFormData(prev => ({ ...prev, rep_id: v }))
        },
        {
            name: "date_emission",
            label: "Date d'émission",
            type: "date",
            required: true,
            value: formData.date_emission,
            onChange: (v) => setFormData(prev => ({ ...prev, date_emission: v }))
        },
        {
            name: "type",
            label: "Type",
            placeholder: "Type de BL",
            inputType: "select",
            items: [
                { label: "Livre", value: "Livre" },
                { label: "Spécimen", value: "Specimen" },
                { label: "Retour", value: "Retour" },
                { label: "Pédagogie", value: "Pedagogie" },
            ],
            value: formData.type,
            onChange: (v) => setFormData(prev => ({ ...prev, type: v }))
        },
        {
            name: "bl_number",
            label: "N° BL",
            placeholder: "Ex: BL-123456",
            required: true,
            value: formData.bl_number,
            onChange: (v) => setFormData(prev => ({ ...prev, bl_number: v }))
        },
        {
            name: "mode_envoi",
            label: "Mode d'envoi",
            placeholder: "Ex: Transporteur, Main propre",
            value: formData.mode_envoi,
            onChange: (v) => setFormData(prev => ({ ...prev, mode_envoi: v }))
        },
        {
            type: "section",
            label: "Sélection des Articles"
        },
        {
            type: "book_accordion",
            data: BOOKS_BY_LEVEL, // This is your categories/livres grouped object
            details: formData.details,
            onUpdateDetail: updateDetail
        },
        {
            type: "summary",
            data: formData.details
        }
    ], [formData, representants, BOOKS_BY_LEVEL]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Liste des BLs (Représentant)</h1>
                {/* <BLDialog formData={formData} setFormData={setFormData} onUpdateDetail={updateDetail} /> */}
                <UniversalDialog
                    schema={schema}
                    config={{ title: "Ajouter un BL (MSM-MEDIAS -- Représentant)" }}
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

            <MyTable
                data={blData}
                variant="blue"
                pageSize={4}
                actions={["view", "imp"]}
                onAction={handleAction}
                columns={columns}

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
                                {selectedBlItems.representant} — {selectedBlItems.date}
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
                            variant="slate"
                            pageSize={5}
                            actions={["edit", "delete"]}
                            onAction={(type, itemRow) => handleItemAction(type, itemRow)}
                            columns={[
                                { header: "Livre", accessor: "livre.titre" },
                                { header: "Livre Code", accessor: "livre.code" },
                                { header: "Quantité Livrée", accessor: "quantite" }
                            ]}
                            actionsDetaille={actionsDetaille}
                            enableSearch enableSorting
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReprésentantSaisirBl;
