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
import { Textarea } from "../../../components/ui/textarea";
import representantService from "../../../api/services/representantService";
import toast from "react-hot-toast";

function ReprésentantDisponibles() {
    const [représentants, setReprésentants] = useState([]);
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await representantService.getAll();
            setReprésentants(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching representants:", error);
            toast.error("Erreur lors du chargement des représentants");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAction = async (type, row) => {
        if (type === "delete") {
            if (window.confirm("Supprimer ce représentant ?")) {
                try {
                    await representantService.delete(row.id);
                    toast.success("Représentant supprimé");
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
            await representantService.create(formData);
            toast.success("Représentant ajouté avec succès");
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du représentant");
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

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-slate-800">Liste des Représentants</h1>
                <AddReprésentantDialog
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <CustomDataTable
                data={représentants}
                variant="green"
                onAction={handleAction}
                isLoading={isLoading}
                actions={["view", "edit", "delete"]}
                columns={[
                    { header: "Nom", accessor: "nom" },
                    { header: "Zone", accessor: "zone" },
                    { header: "Téléphone", accessor: "tel" },
                    { header: "Ville", accessor: "ville" },
                ]}
            />
        </div>
    );
}

const AddReprésentantDialog = ({ formData, onChange, onSubmit, open, onOpenChange }) => {

    // Helper to render form rows (Label on left, Input on right)
    const FormRow = ({ label, id, type = "text", isTextArea = false }) => (
        <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor={id} className="text-sm font-semibold text-slate-700">
                {label}
            </label>
            <div className="col-span-2">
                {isTextArea ? (
                    <Textarea
                        id={id}
                        value={formData[id]}
                        onChange={(e) => onChange(id, e.target.value)}
                        className="bg-slate-50 border-slate-300 resize-none min-h-[80px]"
                    />
                ) : (
                    <Input
                        id={id}
                        type={type}
                        value={formData[id]}
                        onChange={(e) => onChange(id, e.target.value)}
                        className="bg-slate-50 border-slate-300 h-9"
                    />
                )}
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                    Ajouter un Représentant
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg overflow-y-auto max-h-[95vh]">
                <DialogHeader className="border-b-2 border-sky-500 pb-2 mb-4">
                    <DialogTitle className="text-left text-sky-600 font-bold">
                        Détails du Représentant
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 px-2">
                    <FormRow label="Nom et prénom" id="nom" />
                    <FormRow label="CIN" id="cin" />

                    <div className="py-2" /> {/* Spacer */}

                    <FormRow label="Zone" id="zone" />
                    <FormRow label="Tél" id="tel" />
                    <FormRow label="E-mail" id="email" type="email" />
                    <FormRow label="Adresse" id="adresse" />
                    <FormRow label="Code Postale" id="code_postale" />
                    <FormRow label="Ville" id="ville" />

                    <FormRow label="Lieu de travail" id="lieu_de_travail" isTextArea />

                    <div className="py-2" /> {/* Spacer */}

                    <FormRow label="Login" id="login" />
                    <FormRow label="Mot de passe" id="password" type="password" />
                </div>

                <DialogFooter className="mt-6 sm:justify-start">
                    <Button
                        className="bg-sky-500 hover:bg-sky-600 text-white w-full sm:w-auto"
                        onClick={onSubmit}
                    >
                        Ajouter le représentant
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReprésentantDisponibles;