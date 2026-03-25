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

function ReprésentantRemboursement() {
    const [formData, setFormData] = useState({
        representant: "",
        date_donne: "",

        banque: "",
        cheque_num: "",
        type_versement: "",
        ordre: "",
        montant: "",
        date_versement: ""
    });

    const updateDetail = (label, qte) => {
        setFormData(prev => {
            const filtered = prev.details.filter(item => item.label !== label);
            if (parseInt(qte) > 0) {
                return { ...prev, details: [...filtered, { label, qte }] };
            }
            return { ...prev, details: filtered };
        });
    };

    const Remboursement = [
        {
            id: 1,
            representant: "Adnane",
            date_donne: "07/01/2026",
            banque: "BCP",
            cheque_num: "2564855",
            titulaire: "",
            type_versement: "En main propre	",
            ordre: "Watanya",
            montant: 5000,
            date_prévue_versement: "12/01/2026",
            date_versement: "11/11/2024",
            is_accepte: false,
            is_rejete: true,
            is_recu: false,
        },
        {
            id: 2,
            representant: "Mouad",
            date_donne: "08/01/2026",
            banque: "Attijariwafa Bank",
            cheque_num: "2564856",
            titulaire: "",
            type_versement: "En main propre	",
            ordre: "Watanya",
            montant: 7000,
            date_prévue_versement: "13/01/2026",
            date_versement: "12/11/2024",
            is_accepte: true,
            is_rejete: false,
            is_recu: true,
        },
    ];

    const handleAction = (type, row) => {
        if (type === "delete") {
            console.log("Deleting ID:", row.id);
        } else if (type === "edit") {
            console.log("Editing row:", row);
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Liste des Remboursements (Représentant)</h1>
                <RemboursementDialog
                    formData={formData}
                    setFormData={setFormData}
                    onUpdateDetail={updateDetail}
                    onSubmit={() => console.log("Submitting:", formData)}
                    onChange={setFormData}
                />
            </div>

            <CustomDataTable
                data={Remboursement}
                variant="green"
                pageSize={4}
                actions={["delete"]}
                onAction={handleAction}
                columns={[
                    { header: "Représentant", accessor: "representant" },
                    { header: "Donné le", accessor: "date_donne" },
                    { header: "Banque", accessor: "banque" },
                    { header: "Chèque N°", accessor: "cheque_num" },
                    { header: "Titulaire", accessor: "titulaire" },
                    { header: "Type de versement", accessor: "type_versement" },
                    { header: "A l'ordre de", accessor: "ordre" },
                    { header: "Montant (DH)", accessor: "montant" },
                    { header: "Date (prévue) de versement", accessor: "date_versement" },
                    { header: "A l'ordre de", accessor: "ordre" },
                    { header: "Date vérsement", accessor: "date_versement" },
                    { header: "Accépté", accessor: "is_accepte" },
                    { header: "Rejeté", accessor: "is_rejete" },
                    { header: "Reçu", accessor: "is_recu" },
                ]}
            />
        </div>
    );
}

const RemboursementDialog = ({ formData, onChange, onSubmit }) => {
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
                    Ajouter un Chèque
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg overflow-y-auto max-h-[95vh]">
                <DialogHeader className="border-b-2 border-sky-500 pb-2 mb-4">
                    <DialogTitle className="text-left text-sky-600 font-bold">
                        Ajouter un Chèque
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 px-2">
                    <FormRow label="Rep" id="representant" />
                    <FormRow label="Donné le" type="date" id="date_donne" />

                    <div className="py-2" /> {/* Spacer */}

                    <FormRow label="banque" id="banque" />
                    <FormRow label="Chèque N°" id="cheque_num" />
                    <FormRow label="Type de versement" id="type_versement" />
                    <FormRow label="A l'ordre de" id="ordre" />
                    <FormRow label="Montant (DH)" type="number" id="montant" />
                    <FormRow label="Date (prévue) de versement" type="date" id="date_versement" />
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

export default ReprésentantRemboursement;
