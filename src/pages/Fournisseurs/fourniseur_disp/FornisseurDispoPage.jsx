import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
    CustomDataTable
} from "../../../components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import imprimeurService from "../../../api/services/imprimeurService";
import toast from "react-hot-toast";

function FournisseursDisponibles() {
    const [imprimeurs, setImprimeurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [raisonSocial, setRaisonSocial] = useState("");
    const [adresse, setAdresse] = useState("");
    const [nomDirecteur, setNomDirecteur] = useState("");
    const [emailDirecteur, setEmailDirecteur] = useState("");
    const [telDirecteur, setTelDirecteur] = useState("");
    const [nomAdjoint, setNomAdjoint] = useState("");
    const [emailAdjoint, setEmailAdjoint] = useState("");
    const [telAdjoint, setTelAdjoint] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fields = { raisonSocial, adresse, nomDirecteur, emailDirecteur, telDirecteur, nomAdjoint, emailAdjoint, telAdjoint };
    const fieldsFunc = { setRaisonSocial, setAdresse, setNomDirecteur, setEmailDirecteur, setTelDirecteur, setNomAdjoint, setEmailAdjoint, setTelAdjoint };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await imprimeurService.getAll();
            setImprimeurs(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching fournisseurs:", error);
            toast.error("Erreur lors du chargement des fournisseurs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (type, row) => {
        if (type === "delete") {
            if (window.confirm("Supprimer ce fournisseur ?")) {
                try {
                    await imprimeurService.delete(row.id);
                    toast.success("Fournisseur supprimé");
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
            const data = {
                raison_sociale: raisonSocial,
                adresse,
                directeur_nom: nomDirecteur,
                directeur_email: emailDirecteur,
                directeur_tel: telDirecteur,
                adjoint_nom: nomAdjoint,
                adjoint_email: emailAdjoint,
                adjoint_tel: telAdjoint
            };
            await imprimeurService.create(data);
            toast.success("Fournisseur ajouté avec succès");
            setIsDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'ajout du fournisseur");
        }
    };

    const resetForm = () => {
        setRaisonSocial("");
        setAdresse("");
        setNomDirecteur("");
        setEmailDirecteur("");
        setTelDirecteur("");
        setNomAdjoint("");
        setEmailAdjoint("");
        setTelAdjoint("");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Liste des Fournisseurs</h1>
                <FournisseurDialog
                    fields={fields}
                    fieldsFunc={fieldsFunc}
                    onSubmit={handleSubmit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <CustomDataTable
                    data={imprimeurs}
                    variant="slate"
                    pageSize={10}
                    actions={["view", "edit", "delete"]}
                    onAction={handleAction}
                    isLoading={isLoading}
                    columns={[
                        { header: "Raison Social", accessor: "raison_sociale" },
                        { header: "Adresse", accessor: "adresse" },
                        { header: "Email Directeur", accessor: "directeur_email" },
                        { header: "Téléphone", accessor: "directeur_tel" }
                    ]}
                />
            </div>
        </div>
    )
}

const FournisseurDialog = ({ fields, fieldsFunc, onSubmit = () => { }, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-black text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-slate-100 transition-all hover:scale-[1.02]">
                    + Ajouter un fournisseur
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="bg-slate-900 p-8 text-white">
                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">Nouveau Fournisseur</DialogTitle>
                    <p className="text-slate-400 text-sm mt-1">Enregistrer un nouveau partenaire fournisseur dans le système.</p>
                </DialogHeader>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Basic Info */}
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Raison Sociale</label>
                        <Input
                            placeholder="Ex: SARL Librairie Centrale"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.raisonSocial}
                            onChange={(e) => fieldsFunc.setRaisonSocial(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Adresse Complète</label>
                        <Input
                            placeholder="Adresse du siège..."
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.adresse}
                            onChange={(e) => fieldsFunc.setAdresse(e.target.value)}
                        />
                    </div>

                    {/* Directeur Info */}
                    <div className="col-span-2 mt-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-4">Informations Directeur</h3>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nom Directeur</label>
                        <Input
                            placeholder="Nom et Prénom"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.nomDirecteur}
                            onChange={(e) => fieldsFunc.setNomDirecteur(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email</label>
                        <Input
                            type="email"
                            placeholder="directeur@email.com"
                            className="h-12 border-slate-200 focus:ring-slate-900 rounded-xl bg-slate-50/50"
                            value={fields.emailDirecteur}
                            onChange={(e) => fieldsFunc.setEmailDirecteur(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <DialogClose asChild>
                        <Button variant="outline" className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200">Annuler</Button>
                    </DialogClose>
                    <Button
                        onClick={onSubmit}
                        className="h-12 px-8 rounded-xl font-bold bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 transition-all"
                    >
                        Enregistrer Fournisseur
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FournisseursDisponibles;