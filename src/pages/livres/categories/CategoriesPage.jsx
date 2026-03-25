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

function CategoriesPage() {

    const categories = [
        {
            id: 1,
            libelle: "Primaire",
        },
        {
            id: 2,
            libelle: "Collège",
        },
        {
            id: 3,
            libelle: "Lycée",
        },
        {
            id: 4,
            libelle: "Près-scolaire",
        },
        {
            id: 5,
            libelle: "Robotos",
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
                <h1>Liste des catégories</h1>
                <AddCategoryDialog />
            </div>

            <CustomDataTable
                data={categories}
                variant="green"
                pageSize={4}
                actions={["view", "edit", "delete"]}
                onAction={handleAction}
                columns={[
                    { header: "Libelle", accessor: "libelle" }
                ]}
            />
        </div>
    )
}

const AddCategoryDialog = ({ onSubmit = () => { } }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-sm bg-emerald-700 text-white">Ajouter une catégorie</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">Ajouter une catégorie</DialogTitle>
                    <DialogDescription className="space-y-4">
                        <div>
                            <label htmlFor="libelle" className="text-slate-500 mb-3 font-medium">Libellé :</label>
                            <Input
                                type="text"
                                id="libelle"
                                placeholder="Entrer le nom de la catégorie"
                                className="h-12 border-slate-200 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="text-slate-500 font-medium">Description :</label>
                            <Textarea
                                type="text"
                                id="description"
                                placeholder="Entrer la description de la catégorie"
                                className="h-12 border-slate-200 focus:ring-primary"
                            />
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

export default CategoriesPage;