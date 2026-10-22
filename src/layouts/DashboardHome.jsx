
import UseUserRole from "../hocks/UseUserRole";
import Forbidden from "../pages/Forbidden";
import Loading from "../pages/shared/Loading";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";

const DashboardHome = () => {
    const { role, roleLoading, error } = UseUserRole();
    console.log("DashboardHome role:", role);
    console.log("DashboardHome loading:", roleLoading);
    console.log("DashboardHome error:", error);

    if (roleLoading) {
        return <Loading />;
    }

    if (error) {
        console.error("Failed to fetch user role:", error);
        return <p>Failed to load your dashboard. Please try again.</p>;
    }

    if (role === "user") {
        return <UserDashboard />;
    }

    if (role === "rider") {
        return <RiderDashboard />;
    }

    if (role === "admin") {
        return <AdminDashboard />;
    }

    return <Forbidden />;
};

export default DashboardHome;
