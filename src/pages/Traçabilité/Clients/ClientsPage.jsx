import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import FormInputRow from "../../../components/ui/FormInputRaw";
import clientService from "../../../api/services/clientService";
import toast from "react-hot-toast";

const ClientsPage = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ nom: "", ville: "", tel: "", type: "Librairie" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await clientService.getAll();
            // Laravel API Resources often wrap data in a 'data' key
            setData(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Erreur lors du chargement des clients");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            await clientService.create(formData);
            toast.success("Client ajouté avec succès");
            setIsDialogOpen(false);
            setFormData({ nom: "", ville: "", tel: "", type: "Librairie" });
            fetchData();
        } catch (error) {
            console.error("Error creating client:", error);
            toast.error("Erreur lors de l'ajout du client");
        }
    };

    const columns = [
        { header: "Nom du Client", accessor: "nom" },
        { header: "Ville", accessor: "ville" },
        { header: "Téléphone", accessor: "tel" },
        { header: "Type", accessor: "type" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Gestion des Clients</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white">Nouveau Client</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Ajouter un Client</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormInputRow label="Nom / Raison Sociale" value={formData.nom} onChange={(v) => setFormData({ ...formData, nom: v })} />
                            <FormInputRow label="Ville" value={formData.ville} onChange={(v) => setFormData({ ...formData, ville: v })} />
                            <FormInputRow label="Téléphone" value={formData.tel} onChange={(v) => setFormData({ ...formData, tel: v })} />
                            <FormInputRow label="Type" inputType="select" items={["Librairie", "École", "Autre"]} value={formData.type} onChange={(v) => setFormData({ ...formData, type: v })} />
                        </div>
                        <Button onClick={handleSubmit} className="w-full bg-slate-900 text-white">Enregistrer</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <CustomDataTable data={data} columns={columns} actions={["view", "edit", "delete"]} variant="dark" isLoading={isLoading} />
        </div>
    );
};

export default ClientsPage;
