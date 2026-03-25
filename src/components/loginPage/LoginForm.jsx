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
        <div className="flex min-h-screen items-center justify-center bg-[#2563eb] p-4 w-full">
            <div className="w-full max-w-[450px] rounded-xl bg-white p-10 shadow-2xl">
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-100 p-0">
                        <img src="https://dev.ajial-medias.com/logo.png" alt="Logo" className="h-full w-full object-contain rounded-full" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">AJIAL MEDIAS</h2>
                </div>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 w-full max-w-[450px]">
                        {error}
                    </div>
                )}
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <FormInputRow
                            label="Année :"
                            id="annee"
                            inputType="select"
                            items={[{ label: "2026/2027", value: "2627" }]}
                            layout="column"
                            value={formData.annee}
                            onChange={(value) => setFormData({ ...formData, annee: value })}
                            placeholder="Année"
                            allowEmpty={true}
                            emptyLabel="Choisir une année :"
                        />
                    </div>
                    <div className="space-y-1">
                        <FormInputRow
                            label="Pseudo :"
                            id="login"
                            type="text"
                            layout="column"
                            value={formData.login}
                            error={dataErr.login}
                            onChange={(value) => setFormData({ ...formData, login: value })}
                            placeholder="Votre identifiant"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-1">
                        <FormInputRow
                            label="Mot de passe :"
                            id="password"
                            type="password"
                            required
                            layout="column"
                            error={dataErr.password}
                            value={formData.password}
                            onChange={(value) => setFormData({ ...formData, password: value })}
                            disabled={isSubmitting}
                            placeholder="*******"
                        />
                    </div>
                    <Button type="submit" className="h-12 w-full text-lg font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-white">
                        Authentification
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;