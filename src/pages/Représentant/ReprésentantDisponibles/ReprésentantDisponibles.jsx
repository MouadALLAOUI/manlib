import { useState } from "react";
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

function ReprésentantDisponibles() {
    // 1. Centralized State Object
    const [formData, setFormData] = useState({
        nomPrenom: "",
        cin: "",
        zone: "",
        tel: "",
        email: "",
        adresse: "",
        codePostale: "",
        ville: "",
        lieuTravail: "",
        login: "",
        password: ""
    });

    // Mock data for the table
    const représentants = [
        { id: 1, nom: "Adnane", state: "Disponible", date: "03/02/2026" },
        { id: 2, nom: "Abjalil", state: "Indisponible", date: "16/03/2026" },
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-slate-800">Liste des Représentants</h1>
                <AddReprésentantDialog
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={() => console.log("Submitting:", formData)}
                />
            </div>

            <CustomDataTable
                data={représentants}
                variant="green"
                columns={[
                    { header: "Nom", accessor: "nom" },
                    { header: "Statut", accessor: "state" },
                    { header: "Date", accessor: "date" },
                ]}
            />
        </div>
    );
}

const AddReprésentantDialog = ({ formData, onChange, onSubmit }) => {

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
        <Dialog>
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
                    <FormRow label="Nom et prénom" id="nomPrenom" />
                    <FormRow label="CIN" id="cin" />

                    <div className="py-2" /> {/* Spacer */}

                    <FormRow label="Zone" id="zone" />
                    <FormRow label="Tél" id="tel" />
                    <FormRow label="E-mail" id="email" type="email" />
                    <FormRow label="Adresse" id="adresse" />
                    <FormRow label="Code Postale" id="codePostale" />
                    <FormRow label="Ville" id="ville" />

                    <FormRow label="Lieu de travail" id="lieuTravail" isTextArea />

                    <div className="py-2" /> {/* Spacer */}

                    <FormRow label="Login" id="login" />
                    <FormRow label="Mot de passe" id="password" type="password" />
                </div>

                <DialogFooter className="mt-6 sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            className="bg-sky-500 hover:bg-sky-600 text-white w-full sm:w-auto"
                            onClick={onSubmit}
                        >
                            Ajouter le représentant
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReprésentantDisponibles;