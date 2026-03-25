import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ children, role = "admin", indexPath = "/" }) => {
    const { user, loading } = useAuth();
    // console.log("ProtectedRoute - Auth State:", { user, profile, loading });
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // LOGIC CHANGE:
    // 1. If route needs 'admin' -> Only 'admin' can enter.
    if (role !== 'admin') {
        return <Navigate to={indexPath} replace />;
    }
    return children ? children : <Outlet />;
}