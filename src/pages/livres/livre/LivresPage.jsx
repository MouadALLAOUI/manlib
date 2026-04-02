import { Button } from "../../../components/ui/button";
import {
    CustomDataTable
} from "../../../components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useState, useEffect } from "react";
import { CustomSelectComponent } from "../../../components/ui/select";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import toast from "react-hot-toast";

function LivresPage() {
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [titre, setTitre] = useState("");
    const [code, setCode] = useState("");
    const [categorie, setCategorie] = useState("");
    const [achat, setAchat] = useState("");
    const [vente, setVente] = useState("");
    const [ppublique, setPPublique] = useState("");
    const [pages, setPages] = useState("");
    const [color, setColor] = useState("#FFFFFF");
    const [desc, setDesc] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fields = { titre, code, categorie, achat, vente, ppublique, pages, color, desc };
    const fieldsFunc = { setTitre, setCode, setCategorie, setAchat, setVente, setPPublique, setPages, setColor, setDesc };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [livresRes, categoriesRes] = await Promise.all([
                livreService.getAll(),
                categoryService.getAll()
            ]);
            setLivres(livresRes.data.data || livresRes.data);
            setCategories(categoriesRes.data.data || categoriesRes.data);
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

    const handleSubmit = async () => {
        try {
            const data = {
                titre,
                code,
                category_id: categorie, // Assuming the API expects category_id
                prix_achat: achat,
                prix_vente: vente,
                description: desc,
                // Add other fields if necessary
            };
            await livreService.create(data);
            toast.success("Livre ajouté avec succès");
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error creating livre:", error);
            toast.error("Erreur lors de l'ajout du livre");
        }
    };

    const resetForm = () => {
        setTitre("");
        setCode("");
        setCategorie("");
        setAchat("");
        setVente("");
        setPPublique("");
        setPages("");
        setColor("#FFFFFF");
        setDesc("");
    };

    const handleAction = async (type, row) => {
        if (type === "delete") {
            if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
                try {
                    await livreService.delete(row.id);
                    toast.success("Livre supprimé");
                    fetchData();
                } catch (error) {
                    toast.error("Erreur lors de la suppression");
                }
            }
        } else if (type === "edit") {
            // Implement edit logic if needed
            console.log("Editing row:", row);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des livres</h1>
                <AddCategoryDialog 
                    fields={fields} 
                    fieldsFunc={fieldsFunc} 
                    onSubmit={handleSubmit} 
                    categories={categories}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <CustomDataTable
                    data={livres}
                    variant="slate"
                    pageSize={10}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={[
                        { header: "Titre", accessor: "titre" },
                        { header: "Code", accessor: "code" },
                        { header: "Catégorie", accessor: "category_name" }, // Assuming the API resource returns category_name
                        { header: "Prix d'achat", accessor: "prix_achat" },
                        { header: "Prix de vente", accessor: "prix_vente" },
                    ]}
                />
            </div>
        </div>
    )
}

const AddCategoryDialog = ({ fields, fieldsFunc, onSubmit = () => { }, categories = [], open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                    + Ajouter un livre
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="bg-slate-900 p-8 text-white">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">Nouveau Livre</DialogTitle>
                    <p className="text-slate-400 text-sm mt-1">Enregistrer un nouvel ouvrage dans le catalogue.</p>
                </DialogHeader>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Titre du livre</label>
                        <Input
                            placeholder="Entrer le titre complet"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.titre}
                            onChange={(e) => fieldsFunc.setTitre(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Code / Référence</label>
                        <Input
                            placeholder="Ex: R-102"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.code}
                            onChange={(e) => fieldsFunc.setCode(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Catégorie</label>
                        <CustomSelectComponent
                            items={categories.map(c => ({ label: c.name, value: c.id }))}
                            placeholder="Sélectionner"
                            value={fields.categorie}
                            onValueChange={fieldsFunc.setCategorie}
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Prix d'Achat (DH)</label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.achat}
                            onChange={(e) => fieldsFunc.setAchat(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Prix de Vente (DH)</label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.vente}
                            onChange={(e) => fieldsFunc.setVente(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Description</label>
                        <Textarea
                            placeholder="Détails supplémentaires..."
                            className="min-h-[100px] border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50 resize-none"
                            value={fields.desc}
                            onChange={(e) => fieldsFunc.setDesc(e.target.value)}
                        />
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
                        Enregistrer le livre
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LivresPage;