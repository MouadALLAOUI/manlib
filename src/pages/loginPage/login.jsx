import useAppStore from "../../store/useAppStore";
import LoginForm from "../../components/loginPage/LoginForm";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";

function LoginPage() {
    const { login: setAuthUser } = useAppStore();
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

            // 3. Go to dashboard
            navigate("/dash");

        } catch (err) {
            console.error("Login Error:", err.response || err);
            setError(err.response?.data?.message || "Identifiants incorrects");
        }
    };

    return (
        <div className="LoginPage bg-slate-900 min-h-screen flex flex-col items-center justify-center">
            <LoginForm onLogIn={handleSubmit} error={error} />
        </div>
    );
}

export default LoginPage;