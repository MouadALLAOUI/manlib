import { useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { CalendarDays, Save } from "lucide-react";

const SaisonTravailPage = () => {
    const [saison, setSaison] = useState("");

    return (
        <div className="max-w-md mx-auto space-y-6 pt-10">
            <div className="text-center space-y-2">
                <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-full mb-2">
                    <CalendarDays size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Saison de Travail</h1>
                <p className="text-slate-500 text-sm">Définissez la saison active pour l'ensemble du système.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                    <div className="font-bold">Backend missing</div>
                    <div>Endpoints requis (exemple): GET/PUT /api/settings/saison</div>
                </div>
                <FormInputRow 
                    label="Saison Active" 
                    inputType="select" 
                    items={["2024/2025", "2025/2026", "2026/2027", "2027/2028"]} 
                    value={saison} 
                    onChange={setSaison}
                    layout="col"
                />
                <Button disabled className="w-full bg-slate-900 text-white flex items-center gap-2 h-12 font-bold">
                    <Save size={18} /> Appliquer les changements
                </Button>
            </div>
        </div>
    );
};

export default SaisonTravailPage;
