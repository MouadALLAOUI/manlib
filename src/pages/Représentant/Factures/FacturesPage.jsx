import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const FacturesPage = () => {
    const [data, setData] = useState([
        { id: 1, rep: "ADNANE BARIBI", numFact: "FAC-2026-001", montant: "1250.00 DH", date: "2026-03-25", status: "Payé" },
        { id: 2, rep: "Noureddine", numFact: "FAC-2026-002", montant: "840.50 DH", date: "2026-03-24", status: "Impayé" },
    ]);

    const [formData, setFormData] = useState({
        rep: "",
        numFact: "",
        montant: "",
        date: "",
    });

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "N° Facture", accessor: "numFact" },
        { header: "Montant", accessor: "montant" },
        { header: "Date", accessor: "date" },
        { header: "Statut", accessor: "status" },
    ];

    const handleAction = (type, row) => {
        if (type === "delete") {
            setData(data.filter(item => item.id !== row.id));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Gestion des Factures</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Saisir une Facture</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Nouvelle Facture - Représentant</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow
                                label="Représentant"
                                value={formData.rep}
                                onChange={(v) => setFormData({ ...formData, rep: v })}
                                placeholder="Nom du représentant"
                            />
                            <FormInputRow
                                label="N° Facture"
                                value={formData.numFact}
                                onChange={(v) => setFormData({ ...formData, numFact: v })}
                                placeholder="Ex: FAC-2026-001"
                            />
                            <FormInputRow
                                label="Montant (DH)"
                                type="number"
                                value={formData.montant}
                                onChange={(v) => setFormData({ ...formData, montant: v })}
                                placeholder="0.00"
                            />
                            <FormInputRow
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(v) => setFormData({ ...formData, date: v })}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline">Annuler</Button>
                            <Button className="bg-blue-600 text-white">Générer</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <CustomDataTable
                data={data}
                columns={columns}
                actions={["view", "edit", "delete", "print"]}
                onAction={handleAction}
                variant="blue"
            />
        </div>
    );
};

export default FacturesPage;
