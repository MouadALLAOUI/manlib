import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const CartesVisitePage = () => {
    const [data, setData] = useState([
        { id: 1, rep: "ADNANE BARIBI", type: "Cartes Visite", qte: "200", status: "En cours" },
        { id: 2, rep: "Noureddine", type: "Chevalet", qte: "10", status: "Livré" },
    ]);

    const [formData, setFormData] = useState({
        rep: "",
        type: "Cartes Visite",
        qte: "100",
    });

    const columns = [
        { header: "Représentant", accessor: "rep" },
        { header: "Type", accessor: "type" },
        { header: "Quantité", accessor: "qte" },
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
                <h1 className="text-2xl font-bold text-amber-800">Cartes de Visite & Chevalet</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white">Nouvelle Demande</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Demande - Cartes & Chevalets</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow
                                label="Représentant"
                                value={formData.rep}
                                onChange={(v) => setFormData({ ...formData, rep: v })}
                                placeholder="Nom du représentant"
                            />
                            <FormInputRow
                                label="Type"
                                inputType="select"
                                items={["Cartes Visite", "Chevalet", "Pied de Bureau"]}
                                value={formData.type}
                                onChange={(v) => setFormData({ ...formData, type: v })}
                            />
                            <FormInputRow
                                label="Quantité"
                                type="number"
                                value={formData.qte}
                                onChange={(v) => setFormData({ ...formData, qte: v })}
                                placeholder="Nombre d'unités"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline">Annuler</Button>
                            <Button className="bg-amber-600 text-white">Confirmer</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <CustomDataTable
                data={data}
                columns={columns}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                variant="dark"
            />
        </div>
    );
};

export default CartesVisitePage;
