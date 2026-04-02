import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { Send, Mail, Paperclip } from "lucide-react";

const SimpleEmailPage = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-6 px-4">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Mail size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messagerie Rapide</h1>
          <p className="text-slate-500 text-sm">Envoyez un email direct à vos collaborateurs ou partenaires.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInputRow
            label="À (Destinataire)"
            placeholder="exemple@mail.com"
            value={formData.to}
            onChange={(v) => setFormData({ ...formData, to: v })}
          />
          <FormInputRow
            label="Objet"
            placeholder="Sujet de votre message"
            value={formData.subject}
            onChange={(v) => setFormData({ ...formData, subject: v })}
          />
        </div>

        <FormInputRow
          label="Corps du message"
          inputType="textarea"
          placeholder="Saisissez votre message ici..."
          value={formData.message}
          onChange={(v) => setFormData({ ...formData, message: v })}
        />

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <Button variant="outline" className="flex items-center gap-2">
            <Paperclip size={18} /> Joindre un fichier
          </Button>
          <Button className="bg-blue-600 text-white flex items-center gap-2 px-8 h-12 font-bold hover:bg-blue-700 transition-all shadow-md">
            <Send size={18} /> Envoyer le message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Emails Envoyés Aujourd'hui</p>
          <p className="text-xl font-black text-slate-700">12</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Taux de Délivrance</p>
          <p className="text-xl font-black text-emerald-600">99.8%</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Quota Restant</p>
          <p className="text-xl font-black text-blue-600">488 / 500</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailPage;
