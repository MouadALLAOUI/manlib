import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";

const RemboursementClientPage = () => {
    const [data] = useState([
        { id: 1, client: "LIBRAIRIE MARRAKECH", montant: "250.00 DH", mode: "Espèces", date: "2026-03-25", status: "Terminé" },
    ]);

    const columns = [
        { header: "Client", accessor: "client" },
        { header: "Montant", accessor: "montant" },
        { header: "Mode", accessor: "mode" },
        { header: "Date", accessor: "date" },
        { header: "Statut", accessor: "status" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Remboursements Clients</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white">Nouveau Remboursement</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Enregistrer un Remboursement</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow label="Client" placeholder="Nom du client..." />
                            <FormInputRow label="Montant" type="number" />
                            <FormInputRow label="Mode" inputType="select" items={["Espèces", "Chèque", "Virement"]} />
                        </div>
                        <Button className="w-full bg-slate-900 text-white">Valider</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view", "delete"]} variant="dark" />
        </div>
    );
};

export default RemboursementClientPage;
