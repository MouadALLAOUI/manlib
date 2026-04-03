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
import { Textarea } from "../../../components/ui/textarea";
import { useState, useEffect } from "react";
import categoryService from "../../../api/services/categoryService";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [libelle, setLibelle] = useState("");
    const [description, setDescription] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [isUpdateCategory, setIsUpdateCategory] = useState(false);

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await categoryService.delete(row.id);
                    toast.success("Catégorie supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting category:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await categoryService.getAll();
            setCategories(response.data.data || response.data);
        } catch (error) {
            logger("Error fetching categories:", error);
            toast.error("Erreur lors du chargement des catégories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            await categoryService.create({ libelle, description });
            toast.success("Catégorie ajoutée avec succès");
            setIsDialogOpen(false);
            setLibelle("");
            setDescription("");
            fetchData();
        } catch (error) {
            logger("Error creating category:", error);
            toast.error("Erreur lors de l'ajout de la catégorie");
        }
    };

    const handleSubmitEdit = async () => {
        try {
            await categoryService.update(categoryId, { libelle, description });
            toast.success(`Catégorie ${libelle} mise à jour avec succès`);
            setIsUpdateCategory(false);
            setLibelle("");
            setDescription("");
            setCategoryId("");
            fetchData();
        } catch (error) {
            logger("Error updating category:", error);
            toast.error("Erreur lors de la mise à jour de la catégorie");
        }
    };

    const handleAction = async (type, row) => {
        if (type === "edit") {
            setIsUpdateCategory(true);
            setLibelle(row.libelle);
            setDescription(row.description);
            setCategoryId(row.id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">LISTE DES CATÉGORIES</h1>
                <AddCategoryDialog
                    libelle={libelle}
                    setLibelle={setLibelle}
                    description={description}
                    setDescription={setDescription}
                    onSubmit={handleSubmit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />

                <UpdateCategoryDialog
                    libelle={libelle}
                    setLibelle={setLibelle}
                    description={description}
                    setDescription={setDescription}
                    open={isUpdateCategory}
                    onOpenChange={setIsUpdateCategory}
                    onSubmit={handleSubmitEdit}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={categories}
                    variant="slate"
                    pageSize={5}
                    actions={["edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={[
                        { header: "Libellé", accessor: "libelle" },
                        { header: "Description", accessor: "description" }
                    ]}
                    actionsDetaille={actionsDetaille}
                />
            </div>
        </div>
    )
}

const AddCategoryDialog = ({ libelle, setLibelle, description, setDescription, onSubmit = () => { }, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                    + Ajouter une catégorie
                </Button>
            </DialogTrigger>
            <MyDialogContent
                title="Nouvelle Catégorie"
                subtitle="Ajouter une nouvelle catégorie de livres au système."
                libelle={{
                    id: "libelle",
                    label: "Libellé",
                    placeholder: "Ex: Primaire, Lycée...",
                    value: libelle,
                    onChange: (e) => setLibelle(e.target.value)
                }}
                description={{
                    id: "description",
                    label: "Description",
                    placeholder: "Description de la catégorie...",
                    value: description,
                    onChange: (e) => setDescription(e.target.value)
                }}
                onSubmit={onSubmit}
            />
        </Dialog>
    );
};

const UpdateCategoryDialog = ({ open, libelle, description, onOpenChange, setLibelle, setDescription, onSubmit = () => { } }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <MyDialogContent
                title="Modifier une Catégorie"
                subtitle="Modifier une catégorie de livres au système."
                libelle={{
                    id: "libelle",
                    label: "Libellé",
                    placeholder: "Ex: Primaire, Lycée...",
                    value: libelle,
                    onChange: (e) => setLibelle(e.target.value)
                }}
                description={{
                    id: "description",
                    label: "Description",
                    placeholder: "Description de la catégorie...",
                    value: description,
                    onChange: (e) => setDescription(e.target.value)
                }}
                onSubmit={onSubmit}
                BTNs={{
                    closeText: "Annuler",
                    submitText: "Modifier",
                }}
            />
        </Dialog>

    );
}

const MyDialogContent = ({
    title,
    subtitle,
    libelle = {
        id: "",
        label: "",
        placeholder: "",
        value: "",
        onChange: () => { }
    },
    description = {
        id: "",
        label: "",
        placeholder: "",
        value: "",
        onChange: () => { }
    },
    BTNs = {
        closeText: "Annuler",
        submitText: "Ajouter",
    },
    onSubmit

}) => {
    return (
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-2xl font-black tracking-tight uppercase">{title}</DialogTitle>
                <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            </DialogHeader>
            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="libelle" className="text-sm font-bold text-slate-700 uppercase tracking-wider">{libelle.label}</label>
                    <Input
                        type="text"
                        id="libelle"
                        placeholder={libelle.placeholder}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={libelle.value}
                        onChange={(e) => libelle.onChange(e)}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor={description.id} className="text-sm font-bold text-slate-700 uppercase tracking-wider">{description.label}</label>
                    <Textarea
                        id={description.id}
                        placeholder={description.placeholder}
                        className="min-h-[120px] border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50 resize-none"
                        value={description.value}
                        onChange={(e) => description.onChange(e)}
                    />
                </div>
            </div>
            <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <DialogClose asChild>
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200">{BTNs.closeText}</Button>
                </DialogClose>
                <Button
                    onClick={onSubmit}
                    className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 transition-all"
                >
                    {BTNs.submitText}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default CategoriesPage;