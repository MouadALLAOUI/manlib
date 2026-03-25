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
import { Textarea } from "../../../components/ui/textarea";
import { useState } from "react";
import { CustomSelectComponent } from "../../../components/ui/select";

function LivresPage() {

    const livres = [
        {
            id: 1,
            titre: "informatique et programmation au primaire N1",
            code: "R1",
            categorie: "Primaire",
            achat: "20.00",
            vente: "25.00",
            PPublique: "30",
            NbrPages: "200",
            color: "bg-green-100 hover:bg-green-200",
            desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        },
        {
            id: 2,
            titre: "informatique et programmation au primaire N2",
            code: "R2",
            categorie: "Primaire",
            achat: "20.00",
            vente: "25.00",
            PPublique: "30",
            NbrPages: "200",
            color: "bg-blue-100 text-red-900 hover:bg-blue-200",
            desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        },
        {
            id: 3,
            titre: "informatique et programmation au primaire N3",
            code: "R3",
            categorie: "Primaire",
            achat: "20.00",
            vente: "25.00",
            PPublique: "30",
            NbrPages: "200",
            // color: "bg-green-100",
            desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.",
        },
    ];

    const [titre, setTitre] = useState("");
    const [code, setCode] = useState("");
    const [categorie, setCategorie] = useState("Primaire");
    const [achat, setAchat] = useState("");
    const [vente, setVente] = useState("");
    const [ppublique, setPPublique] = useState("");
    const [pages, setPages] = useState("");
    const [color, setColor] = useState("#FFFFFF");
    const [desc, setDesc] = useState("");

    const fields = { titre, code, categorie, achat, vente, ppublique, pages, color, desc };
    const fieldsFunc = { setTitre, setCode, setCategorie, setAchat, setVente, setPPublique, setPages, setColor, setDesc };

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
                <h1>Liste des livres</h1>
                <AddCategoryDialog fields={fields} fieldsFunc={fieldsFunc} onSubmit={() => console.log(fields)} />
            </div>

            <CustomDataTable
                data={livres}
                variant="green"
                pageSize={4}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                columns={[
                    { header: "Titre", accessor: "titre" },
                    { header: "Code", accessor: "code" },
                    { header: "Catégorie", accessor: "categorie" },
                    { header: "Prix d'achat", accessor: "achat" },
                    { header: "Prix de vente", accessor: "vente" },
                    { header: "Prix public", accessor: "PPublique" },
                    { header: "Nombre de pages", accessor: "NbrPages" }
                ]}
            />
        </div>
    )
}

const AddCategoryDialog = ({ onSubmit = () => { }, fields, fieldsFunc, setColor }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">Ajouter un Livre</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">Ajouter un livre</DialogTitle>
                    <DialogDescription className="space-y-4" asChild>
                        <div className="grid grid-cols-2 gap-2">

                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="titre" className="text-slate-500 font-medium text-sm">Titre :</label>
                                <Input
                                    type="text"
                                    id="titre"
                                    value={fields.titre}
                                    onChange={(e) => fieldsFunc.setTitre(e.target.value)}
                                    placeholder="saisir le titre du livre"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="code" className="text-slate-500 font-medium text-sm">Code :</label>
                                <Input
                                    type="text"
                                    id="code"
                                    value={fields.code}
                                    onChange={(e) => fieldsFunc.setCode(e.target.value)}
                                    placeholder="code"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>


                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="categorie" className="text-slate-500 font-medium text-sm">Catégorie :</label>
                                <CustomSelectComponent
                                    items={["Primaire", "Collège", "Lycée", "Universitaire"]}
                                    placeholder="Choisir une catégorie"
                                    onValueChange={(value) => fieldsFunc.setCategorie(value)}
                                    className="h-12 border-slate-200 focus:ring-primary"
                                    value={fields.categorie}
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="achat" className="text-slate-500 font-medium text-sm">Achat (DH) :</label>
                                <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    id="achat"
                                    value={fields.achat}
                                    onChange={(e) => fieldsFunc.setAchat(e.target.value)}
                                    placeholder="saisir le prix d'achat"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>


                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="vente" className="text-slate-500 font-medium text-sm">Vente (DH) :</label>
                                <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    id="vente"
                                    value={fields.vente}
                                    onChange={(e) => fieldsFunc.setVente(e.target.value)}
                                    placeholder="saisir le prix de vente"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="ppublique" className="text-slate-500 font-medium text-sm">Prix public (DH) :</label>
                                <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    id="ppublique"
                                    value={fields.ppublique}
                                    onChange={(e) => fieldsFunc.setPPublique(e.target.value)}
                                    placeholder="saisir le prix public"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>


                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="pages" className="text-slate-500 font-medium text-sm">Nbr de pages :</label>
                                <Input
                                    type="number"
                                    min={1}
                                    id="pages"
                                    value={fields.pages}
                                    onChange={(e) => fieldsFunc.setPages(e.target.value)}
                                    placeholder="saisir le nombre de pages"
                                    className="h-12 border-slate-200 focus:ring-primary"
                                />
                            </div>
                            <div className="flex flex-col content-center justify-center">
                                <label htmlFor="color" className="block text-slate-500 mb-1 font-medium text-sm">
                                    Couleur du livre:
                                </label>
                                <Input
                                    type="color"
                                    id="color"
                                    value={fields.color}
                                    onChange={(e) => fieldsFunc.setColor(e.target.value)}
                                    className="h-10 w-20 p-1 cursor-pointer"
                                />
                                <span className="text-xs font-mono">{fields.color}</span>
                            </div>


                            <div className="col-span-2 flex flex-col content-center justify-between">
                                <label htmlFor="description" className="text-slate-500 font-medium text-sm">Déscription (Optionnelle) :</label>
                                <Textarea
                                    type="text"
                                    id="description"
                                    value={fields.desc}
                                    onChange={(e) => fieldsFunc.setDesc(e.target.value)}
                                    placeholder="saisir la description du livre"
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

export default LivresPage;