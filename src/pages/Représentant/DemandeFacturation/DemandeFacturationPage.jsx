import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const DemandeFacturationPage = () => {
    const [data, setData] = useState([
        { id: 1, rep: "ADNANE BARIBI", client: "LIBRAIRIE MARRAKECH", montant: "4500.00 DH", date: "2026-03-25", status: "En attente" },
        { id: 2, rep: "Noureddine", client: "ECOLE DU SUD", montant: "12000.00 DH", date: "2026-03-24", status: "Validé" },
    ]);

    const [formData, setFormData] = useState({
        rep: "",
        client: "",
        montant: "",
        date: "",
    });

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Client / École", accessor: "client" },
        { header: "Montant Estimé", accessor: "montant" },
        { header: "Date Demande", accessor: "date" },
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
                <h1 className="text-2xl font-bold text-slate-800">Demandes de Facturation</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Nouvelle Demande</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Demande de Facturation - Représentant</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow
                                label="Représentant"
                                value={formData.rep}
                                onChange={(v) => setFormData({ ...formData, rep: v })}
                                placeholder="Nom du représentant"
                            />
                            <FormInputRow
                                label="Client / École"
                                value={formData.client}
                                onChange={(v) => setFormData({ ...formData, client: v })}
                                placeholder="Destination de la facture"
                            />
                            <FormInputRow
                                label="Montant Estimé (DH)"
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
                            <Button className="bg-emerald-600 text-white">Envoyer</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <CustomDataTable
                data={data}
                columns={columns}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                variant="green"
            />
        </div>
    );
};

export default DemandeFacturationPage;
