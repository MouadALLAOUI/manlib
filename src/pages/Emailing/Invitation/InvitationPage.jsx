import { useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { UserPlus, Send } from "lucide-react";

const InvitationPage = () => {
    const [formData, setFormData] = useState({ 
        email: "", 
        role: "représentant",
        message: "" 
    });

    return (
        <div className="max-w-3xl mx-auto space-y-6 pt-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Envoyer une Invitation</h1>
                    <p className="text-slate-500 text-sm">Invitez un nouveau représentant ou fournisseur sur la plateforme.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                    <div className="font-bold">Backend missing</div>
                    <div>Endpoint requis (exemple): POST /api/invitations</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputRow 
                        label="Adresse Email" 
                        placeholder="email@exemple.com" 
                        value={formData.email} 
                        onChange={(v) => setFormData({ ...formData, email: v })} 
                    />
                    <FormInputRow 
                        label="Rôle" 
                        inputType="select" 
                        items={["représentant", "fournisseur", "admin"]} 
                        value={formData.role} 
                        onChange={(v) => setFormData({ ...formData, role: v })} 
                    />
                </div>
                
                <FormInputRow 
                    label="Message d'accompagnement" 
                    inputType="textarea" 
                    placeholder="Votre message ici..." 
                    value={formData.message} 
                    onChange={(v) => setFormData({ ...formData, message: v })} 
                />

                <div className="pt-4 border-t border-slate-50">
                    <Button disabled className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 py-6 text-lg font-bold hover:bg-blue-700 transition-colors">
                        <Send size={20} /> Envoyer l'invitation
                    </Button>
                </div>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-800 text-sm">
                <div className="font-bold">Note:</div>
                <p>Un lien unique sera envoyé à cette adresse email pour permettre la création du compte.</p>
            </div>
        </div>
    );
};

export default InvitationPage;
