import UseUserRole from '../hocks/UseUserRole';
import Forbidden from '../pages/Forbidden';
import Loading from '../pages/shared/Loading';
import AdminDashboard from './AdminDashboard';
import RiderDashboard from './RiderDashboard';
import UserDashboard from './UserDashboard';

const DashboardHome = () => {
    const { role, isLoading } = UseUserRole();

    if (isLoading) return <Loading></Loading>
    if (role === 'user') return <UserDashboard></UserDashboard>
    else if (role === 'rider') return <RiderDashboard></RiderDashboard>
    else if (role === 'admin') return <AdminDashboard></AdminDashboard>
    else return <Forbidden></Forbidden>
};

export default DashboardHome;