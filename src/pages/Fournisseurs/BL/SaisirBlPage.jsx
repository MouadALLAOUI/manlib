import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
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
import bLivraisonService from "../../../api/services/bLivraisonService";
import imprimeurService from "../../../api/services/imprimeurService";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import toast from "react-hot-toast";
import { CustomSelectComponent } from "../../../components/ui/select";

function FournisseurSaisirBl() {
    const [blData, setBlData] = useState([]);
    const [imprimeurs, setImprimeurs] = useState([]);
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        imprimeur_id: "",
        date_livraison: "",
        n_bl: "",
        details: [] // This will store items with qte > 0
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [blRes, impRes, livreRes, catRes] = await Promise.all([
                bLivraisonService.getAll(),
                imprimeurService.getAll(),
                livreService.getAll(),
                categoryService.getAll()
            ]);
            setBlData(blRes.data.data || blRes.data);
            setImprimeurs(impRes.data.data || impRes.data);
            setLivres(livreRes.data.data || livreRes.data);
            setCategories(catRes.data.data || catRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
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
        if (type === "delete") {
            if (window.confirm("Supprimer ce BL ?")) {
                try {
                    await bLivraisonService.delete(row.id);
                    toast.success("BL supprimé");
                    fetchData();
                } catch (error) {
                    toast.error("Erreur de suppression");
                }
            }
        } else if (type === "edit") {
            console.log("Editing row:", row);
        }
    };

    const handleSubmit = async () => {
        try {
            await bLivraisonService.create(formData);
            toast.success("BL enregistré avec succès");
            setIsDialogOpen(false);
            setFormData({ imprimeur_id: "", date_livraison: "", n_bl: "", details: [] });
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement du BL");
        }
    };

    // Group books by category
    const booksByLevel = {};
    categories.forEach(cat => {
        booksByLevel[cat.libelle] = livres.filter(l => l.category_id === cat.id).map(l => ({ id: l.id, label: l.titre }));
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des BL (Fournisseur &rarr; MSM-MEDIAS)</h1>
                <BLDialog 
                    formData={formData} 
                    setFormData={setFormData} 
                    onUpdateDetail={updateDetail} 
                    imprimeurs={imprimeurs}
                    booksByLevel={booksByLevel}
                    onSubmit={handleSubmit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <CustomDataTable
                    data={blData}
                    variant="slate"
                    pageSize={10}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={[
                        { header: "Fournisseur", accessor: "imprimeur_name" }, // Assuming API returns name
                        { header: "Date", accessor: "date_livraison" },
                        { header: "N° BL", accessor: "n_bl" },
                    ]}
                />
            </div>
        </div>
    );
}

const BLDialog = ({ formData, setFormData, onUpdateDetail, imprimeurs, booksByLevel, onSubmit, open, onOpenChange }) => {

    const accordionLevels = Object.keys(booksByLevel).map(level => ({
        title: level.toUpperCase(),
        content: (
            <div className="p-4 space-y-4 bg-slate-50/50 rounded-xl">
                {booksByLevel[level].map((book) => (
                    <BookInput
                        key={book.id}
                        label={book.label}
                        onChange={(qte) => onUpdateDetail(book.id, book.label, qte)}
                    />
                ))}
            </div>
        ),
    }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                    + Saisir un nouveau BL
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="bg-slate-900 p-8 text-white">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">Saisie Bon de Livraison</DialogTitle>
                    <p className="text-slate-400 text-sm mt-1">Enregistrer les entrées de stock en provenance des fournisseurs.</p>
                </DialogHeader>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Fournisseur</label>
                        <CustomSelectComponent
                            items={imprimeurs.map(i => ({ label: i.nom, value: i.id }))}
                            placeholder="Choisir fournisseur"
                            value={formData.imprimeur_id}
                            onValueChange={(v) => setFormData({ ...formData, imprimeur_id: v })}
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Date</label>
                        <Input
                            type="date"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={formData.date_livraison}
                            onChange={(e) => setFormData({ ...formData, date_livraison: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">N° BL</label>
                        <Input
                            placeholder="Ex: BL-2024-001"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={formData.n_bl}
                            onChange={(e) => setFormData({ ...formData, n_bl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="px-8 pb-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Détails des Articles</h3>
                        <AccordionComponent AccordionItems={accordionLevels} id="bl-levels" variant="light" allowMultiple={true} />
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <DialogClose asChild>
                        <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200">Annuler</Button>
                    </DialogClose>
                    <Button 
                        onClick={onSubmit}
                        className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 transition-all"
                    >
                        Valider le BL
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const BookInput = ({ label, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
        <span className="text-sm font-bold text-slate-700 truncate mr-4">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">QTE</span>
            <Input
                type="number"
                min="0"
                className="w-20 h-9 text-center border-slate-200 focus:ring-slate-900 rounded-lg bg-slate-50"
                placeholder="0"
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

export default FournisseurSaisirBl;
