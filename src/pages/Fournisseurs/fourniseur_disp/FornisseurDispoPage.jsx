import { useState } from "react";
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

function FournisseursDisponibles() {

    const [raisonSocial, setRaisonSocial] = useState("");
    const [adresse, setAdresse] = useState("");
    const [nomDirecteur, setNomDirecteur] = useState("");
    const [emailDirecteur, setEmailDirecteur] = useState("");
    const [telDirecteur, setTelDirecteur] = useState("");
    const [nomAdjoint, setNomAdjoint] = useState("");
    const [emailAdjoint, setEmailAdjoint] = useState("");
    const [telAdjoint, setTelAdjoint] = useState("");

    const fields = { raisonSocial, adresse, nomDirecteur, emailDirecteur, telDirecteur, nomAdjoint, emailAdjoint, telAdjoint };
    const fieldsFunc = { setRaisonSocial, setAdresse, setNomDirecteur, setEmailDirecteur, setTelDirecteur, setNomAdjoint, setEmailAdjoint, setTelAdjoint };

    const categories = [
        {
            id: 1,
            social: "watanya",
            adress: "marrakech",
            nom_directeur: "abdellatif",
            email_directeur: "iwatanya@gmail.com",
            tel_directeur: "0661  165 264",
            nom_adjoint: "nourdine",
            email_adjoint: "0610 965 105",
            tel_adjoint: "hhhh@gmail.com",
        },
        {
            id: 2,
            social: "BEST BM",
            adress: "MArrakech Massira",
            nom_directeur: "Abderrahim",
            email_directeur: "adnanebaribi@gmail.com",
            tel_directeur: "0668962669",
            nom_adjoint: "nourdine",
            email_adjoint: "0610 965 105",
            tel_adjoint: "hhhh@gmail.com",
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
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1>Liste des Fournisseurs</h1>
                <FournisseurDialog fields={fields} fieldsFunc={fieldsFunc} />
            </div>

            <CustomDataTable
                data={categories}
                variant="green"
                pageSize={4}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                columns={[
                    { header: "Raison Social", accessor: "social" }
                ]}
            />
        </div>
    )
}

const FournisseurDialog = ({ fields, fieldsFunc, onSubmit = () => { }, operation = "add", values = {} }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-sm bg-emerald-700 text-white">Ajouter un fournisseur</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">Ajouter un fournisseur</DialogTitle>
                    <DialogDescription className="space-y-4" asChild>
                        <div className="grid grid-cols-2 gap-2">

                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="social" className="text-slate-500 font-medium text-sm">Raison social :</label>
                                <Input
                                    type="text"
                                    id="social"
                                    value={fields.raisonSocial}
                                    onChange={(e) => fieldsFunc.setRaisonSocial(e.target.value)}
                                    placeholder="saisir la raison sociale"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="adresse" className="text-slate-500 font-medium text-sm">Adresse :</label>
                                <Input
                                    type="text"
                                    id="adresse"
                                    value={fields.adresse}
                                    onChange={(e) => fieldsFunc.setAdresse(e.target.value)}
                                    placeholder="saisir l'adresse"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>

                            <div className="flex flex-col content-center justify-center col-span-2">
                                <p className="text-slate-500 font-medium text-md">Directeur :</p>
                            </div>

                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="nom_directeur" className="text-slate-500 font-medium text-sm">Nom du directeur :</label>
                                <Input
                                    type="text"
                                    id="nom_directeur"
                                    value={fields.nom_directeur}
                                    onChange={(e) => fieldsFunc.setNomDirecteur(e.target.value)}
                                    placeholder="saisir le nom du directeur"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>


                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="email_directeur" className="text-slate-500 font-medium text-sm">Email du directeur :</label>
                                <Input
                                    type="text"
                                    id="email_directeur"
                                    value={fields.email_directeur}
                                    onChange={(e) => fieldsFunc.setEmailDirecteur(e.target.value)}
                                    placeholder="saisir l'email du directeur"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>

                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="tel_directeur" className="text-slate-500 font-medium text-sm">Téléphone du directeur :</label>
                                <Input
                                    type="text"
                                    id="tel_directeur"
                                    value={fields.tel_directeur}
                                    onChange={(e) => fieldsFunc.setTelDirecteur(e.target.value)}
                                    placeholder="saisir le téléphone du directeur"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>

                            <div className="flex flex-col content-center justify-center col-span-2">
                                <p className="text-slate-500 font-medium text-md">Ad-Joint :</p>
                            </div>

                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="nom_adjoint" className="text-slate-500 font-medium text-sm">Nom de l'adjoint :</label>
                                <Input
                                    type="text"
                                    id="nom_adjoint"
                                    value={fields.nom_adjoint}
                                    onChange={(e) => fieldsFunc.setNomAdjoint(e.target.value)}
                                    placeholder="saisir le nom de l'adjoint"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="email_adjoint" className="text-slate-500 font-medium text-sm">Email de l'adjoint :</label>
                                <Input
                                    type="text"
                                    id="email_adjoint"
                                    value={fields.email_adjoint}
                                    onChange={(e) => fieldsFunc.setEmailAdjoint(e.target.value)}
                                    placeholder="saisir l'email de l'adjoint"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="tel_adjoint" className="text-slate-500 font-medium text-sm">Téléphone de l'adjoint :</label>
                                <Input
                                    type="text"
                                    id="tel_adjoint"
                                    value={fields.tel_adjoint}
                                    onChange={(e) => fieldsFunc.setTelAdjoint(e.target.value)}
                                    placeholder="saisir le téléphone de l'adjoint"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>


                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <div>
                            <Button className="bg-emerald-900 text-white" variant="outline" onClick={onSubmit}>Ajouter</Button>
                            <Button className="bg-red-700 text-white" variant="outline">Fermer</Button>
                        </div>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FournisseursDisponibles;