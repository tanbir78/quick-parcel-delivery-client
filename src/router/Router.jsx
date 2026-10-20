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
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            },
            {
                path: 'paymentHistory',
                Component: PaymentHistory
            },
            {
                path: 'track',
                Component: TrackParcel
            },
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