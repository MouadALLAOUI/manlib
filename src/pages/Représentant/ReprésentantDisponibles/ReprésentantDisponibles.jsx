import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import representantService from "../../../api/services/representantService";
import toast from "react-hot-toast";
import { MyTable } from "../../../components/ui/myTable";
import logger from "../../../lib/logger";
import UniversalDialog from "../../../components/template/dialog/UniversalDialog";

function ReprésentantDisponibles() {
    const [representants, setRepresentants] = useState([]);
    const [repId, setRepId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 1. Centralized State Object
    const [formData, setFormData] = useState({
        nom: "",
        cin: "",
        zone: "",
        tel: "",
        email: "",
        adresse: "",
        code_postale: "",
        ville: "",
        lieu_de_travail: "",
        login: "",
        password: ""
    });

    const actionsDetaille = {
        delete: {
            title: "Supprimer",
            description: "Êtes-vous sûr de vouloir supprimer ce représentants?",
            actionText: "Supprimer",
            cancelText: "Annuler",
            type: "delete",
            onOk: async (row) => {
                try {
                    await representantService.delete(row.id);
                    toast.success("représentants supprimée");
                    fetchData();
                } catch (error) {
                    logger("Error deleting représentants:", error);
                    toast.error("Erreur lors de la suppression");
                }
            },
            onCancel: () => toast.error("représentants pas supprimé"),
        },
    };
    const columns = [
        { header: "Représentants", accessor: "nom" },
    ]

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");

    const dialog_schema = [
        {
            name: "nom",
            label: "Nom et prénom",
            placeholder: "Ex: Mohamed",
            className: "space-y-2",
            required: true,
            value: formData.nom,
            onChange: (val) => setFormData(prev => ({ ...prev, nom: val })),
        },
        {
            name: "cin",
            label: "N° de CIN",
            placeholder: "XX00000",
            className: "space-y-2",
            pattern: "^[A-Z]{1,2}[0-9]+$",
            required: true,
            value: formData.cin,
            onChange: (val) => setFormData(prev => ({ ...prev, cin: val })),
        },
        {
            type: "section",
            label: "Détaile"
        },
        {
            name: "zone",
            label: "Zone",
            placeholder: "e.g: Marrakech",
            className: "space-y-2",
            value: formData.zone,
            onChange: (val) => setFormData(prev => ({ ...prev, zone: val })),
        },
        {
            name: "tel",
            label: "Tél",
            placeholder: "Téléphone",
            className: "space-y-2",
            value: formData.tel,
            onChange: (val) => setFormData(prev => ({ ...prev, tel: val })),
        },
        {
            name: "email",
            label: "E-mail",
            placeholder: "Ex: rep@gmail.com",
            className: "space-y-2",
            value: formData.email,
            onChange: (val) => setFormData(prev => ({ ...prev, email: val })),
        },
        {
            name: "adresse",
            label: "Adresse",
            placeholder: "Adresse",
            className: "space-y-2",
            value: formData.adresse,
            onChange: (val) => setFormData(prev => ({ ...prev, adresse: val })),
        },
        {
            name: "code_postale",
            label: "Code postale",
            placeholder: "Code postale",
            className: "space-y-2",
            value: formData.code_postale,
            onChange: (val) => setFormData(prev => ({ ...prev, code_postale: val })),
        },
        {
            name: "ville",
            label: "Ville",
            placeholder: "Ville",
            className: "space-y-2",
            value: formData.ville,
            onChange: (val) => setFormData(prev => ({ ...prev, ville: val })),
        },
        {
            name: "lieu_de_travail",
            inputType: "textarea",
            label: "Lieu de travail",
            placeholder: "Lieu de travail",
            className: "space-y-2 col-span-2",
            value: formData.lieu_de_travail,
            onChange: (val) => setFormData(prev => ({ ...prev, lieu_de_travail: val })),
        },
        {
            type: "section",
            label: "Login"
        },
        {
            name: "login",
            label: "Login",
            placeholder: "Login",
            className: "space-y-2",
            value: formData.login,
            required: true,
            onChange: (val) => setFormData(prev => ({ ...prev, login: val })),
        },
        {
            name: "password",
            inputType: "password",
            type: "password",
            label: "Mot de passe",
            placeholder: "Mot de passe",
            className: "space-y-2",
            value: formData.password,
            required: true,
            minLength: 8,
            onChange: (val) => setFormData(prev => ({ ...prev, password: val })),
        },
    ]

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await representantService.getAll();
            setRepresentants(response.data.data || response.data);
            logger(response.data.data)
        } catch (error) {
            console.error("Error fetching representants:", error);
            toast.error("Erreur lors du chargement des representants");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (type, row) => {
        if (type === "edit") {
            setDialogMode("update");
            setFormData(row);
            setRepId(row.id);
            setIsDialogOpen(true);
        } else if (type === "view") {
            setDialogMode("view");
            setFormData(row);
            setIsDialogOpen(true);
        }
    }

    const handleAddSubmit = async () => {
        try {
            const data = formData;
            await representantService.create(data);
            toast.success("Représentant ajouté avec succès");
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du représentant");
        }
    };

    const handleUpdateSubmit = async () => {
        try {
            const data = formData;
            await representantService.update(repId, data);
            toast.success(`${formData.nom} mise à jour avec succès`);
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du fournisseur");
        }
    };

    const resetForm = () => {
        setFormData({
            nom: "",
            cin: "",
            zone: "",
            tel: "",
            email: "",
            adresse: "",
            code_postale: "",
            ville: "",
            lieu_de_travail: "",
            login: "",
            password: ""
        });
    };

    useEffect(() => {
        if (!isDialogOpen) {
            resetForm();
            setDialogMode("add");
            setRepId("")
        }
    }, [isDialogOpen]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-slate-800">Liste des Representants</h1>
                <UniversalDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode} // 'add', 'update', or 'view'
                    trigger={
                        <Button
                            onClick={() => setDialogMode("add")}
                            className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
                        >
                            + Ajouter un Représentants
                        </Button>
                    }
                    schema={dialog_schema}
                    fields={formData}
                    fieldsFunc={setFormData}
                    onSubmit={dialogMode === 'add' ? handleAddSubmit : handleUpdateSubmit}
                    config={{
                        title: {
                            add: "Nouveau Représentant",
                            update: "Modifier les informations",
                            view: "Détails du Représentant"
                        },
                        subtitle: {
                            add: "Créer un nouveau compte pour un représentant.",
                            update: "Mettre à jour les données de " + formData.nom,
                            view: "Consultation du profil."
                        },
                        submitLabel: dialogMode === 'add' ? "Créer le compte" : "Enregistrer les modifications"
                    }}
                />
            </div>

            <MyTable
                data={representants}
                variant="blue"
                pageSize={5}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                isLoading={isLoading}
                columns={columns}
                actionsDetaille={actionsDetaille}
                enableSearch enableSorting
            />
        </div>
    );
}

export default ReprésentantDisponibles;