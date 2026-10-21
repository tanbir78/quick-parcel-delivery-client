import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/authentications/Login";
import Register from "../pages/authentications/Register";
import Coverage from "../pages/Coverage";
import SendParcel from "../pages/sendParcel/SendParcel";
import PrivateRoute from "../router/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/dashboard/MyParcels";
import Payment from "../pages/dashboard/Payment";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import TrackParcel from "../pages/dashboard/TrackParcel";
import UpdateTracking from "../pages/dashboard/UpdateTracking";
import BeARider from "../pages/dashboard/BeARider";
import PendingRiders from "../pages/dashboard/PendingRiders";
import ActiveRiders from "../pages/dashboard/ActiveRiders";
import MakeAdmin from "../pages/dashboard/MakeAdmin";
import Forbidden from "../pages/Forbidden";
import AdminRoute from "./AdminRoute";
import AssignRider from "../pages/dashboard/AssignRider";
import PendingDeliveries from "../pages/dashboard/PendingDeliveries";
import CompletedDeliveries from "../pages/dashboard/CompletedDeliveries";
import RiderRoute from "./RiderRoute";
import MyEarning from "../pages/dashboard/MyEarning";
import DashboardHome from "../layouts/DashboardHome";
import UserRoute from "./UserRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'coverage', Component: Coverage
            },
            {
                path: "forbidden", Component: Forbidden
            },
            {
                path: 'beARider',
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
                // loader: () => fetch('./warehouses.json')
            },
            {
                path: 'sendParcel',
                element: <PrivateRoute>
                    <SendParcel></SendParcel>
                </PrivateRoute>
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                index: true,
                Component: DashboardHome
            },
            {
                path: 'myParcels',
                element: <UserRoute>
                    <MyParcels></MyParcels>
                </UserRoute>
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            },
            {
                path: 'paymentHistory',
                element: <UserRoute>
                    <PaymentHistory></PaymentHistory>
                </UserRoute>
            },
            {
                path: 'track',
                Component: TrackParcel
            },

            // rider only routes
            {
                path: 'my-deliveries',
                element: <RiderRoute>
                    <PendingDeliveries></PendingDeliveries>
                </RiderRoute>
            },
            {
                path: 'completed-deliveries',
                element: <RiderRoute>
                    <CompletedDeliveries></CompletedDeliveries>
                </RiderRoute>
            },
            {
                path: 'my-earning',
                element: <RiderRoute>
                    <MyEarning></MyEarning>
                </RiderRoute>
            },

            // admin only routes
            {
                path: 'assign-riders',
                element: <AdminRoute>
                    <AssignRider></AssignRider>
                </AdminRoute>
            },
            {
                path: 'pending-riders',
                element: <AdminRoute>
                    <PendingRiders></PendingRiders>
                </AdminRoute>
            },
            {
                path: 'active-riders',
                element: <AdminRoute>
                    <ActiveRiders></ActiveRiders>
                </AdminRoute>
            },
            {
                path: "make-admin",
                element: <AdminRoute>
                    <MakeAdmin></MakeAdmin>
                </AdminRoute>
            },
            // {
            //     path: "update-tracking",
            //     Component: UpdateTracking
            // }
        ]
    }
]);