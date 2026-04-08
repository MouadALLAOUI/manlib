import { useState, useEffect, useMemo } from "react";
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
import imprimeurService from "../../../api/services/imprimeurService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import FormInputRow from "../../../components/ui/FormInputRaw";

function FournisseursDisponibles() {
    const [imprimeurs, setImprimeurs] = useState([]);
    const [impId, setImpId] = useState("")
    const [isLoading, setIsLoading] = useState(true);

    const [form, setForm] = useState({
        raison_sociale: "",
        adresse: "",
        directeur_nom: "",
        directeur_tel: "",
        directeur_email: "",
        adjoint_nom: "",
        adjoint_tel: "",
        adjoint_email: "",
    })

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce fornisseur?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await imprimeurService.delete(row.id);
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

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await imprimeurService.getAll();
            setImprimeurs(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching fournisseurs:", error);
            toast.error("Erreur lors du chargement des fournisseurs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (type, row) => {
        if (type === "edit") {
            setIsUpdateDialogOpen(true)
            setForm(row)
            setImpId(row.id)
        }
        if (type === "view") {
            setIsViewDialogOpen(true)
            setForm(row)
        }
    };

    const handleAddSubmit = async () => {
        try {
            const data = form;
            await imprimeurService.create(data);
            toast.success("Fournisseur ajouté avec succès");
            setIsAddDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du fournisseur");
        }
    };
    const handleUpdateSubmit = async () => {
        try {
            const data = form;
            await imprimeurService.update(impId, data);
            toast.success(`Livre ${form.raison_sociale} mise à jour avec succès`);
            setIsUpdateDialogOpen(false);
            setImpId("")
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du fournisseur");
        }
    };

    const resetForm = () => {
        setForm({
            raison_sociale: "",
            adresse: "",
            directeur_nom: "",
            directeur_tel: "",
            directeur_email: "",
            adjoint_nom: "",
            adjoint_tel: "",
            adjoint_email: "",
        })
    };

    useEffect(() => {
        if (!isAddDialogOpen && !isUpdateDialogOpen && !isViewDialogOpen) {
            resetForm();
        }
    }, [isAddDialogOpen, isUpdateDialogOpen, isViewDialogOpen]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des Fournisseurs</h1>
                <FournisseurAddDialog
                    fields={form}
                    fieldsFunc={setForm}
                    onSubmit={handleAddSubmit}
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                />
                <FournisseurUpdateDialog
                    fields={form}
                    fieldsFunc={setForm}
                    onSubmit={handleUpdateSubmit}
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                />
                <FournisseurViewDialog
                    fields={form}
                    open={isViewDialogOpen}
                    onOpenChange={setIsViewDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MyTable
                    data={imprimeurs}
                    variant="green"
                    pageSize={5}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={[
                        { header: "Raison Social", accessor: "raison_sociale" },
                    ]}
                    actionsDetaille={actionsDetaille}
                    enableSearch enableSorting
                />
            </div>
        </div>
    )
}

const FournisseurAddDialog = ({
    fields,
    fieldsFunc,
    onSubmit = () => { },
    open,
    onOpenChange
}) => {
    const contentText = {
        header: {
            title: "Nouveau Fournisseur",
            subtitle: "Enregistrer un nouveau partenaire fournisseur dans le système."
        },
        fieldsText: {
            raison_sociale: {
                label: "Raison Sociale",
                placeholder: "Ex: SARL Librairie Centrale",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2",
                required: true
            },
            adresse: {
                label: "Adresse Complète",
                placeholder: "Adresse du siège...",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2"
            },
            directeur_nom: {
                label: "Nom Directeur",
                placeholder: "Nom et Prénom",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            directeur_email: {
                label: "Email",
                placeholder: "Ex: directeur@email.com",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            directeur_tel: {
                label: "Téléphone",
                placeholder: "Ex: 06XXXXXXXX",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2"
            },

            adjoint_nom: {
                label: "Nom Ad_Joint",
                placeholder: "Nom et Prénom",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            adjoint_email: {
                label: "Email",
                placeholder: "Ex: directeur@email.com",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            adjoint_tel: {
                label: "Téléphone",
                placeholder: "Ex: 06XXXXXXXX",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2"
            },
        },
        footer: {
            cancel: "Annuler",
            submit: "Enregistrer Fournisseur"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                    + Ajouter un fournisseur
                </Button>
            </DialogTrigger>
            <MyDialogContent
                contentText={contentText}
                fields={fields}
                fieldsFunc={fieldsFunc}
                onSubmit={onSubmit}
            />
        </Dialog>
    );
};

const FournisseurUpdateDialog = ({ fields, fieldsFunc, onSubmit = () => { }, open, onOpenChange }) => {
    const contentText = {
        header: {
            title: "Modification des informations",
            subtitle: "Modification les informations d'un partenaire fournisseur dans le système."
        },
        fieldsText: {
            raison_sociale: {
                label: "Raison Sociale",
                placeholder: "Ex: SARL Librairie Centrale",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2",
                required: true
            },
            adresse: {
                label: "Adresse Complète",
                placeholder: "Adresse du siège...",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2"
            },
            directeur_nom: {
                label: "Nom Directeur",
                placeholder: "Nom et Prénom",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            directeur_email: {
                label: "Email",
                placeholder: "Ex: directeur@email.com",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            directeur_tel: {
                label: "Téléphone",
                placeholder: "Ex: 06XXXXXXXX",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2"
            },

            adjoint_nom: {
                label: "Nom Ad_Joint",
                placeholder: "Nom et Prénom",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            adjoint_email: {
                label: "Email",
                placeholder: "Ex: directeur@email.com",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2"
            },
            adjoint_tel: {
                label: "Téléphone",
                placeholder: "Ex: 06XXXXXXXX",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2"
            },
        },
        footer: {
            cancel: "Annuler",
            submit: "Enregistrer les modifications"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <MyDialogContent
                contentText={contentText}
                fields={fields}
                fieldsFunc={fieldsFunc}
                onSubmit={onSubmit}
            />
        </Dialog>
    );
};

const FournisseurViewDialog = ({ fields, open, onOpenChange }) => {
    const contentText = {
        header: {
            title: "Detail de l'Fournisseur",
            subtitle: "les informations d'un fournisseur dans le système."
        },
        fieldsText: {
            raison_sociale: {
                label: "Raison Sociale",
                placeholder: "Ex: SARL Librairie Centrale",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2",
                disabled: true
            },
            adresse: {
                label: "Adresse Complète",
                placeholder: "Adresse du siège...",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2",
                disabled: true
            },
            directeur_nom: {
                label: "Nom Directeur",
                placeholder: "Nom et Prénom",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2",
                disabled: true
            },
            directeur_email: {
                label: "Email",
                placeholder: "Ex: directeur@email.com",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2",
                disabled: true
            },
            directeur_tel: {
                label: "Téléphone",
                placeholder: "Ex: 06XXXXXXXX",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2",
                disabled: true
            },

            adjoint_nom: {
                label: "Nom Ad_Joint",
                placeholder: "Nom et Prénom",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2",
                disabled: true
            },
            adjoint_email: {
                label: "Email",
                placeholder: "Ex: directeur@email.com",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2",
                disabled: true
            },
            adjoint_tel: {
                label: "Téléphone",
                placeholder: "Ex: 06XXXXXXXX",
                labelClassName: "text-sm font-bold text-slate-700 uppercase tracking-wider",
                inputClassName: "h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50",
                className: "space-y-2 col-span-2",
                disabled: true
            },
        },
        footer: {
            cancel: "Annuler",
            submit: "Enregistrer les modifications"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <MyDialogContent
                contentText={contentText}
                fields={fields}
                footer={false}
                onCancel={() => onOpenChange(false)}
            />
        </Dialog>
    );
};

const MyDialogContent = ({ contentText, fields, fieldsFunc = () => { }, onSubmit = () => { }, footer = true }) => {
    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const errors = useMemo(() => {
        if (!footer) return { raison_sociale: "", directeur_email: "", adjoint_email: "" };
        return {
            raison_sociale: (!fields.raison_sociale || fields.raison_sociale.trim() === "")
                ? "Ce champ est obligatoire" : "",
            directeur_email: (fields.directeur_email && !emailregex.test(fields.directeur_email))
                ? "Suivez le format d'un email" : "",
            adjoint_email: (fields.adjoint_email && !emailregex.test(fields.adjoint_email))
                ? "Suivez le format d'un email" : "",
        };
    }, [fields]);

    const isFormInvalid = useMemo(() => {
        return Object.values(errors).some(error => error !== "");
    }, [errors]);

    const handleFinalSubmit = () => {
        if (!isFormInvalid) {
            onSubmit();
        }
    };

    return (
        <DialogContent className="sm:max-w-[800px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-2xl font-black tracking-tight uppercase">{contentText.header.title}</DialogTitle>
                <p className="text-slate-400 text-sm mt-1">{contentText.header.subtitle}</p>
            </DialogHeader>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <FormInputRow
                    type="text"
                    {...contentText.fieldsText.raison_sociale}
                    value={fields.raison_sociale}
                    onChange={(val) => fieldsFunc({ ...fields, raison_sociale: val })}
                    error={errors.raison_sociale}
                />
                <FormInputRow
                    type="text"
                    {...contentText.fieldsText.adresse}
                    value={fields.adresse}
                    onChange={(val) => fieldsFunc({ ...fields, adresse: val })}
                />

                <div className="col-span-2 mt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-4">Informations Directeur</h3>
                </div>
                <FormInputRow
                    type="text"
                    {...contentText.fieldsText.directeur_nom}
                    value={fields.directeur_nom}
                    onChange={(val) => fieldsFunc({ ...fields, directeur_nom: val })}
                />
                <FormInputRow
                    type="email"
                    {...contentText.fieldsText.directeur_email}
                    value={fields.directeur_email}
                    onChange={(val) => fieldsFunc({ ...fields, directeur_email: val })}
                    error={errors.directeur_email}
                />
                <FormInputRow
                    type="text"
                    {...contentText.fieldsText.directeur_tel}
                    value={fields.directeur_tel}
                    onChange={(val) => fieldsFunc({ ...fields, directeur_tel: val })}
                />


                <div className="col-span-2 mt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-4">Informations Ad_Joint</h3>
                </div>
                <FormInputRow
                    type="text"
                    {...contentText.fieldsText.adjoint_nom}
                    value={fields.adjoint_nom}
                    onChange={(val) => fieldsFunc({ ...fields, adjoint_nom: val })}
                />
                <FormInputRow
                    type="email"
                    {...contentText.fieldsText.adjoint_email}
                    value={fields.adjoint_email}
                    onChange={(val) => fieldsFunc({ ...fields, adjoint_email: val })}
                    error={errors.adjoint_email}
                />
                <FormInputRow
                    type="text"
                    {...contentText.fieldsText.adjoint_tel}
                    value={fields.adjoint_tel}
                    onChange={(val) => fieldsFunc({ ...fields, adjoint_tel: val })}
                />
            </div>
            <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                <DialogClose asChild>
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200">{contentText.footer.cancel}</Button>
                </DialogClose>
                {footer && <Button
                    onClick={handleFinalSubmit}
                    className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 transition-all"
                    disabled={isFormInvalid}
                >
                    {contentText.footer.submit}
                </Button>}
            </DialogFooter>
        </DialogContent>
    )
}

export default FournisseursDisponibles;