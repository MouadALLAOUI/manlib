import useAppStore from "../../store/useAppStore";
import LoginForm from "../../components/loginPage/LoginForm";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";
import { Button } from "../../components/ui/button";

function LoginPage() {
    const { login: setAuthUser, setAdminMode } = useAppStore();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (credentials) => {
        try {
            setError("");

            // 0. Get CSRF cookie. This is a web route, so we call it directly without the /api prefix.
            await api.get('http://localhost:8000/sanctum/csrf-cookie');

            // 1. Call the backend
            const response = await api.post('/login', {
                login: credentials.login,
                password: credentials.password,
                type: credentials.type
            });

            // 2. Update the global Zustand store state
            // The cookie is set automatically by the backend (HttpOnly)
            setAuthUser(response.data.user);
            setAdminMode(credentials.type === "admin");

            // 3. Go to dashboard
            navigate("/dash/home");

        } catch (err) {
            console.error("Login Error:", err.response || err);
            setError(err.response?.data?.message || "Identifiants incorrects");
        }
    };

    return (
        <div className="LoginPage bg-slate-900 min-h-screen flex flex-col items-center justify-center">
            <LoginForm onLogIn={handleSubmit} error={error} />

            <div className="mt-8 flex gap-4">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setAdminMode(true);
                        setAuthUser({ id: 'dev-admin', login: 'admin', type: 'admin' });
                        navigate("/dash/home");
                    }}
                >
                    Login as Admin
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setAdminMode(false);
                        setAuthUser({ id: 'dev-user', login: 'user', type: 'user' });
                        navigate("/dash/home");
                    }}
                >
                    Login as User
                </Button>
            </div>
        </div>
    );
}

export default LoginPage;
