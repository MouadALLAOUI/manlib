import { useState } from "react";
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
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
          <div className="font-bold">Backend missing</div>
          <div>Endpoint requis (exemple): POST /api/emails/send</div>
        </div>
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
          <Button disabled variant="outline" className="flex items-center gap-2">
            <Paperclip size={18} /> Joindre un fichier
          </Button>
          <Button disabled className="bg-blue-600 text-white flex items-center gap-2 px-8 h-12 font-bold hover:bg-blue-700 transition-all shadow-md">
            <Send size={18} /> Envoyer le message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailPage;
