import { useState } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { BookOpen, Plus, Save, Trash2, Edit } from "lucide-react";

const ModelesCahierTextePage = () => {
    const [templates] = useState([]);
    const [editingTemplate, setEditingTemplate] = useState({ name: "", content: "" });

    return (
        <div className="max-w-5xl mx-auto space-y-6 pt-6 px-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Modèles Cahier de Texte</h1>
                        <p className="text-slate-500 text-sm">Créez et gérez des modèles de saisie pour vos cahiers de texte.</p>
                    </div>
                </div>
                <Button disabled className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    <Plus size={18} /> Nouveau Modèle
                </Button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                <div className="font-bold">Backend missing</div>
                <div>Endpoints requis (exemple): GET/POST/PUT/DELETE /api/cahier-templates</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {templates.length === 0 ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-slate-600 font-semibold">Aucun modèle disponible.</p>
                            <p className="text-slate-500 text-sm">Connexion backend requise pour charger et gérer les modèles.</p>
                        </div>
                    ) : null}
                    {templates.map((template) => (
                        <div key={template.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-all group">
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800">{template.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1 italic">"{template.content}"</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                    <Edit size={18} />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit space-y-6">
                    <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Éditer le Modèle</h3>
                    
                    <FormInputRow 
                        label="Nom du Modèle" 
                        placeholder="Ex: Modèle Devoir" 
                        value={editingTemplate.name} 
                        onChange={(v) => setEditingTemplate({ ...editingTemplate, name: v })} 
                        layout="col"
                    />
                    
                    <FormInputRow 
                        label="Contenu du Modèle" 
                        inputType="textarea" 
                        placeholder="Utilisez des variables entre accolades {var}" 
                        value={editingTemplate.content} 
                        onChange={(v) => setEditingTemplate({ ...editingTemplate, content: v })} 
                        layout="col"
                    />

                    <div className="p-4 bg-amber-50 rounded-xl text-xs text-amber-800 space-y-1">
                        <div className="font-bold flex items-center gap-1">
                            Conseil:
                        </div>
                        <p>Les variables comme {"{chapitre}"}, {"{page}"} seront remplacées lors de la saisie réelle.</p>
                    </div>

                    <Button disabled className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 h-12 font-bold hover:bg-slate-800 transition-colors">
                        <Save size={18} /> Sauvegarder
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModelesCahierTextePage;
