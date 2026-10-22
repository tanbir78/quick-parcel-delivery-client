
import UseAuth from "../hocks/UseAuth";
import UseUserRole from "../hocks/UseUserRole";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
    const { user, loading } = UseAuth();
    const { role, roleLoading, error } = UseUserRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return (
            <span className="loading loading-spinner loading-xs"></span>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (error || role !== "admin") {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;
