import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { CustomDataTable } from "../../../components/ui/table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { AccordionComponent } from "../../../components/ui/accordion";
import { CustomSelectComponent } from "../../../components/ui/select";

const BOOKS_BY_LEVEL = {
    "Primaire": [
        { id: "p1", label: "Informatique et Robotique au primaire N1" },
        { id: "p2", label: "Informatique et Robotique au primaire N2" }
    ],
    "collège": [
        { id: "c1", label: "Informatique, Robotique et IA au collège N1" },
        { id: "c2", label: "Développeur DIGITAL" }
    ],
    "lycée": [{ id: "l1", label: "Science Ingénieur N1" }],
    "préscolaire": [{ id: "pre1", label: "Eveil Tech" }],
    "Robotos": [{ id: "r1", label: "Kit Arduino Starer" }]
};

function ReprésentantSaisirBl() {
    const [formData, setFormData] = useState({
        fournisseur: "",
        date: "",
        n_bl: "",
        details: [] // This will store items with qte > 0
    });

    const updateDetail = (label, qte) => {
        setFormData(prev => {
            const filtered = prev.details.filter(item => item.label !== label);
            if (parseInt(qte) > 0) {
                return { ...prev, details: [...filtered, { label, qte }] };
            }
            return { ...prev, details: filtered };
        });
    };

    const BLs = [
        {
            id: 1,
            fournisseur: "watanya",
            representant: "John Doe",
            date: "11/02/2026",
            type: "Type 1",
            n_bl: "1",
            mode_envoi: "Envoi 1",
            is_vu: true,
            is_recu: false,
            details: [
                { label: "Informatique et Robotique au primaire N 1", qte: "5", color: "bg-blue-100 text-green-700" },
                { label: "Informatique et Robotique au primaire N 2", qte: "3", color: "bg-amber-100 text-amber-700" },
            ],
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
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Liste des BLs (Représentant)</h1>
                <BLDialog formData={formData} setFormData={setFormData} onUpdateDetail={updateDetail} />
            </div>

            <CustomDataTable
                data={BLs}
                variant="green"
                pageSize={4}
                actions={["view", "edit", "delete", "imp"]}
                onAction={handleAction}
                columns={[
                    { header: "Représentant", accessor: "representant" },
                    { header: "Date", accessor: "date" },
                    { header: "Type", accessor: "type" },
                    { header: "BL N°", accessor: "n_bl" },
                    { header: "Mode envoi", accessor: "mode_envoi" },
                    { header: "Vu", accessor: "is_vu" },
                    { header: "Reçu", accessor: "is_recu" },
                ]}
            />
        </div>
    );
}

const BLDialog = ({ formData, setFormData, onUpdateDetail }) => {

    const accordionLevels = Object.keys(BOOKS_BY_LEVEL).map(level => ({
        title: level.toUpperCase(),
        content: (
            <div className="p-2 space-y-2 bg-white">
                {BOOKS_BY_LEVEL[level].map((book) => (
                    <BookInput
                        key={book.id}
                        label={book.label}
                        onChange={(val) => onUpdateDetail(book.label, val)}
                        currentValue={formData.details.find(d => d.label === book.label)?.qte || ""}
                    />
                ))}
            </div>
        )
    }));
    const [priority, setPriority] = useState("");
    const [types, setTypes] = useState("");
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-emerald-700 text-white">Ajouter un BL</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center mb-5 text-emerald-700">Ajouter un BL (MSM-MEDIAS -- Représentant)</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="bg-sky-400 text-white text-center py-1 text-xs">Représentant</label>
                        <CustomSelectComponent
                            items={[
                                { label: "Adnane Baribi", value: "adnane" },
                                { label: "Mouad Allaoui", value: "mouad" }
                            ]}
                            value={priority}
                            onValueChange={(val) => setPriority(val)}
                            allowEmpty={true}
                            emptyLabel="Représentant"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="bg-sky-400 text-white text-center py-1 text-xs">Date</label>
                        <Input
                            type="date"
                            className="rounded-none border-sky-200"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="bg-sky-400 text-white text-center py-1 text-xs">Type</label>
                        <CustomSelectComponent
                            items={[
                                { label: "Livre", value: "livre" },
                                { label: "Spécimen", value: "specimen" },
                                { label: "Retour", value: "retour" },
                                { label: "Rejeté", value: "rejete" },
                                { label: "Pédagogie", value: "pedagogie" },
                            ]}
                            value={types}
                            onValueChange={(val) => setTypes(val)}
                            allowEmpty={true}
                            emptyLabel="Type"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="bg-sky-400 text-white text-center py-1 text-xs">BL N°</label>
                        <Input
                            className="rounded-none border-sky-200"
                            value={formData.n_bl}
                            id="n_bl"
                            placeholder="saisir le numéro du BL"
                            onChange={(e) => setFormData({ ...formData, n_bl: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="bg-sky-400 text-white text-center py-1 text-xs">Mode d'envoi</label>
                        <Input
                            className="rounded-none border-sky-200"
                            value={formData.mode_envoi}
                            id="mode_envoi"
                            placeholder="Mode d'envoi"
                            onChange={(e) => setFormData({ ...formData, mode_envoi: e.target.value })}
                        />
                    </div>
                </div>

                <AccordionComponent
                    variant="outline"
                    AccordionItems={accordionLevels}
                    id="levels"
                    allowMultiple={true}
                />

                {/* Summary Table (Yellow table from image) */}
                {formData.details.length > 0 && (
                    <div className="mt-10 border border-amber-200 max-w-md mx-auto">
                        <div className="grid grid-cols-4 bg-amber-400 font-bold text-xs p-2">
                            <div className="col-span-3">Titre</div>
                            <div className="text-center">Qté</div>
                        </div>
                        {formData.details.map((item, i) => (
                            <div key={i} className="grid grid-cols-4 text-xs p-2 border-t border-amber-100 bg-amber-50">
                                <div className="col-span-3">{item.label}</div>
                                <div className="text-center font-bold">{item.qte}</div>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <div className="flex gap-2 justify-center w-full">
                            <Button className="bg-sky-500 text-white px-10">Valider</Button>
                        </div>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const BookInput = ({ label, onChange, currentValue }) => {
    // Determine if highlighted (green in your image)
    const isSelected = parseInt(currentValue) > 0;

    return (
        <div className="flex items-center gap-1">
            <div className={`flex-1 border p-2 text-sm transition-colors ${isSelected ? 'bg-green-700 text-white' : 'bg-white text-black'}`}>
                {label}
            </div>
            <Input
                type="number"
                className="w-20 rounded-none border-slate-400 text-right"
                placeholder="0"
                value={currentValue}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default ReprésentantSaisirBl;
