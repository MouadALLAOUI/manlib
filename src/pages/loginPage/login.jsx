import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/loginPage/LoginForm";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";

function LoginPage() {
    const { login: setAuthUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (credentials) => {
        try {
            setError("");

            // 1. Call the backend
            const response = await api.post('/login', {
                login: credentials.login,
                password: credentials.password,
                type: credentials.type
            });

            // 2. Save token and user info to LocalStorage
            const { access_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            // 3. Update the global AuthContext state
            setAuthUser(user);

            // 4. Go to dashboard
            navigate("/dash");

        } catch (err) {
            console.error("Login Error:", err.response || err);
            setError(err.response?.data?.message || "Identifiants incorrects");
        }
    };

    return (
        <div className="LoginPage bg-blue-500 min-h-screen flex flex-col items-center justify-center">
            <LoginForm onLogIn={handleSubmit} error={error} />
        </div>
    );
}

export default LoginPage;