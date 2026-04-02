import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const DeclarationDepotPage = () => {
    const [data, setData] = useState([
        { id: 1, rep: "ADNANE BARIBI", livre: "Livre A", qte: "50", date: "2026-03-25", status: "Confirmé" },
        { id: 2, rep: "Noureddine", livre: "Livre B", qte: "30", date: "2026-03-24", status: "En attente" },
    ]);

    const [formData, setFormData] = useState({
        rep: "",
        livre: "",
        qte: "0",
        date: "",
    });

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Livre", accessor: "livre" },
        { header: "Quantité", accessor: "qte" },
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
                <h1 className="text-2xl font-bold text-slate-800">Déclaration de Dépôt</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Nouvelle Déclaration</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Déclaration - Dépôt de Stock</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow
                                label="Représentant"
                                value={formData.rep}
                                onChange={(v) => setFormData({ ...formData, rep: v })}
                                placeholder="Nom du représentant"
                            />
                            <FormInputRow
                                label="Livre"
                                value={formData.livre}
                                onChange={(v) => setFormData({ ...formData, livre: v })}
                                placeholder="Titre de l'ouvrage"
                            />
                            <FormInputRow
                                label="Quantité"
                                type="number"
                                value={formData.qte}
                                onChange={(v) => setFormData({ ...formData, qte: v })}
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
                            <Button className="bg-emerald-600 text-white">Soumettre</Button>
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

export default DeclarationDepotPage;
