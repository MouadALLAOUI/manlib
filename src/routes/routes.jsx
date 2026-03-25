import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/loginPage/login";
import HomePage from "../pages/home/HomePage";
import HeaderPages from "../layouts/HeaderPages";
import CategoriesPage from "../pages/livres/categories/CategoriesPage";
import LivresPage from "../pages/livres/livre/LivresPage";
import FournisseursDisponibles from "../pages/Fournisseurs/fourniseur_disp/FornisseurDispoPage";
import FournisseurSaisirBl from "../pages/Fournisseurs/BL/SaisirBlPage";
import ReprésentantDisponibles from "../pages/Représentant/ReprésentantDisponibles/ReprésentantDisponibles";
import ReprésentantSaisirBl from "../pages/Représentant/ReprésentantSaisirBl/ReprésentantSaisirBl";
import ReprésentantRemboursement from "../pages/Représentant/ReprésentantRemboursement/ReprésentantRemboursement";
import { ProtectedRoute } from "./protectedRoute";
import { useAuth } from "../context/AuthContext";

export const AppRoutes = () => {
    const { user, loading } = useAuth();
    console.log("ProtectedRoute - Auth State:", { user, loading });
    return (
        <Routes>
            {/* Protected Routes */}

            <Route path="/" element={<Navigate to={user ? "/dash/home" : "/login"} replace />} />


            <Route
                path="/dash"
                element={
                    <ProtectedRoute >
                        <HeaderPages role="admin" />
                    </ProtectedRoute >
                }
            >
                <Route path="home" element={<HomePage />} />
                <Route
                    path="livres"
                    element={<Outlet />}
                >
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="livres" element={<LivresPage />} />
                    <Route index element={<Navigate to="categories" replace />} />
                </Route>
                <Route
                    path="fournisseurs"
                    element={<Outlet />}
                >
                    <Route path="Fournisseurs_disponibles" element={<FournisseursDisponibles />} />
                    <Route path="Saisir_un_BL" element={<FournisseurSaisirBl />} />
                    <Route path="Remboursement" element={<div>Remboursement Page</div>} />
                    <Route index element={<Navigate to="Fournisseurs_disponibles" replace />} />
                </Route>
                <Route
                    path="representant"
                    element={<Outlet />}
                >
                    <Route path="Representants_disponibles" element={<ReprésentantDisponibles />} />
                    <Route path="Saisir_un_BL" element={<ReprésentantSaisirBl />} />
                    <Route path="Remboursement" element={<ReprésentantRemboursement />} />
                    <Route index element={<Navigate to="Representants_disponibles" replace />} />
                </Route>
                <Route index element={<Navigate to="home" replace />} />
            </Route>


            {/* Public Routes */}
            <Route
                path="/login"
                element={user ? <Navigate to="/dash/home" replace /> : <LoginPage />}
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

const Logout = () => {
    const { logout } = useAuth();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    logout();
    return <Navigate to="/login" replace />;
}