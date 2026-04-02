import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";
import bVentesClientService from "../../../api/services/bVentesClientService";
import toast from "react-hot-toast";

const BLClientsPage = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await bVentesClientService.getAll();
            setData(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching client bls:", error);
            toast.error("Erreur lors du chargement des BL clients");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { header: "Client", accessor: "client_name" }, // Assuming API resource returns client_name
        { header: "N° BL Client", accessor: "n_bl" },
        { header: "Montant", accessor: "total_ht" },
        { header: "Date", accessor: "date_livraison" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Bons de Livraison Clients</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white">Nouveau BL Client</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Créer un BL Client</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow label="Client" placeholder="Sélectionner un client..." />
                            <FormInputRow label="N° BL" placeholder="BLC-2026-XXX" />
                            <FormInputRow label="Date" type="date" />
                        </div>
                        <Button className="w-full bg-slate-900 text-white">Générer</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <CustomDataTable data={data} columns={columns} actions={["view", "print", "delete"]} variant="dark" isLoading={isLoading} />
        </div>
    );
};

export default BLClientsPage;
