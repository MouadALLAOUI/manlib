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
import { CustomSelectComponent } from "../../../components/ui/select";
import livreService from "../../../api/services/livreService";
import categoryService from "../../../api/services/categoryService";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import { type } from "@testing-library/user-event/dist/type";

function LivresPage() {
    const [livres, setLivres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [form, setForm] = useState({
        titre: "",
        code: "",
        categorie_id: "",
        prix_achat: "",
        prix_vente: "",
        prix_public: "",
        nb_pages: "",
        color_code: "#FFFFFF",
        description: "",
    });
    const [livreID, setLivreID] = useState("");
    const actionsDetaille = {
        delete: {
            title: "",
            description: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await livreService.delete(row.id);
                    toast.success("Livre supprimé");
                    fetchData();
                } catch (error) {
                    console.error("Error deleting livre:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("element pas supprimé"),
        },
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [livresRes, categoriesRes] = await Promise.all([
                livreService.getAll(),
                categoryService.getAll()
            ]);
            const rawLivres = livresRes.data.data || livresRes.data;
            const flattenedLivres = rawLivres.map(book => ({
                ...book,
                category_name: book.category?.libelle || "N/A" // Extract the name
            }));
            setLivres(flattenedLivres);
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
            const data = form;
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
    const handleSubmitEdit = async () => {
        try {
            await livreService.update(livreID, form);
            toast.success(`Livre ${form.titre} mise à jour avec succès`);
            setIsEditDialogOpen(false);
            setLivreID("");
            resetForm();
            fetchData();
        } catch (error) {
            logger("Error updating livre:", error);
            toast.error("Erreur lors de la mise à jour du livre");
        }
    };
    const resetForm = () => {
        setForm({
            titre: "",
            code: "",
            categorie_id: "",
            prix_achat: "",
            prix_vente: "",
            prix_public: "",
            nb_pages: "",
            color_code: "#FFFFFF",
            description: "",
        });
    };

    const handleAction = async (type, row) => {
        if (type === "edit") {
            setIsEditDialogOpen(true);
            setForm(row);
            setLivreID(row.id);

        }
    };

    const columns = [
        { header: "Titre", accessor: "titre" },
        { header: "Code", accessor: "code" },
        { header: "Catégorie", accessor: "category_name" },
        { header: "Achat (DH)", accessor: "prix_achat", type: "curr" },
        { header: "Vente (DH)", accessor: "prix_vente", type: "curr" },
        { header: "P. publique (DH)", accessor: "prix_public", type: "curr" },
        { header: "Nombre de pages", accessor: "nb_pages" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des livres</h1>
                <AddLivreDialog
                    fields={form}
                    fieldsFunc={setForm}
                    categories={categories}
                    onSubmit={handleSubmit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
                <UpdateLivreDialog
                    fields={form}
                    fieldsFunc={setForm}
                    categories={categories}
                    onSubmit={handleSubmitEdit}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={livres}
                    variant="slate"
                    pageSize={10}
                    actions={["edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={columns}
                    actionsDetaille={actionsDetaille}
                    enableSearch={true}
                    enableSorting={true}
                />
            </div>
        </div>
    )
}

const AddLivreDialog = ({ fields, fieldsFunc, onSubmit = () => { }, categories = [], open, onOpenChange }) => {
    const header = {
        title: "Nouveau Livre",
        subTitle: "Enregistrer un nouvel ouvrage dans le catalogue."
    }
    const fieldsText = {
        titre: {
            label: "Titre du livre",
            placeholder: "Entrer le titre complet"
        },
        code: {
            label: "Code / Référence",
            placeholder: "Ex: R-102"
        },
        categorie_id: {
            label: "Catégorie",
            placeholder: "Sélectionner"
        },
        prix_achat: {
            label: "Prix d'Achat (DH)",
            placeholder: "0.00"
        },
        prix_vente: {
            label: "Prix de Vente (DH)",
            placeholder: "0.00"
        },
        prix_public: {
            label: "Prix de Vente Public (DH)",
            placeholder: "0.00"
        },
        nb_pages: {
            label: "Nombre des pages",
            placeholder: "0"
        },
        color_code: {
            label: "Couleur",
            placeholder: "Couleur"
        },
        description: {
            label: "Description",
            placeholder: "Détails supplémentaires..."
        },
    };
    const btn = {
        submit: "Enregistrer le livre",
        cancel: "Annuler",
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                    + Ajouter un livre
                </Button>
            </DialogTrigger>
            <MyDialogContent
                header={header}
                fields={fields}
                fieldsText={fieldsText}
                fieldsFunc={fieldsFunc}
                onSubmit={onSubmit}
                categories={categories}
                btn={btn}
            />
        </Dialog>
    );
};

const UpdateLivreDialog = ({ fields, fieldsFunc, onSubmit = () => { }, categories = [], open, onOpenChange }) => {
    const header = {
        title: "Modifier un Livre",
        subTitle: "Modifier un nouvel ouvrage dans le catalogue."
    }
    const fieldsText = {
        titre: {
            label: "Titre du livre",
            placeholder: "Entrer le titre complet"
        },
        code: {
            label: "Code / Référence",
            placeholder: "Ex: R-102"
        },
        categorie_id: {
            label: "Catégorie",
            placeholder: "Sélectionner"
        },
        prix_achat: {
            label: "Prix d'Achat (DH)",
            placeholder: "0.00"
        },
        prix_vente: {
            label: "Prix de Vente (DH)",
            placeholder: "0.00"
        },
        prix_public: {
            label: "Prix de Vente Public (DH)",
            placeholder: "0.00"
        },
        nb_pages: {
            label: "Nombre des pages",
            placeholder: "0"
        },
        color_code: {
            label: "Couleur",
            placeholder: "Couleur"
        },
        description: {
            label: "Description",
            placeholder: "Détails supplémentaires..."
        },
    };

    const btn = {
        submit: "Modifier le livre",
        cancel: "Annuler",
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <MyDialogContent
                header={header}
                fields={fields}
                fieldsText={fieldsText}
                fieldsFunc={fieldsFunc}
                onSubmit={onSubmit}
                categories={categories}
                btn={btn}
            />
        </Dialog>
    )
}

const MyDialogContent = ({ header = { title: "", subTitle: "" }, fieldsText, fields, fieldsFunc, onSubmit = () => { }, categories = [], btn }) => {
    return (
        <DialogContent className="sm:max-w-[700px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-2xl font-black tracking-tight uppercase">{header.title}</DialogTitle>
                <p className="text-slate-400 text-sm mt-1">{header.subTitle}</p>
            </DialogHeader>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.titre.label}</label>
                    <Input
                        placeholder={fieldsText.titre.placeholder}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.titre}
                        onChange={(e) => fieldsFunc({ ...fields, titre: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.code.label}</label>
                    <Input
                        placeholder={fieldsText.code.placeholder}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.code}
                        onChange={(e) => fieldsFunc({ ...fields, code: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.categorie_id.label}</label>
                    <CustomSelectComponent
                        items={categories.map(c => ({ label: c.libelle, value: c.id }))}
                        placeholder={fieldsText.categorie_id.placeholder}
                        value={fields.categorie_id}
                        itemLabel="label"
                        itemValue="value"
                        onValueChange={(val) => fieldsFunc({ ...fields, categorie_id: val })}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.prix_achat.label}</label>
                    <Input
                        type="number"
                        placeholder={fieldsText.prix_achat.placeholder}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.prix_achat}
                        min={0}
                        step={0.01}
                        onChange={(e) => fieldsFunc({ ...fields, prix_achat: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.prix_vente.label}</label>
                    <Input
                        type="number"
                        placeholder={fieldsText.prix_vente.placeholder}
                        min={0}
                        step={0.01}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.prix_vente}
                        onChange={(e) => fieldsFunc({ ...fields, prix_vente: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.prix_public.label}</label>
                    <Input
                        type="number"
                        placeholder={fieldsText.prix_public.placeholder}
                        min={0}
                        max={10}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.prix_public}
                        onChange={(e) => fieldsFunc({ ...fields, prix_public: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.nb_pages.label}</label>
                    <Input
                        type="number"
                        placeholder={fieldsText.nb_pages.placeholder}
                        min={0}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.nb_pages}
                        onChange={(e) => fieldsFunc({ ...fields, nb_pages: e.target.value })}
                    />
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.color_code.label}</label>
                    <Input
                        type="color"
                        placeholder={fieldsText.color_code.placeholder}
                        className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                        value={fields.color_code}
                        onChange={(e) => fieldsFunc({ ...fields, color_code: e.target.value })}
                    />
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{fieldsText.description.label}</label>
                    <Textarea
                        placeholder={fieldsText.description.placeholder}
                        className="min-h-[100px] border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50 resize-none"
                        value={fields.description}
                        onChange={(e) => fieldsFunc({ ...fields, description: e.target.value })}
                    />
                </div>
            </div>

            <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <DialogClose asChild>
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200">{btn.cancel}</Button>
                </DialogClose>
                <Button
                    onClick={onSubmit}
                    className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 transition-all"
                >
                    {btn.submit}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default LivresPage;