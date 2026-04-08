import { useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { FileText, Save, Info } from "lucide-react";

const PiedDeFacturePage = () => {
    const [formData, setFormData] = useState({ 
        bank_name: "", 
        rib: "", 
        contact_info: "",
        footer_text: ""
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <FileText size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Configuration Pied de Facture</h1>
                    <p className="text-slate-500 text-sm">Paramétrez les informations qui s'affichent en bas de vos documents (Factures, BLs).</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                    <div className="font-bold">Backend missing</div>
                    <div>Endpoints requis (exemple): GET/PUT /api/settings/pied-de-facture</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormInputRow 
                        label="Nom de la Banque" 
                        placeholder="Ex: Attijariwafa bank" 
                        value={formData.bank_name} 
                        onChange={(v) => setFormData({ ...formData, bank_name: v })} 
                    />
                    <FormInputRow 
                        label="RIB Bancaire" 
                        placeholder="24 chiffres" 
                        value={formData.rib} 
                        onChange={(v) => setFormData({ ...formData, rib: v })} 
                    />
                </div>
                
                <FormInputRow 
                    label="Informations de Contact" 
                    placeholder="Tél, Email, Site Web..." 
                    value={formData.contact_info} 
                    onChange={(v) => setFormData({ ...formData, contact_info: v })} 
                />

                <FormInputRow 
                    label="Texte de Mentions Légales" 
                    inputType="textarea" 
                    placeholder="Saisissez les mentions légales ou conditions de paiement..." 
                    value={formData.footer_text} 
                    onChange={(v) => setFormData({ ...formData, footer_text: v })} 
                />

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button disabled className="bg-slate-900 text-white flex items-center gap-2 px-8 h-12 font-bold hover:bg-slate-800 transition-colors">
                        <Save size={18} /> Enregistrer la configuration
                    </Button>
                </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800 text-sm">
                <Info size={20} className="shrink-0" />
                <p>Ces informations seront appliquées à toutes les nouvelles factures générées à partir de maintenant.</p>
            </div>
        </div>
    );
};

export default PiedDeFacturePage;
