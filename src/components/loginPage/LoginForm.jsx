import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import FormInputRow from "../ui/FormInputRaw";

function LoginForm({ onLogIn, error }) {
    // 1. Create state for the form fields
    const [formData, setFormData] = useState({
        login: "admin",
        password: "123456",
        type: "admin", // Default to admin
        annee: "2627"
    });
    const [dataErr, setDataErr] = useState({
        login: "",
        password: "",
        annee: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setDataErr({ login: "", password: "", annee: "" });
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // 2. Clear old errors so they don't stay if the user fixed them
        setDataErr({ login: "", password: "", annee: "" });
        try {
            // check for empty fields
            let hasError = false;
            if (!formData.login) {
                setDataErr(prev => ({ ...prev, login: "Le champ login est requis" }));
                hasError = true;
            }
            if (!formData.password) {
                setDataErr(prev => ({ ...prev, password: "Le champ mot de passe est requis" }));
                hasError = true;
            }

            if (hasError) {
                setIsSubmitting(false);
                return;
            }

            onLogIn(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 w-full">
            <div className="w-full max-w-[450px] rounded-2xl bg-white p-12 shadow-2xl border border-slate-800/10">
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 p-2">
                        <img src="https://dev.ajial-medias.com/logo.png" alt="Logo" className="h-full w-full object-contain" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">AJIAL MEDIAS</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Système de Gestion de Bibliothèque</p>
                </div>
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <FormInputRow
                            label="Année Scolaire"
                            id="annee"
                            inputType="select"
                            items={[{ label: "2026 / 2027", value: "2627" }]}
                            layout="column"
                            value={formData.annee}
                            onChange={(value) => setFormData({ ...formData, annee: value })}
                            placeholder="Sélectionner l'année"
                            allowEmpty={false}
                            className="space-y-1"
                        />
                        <FormInputRow
                            label="Identifiant"
                            id="login"
                            type="text"
                            layout="column"
                            value={formData.login}
                            error={dataErr.login}
                            onChange={(value) => setFormData({ ...formData, login: value })}
                            placeholder="Ex: admin"
                            required
                            disabled={isSubmitting}
                            className="space-y-1"
                        />
                        <FormInputRow
                            label="Mot de passe"
                            id="password"
                            type="password"
                            layout="column"
                            value={formData.password}
                            error={dataErr.password}
                            onChange={(value) => setFormData({ ...formData, password: value })}
                            placeholder="••••••••"
                            required
                            disabled={isSubmitting}
                            className="space-y-1"
                        />
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-black text-white h-12 rounded-xl font-bold shadow-xl shadow-slate-200 transition-all hover:scale-[1.01] active:scale-95"
                    >
                        {isSubmitting ? "Connexion..." : "SE CONNECTER"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;