import { Loader2 } from "lucide-react";
import useAppStore from "../store/useAppStore";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const { user, loading, isAdminMode } = useAppStore();
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

    if (isAdminMode === false) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children ? children : <Outlet />;
}
