import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { FaBox, FaCheckCircle, FaTruck, FaArrowRight, FaClipboardList, FaShippingFast, FaCreditCard, FaPlus, FaSearch, FaUserCircle, } from "react-icons/fa";
import UseAuth from "../hocks/UseAuth";
import useAxiosSecure from "../hocks/UseAxiosSecure";

const UserDashboard = () => {
    const { user } = UseAuth();
    const axiosSecure = useAxiosSecure();
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchParcels = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            setLoadError("");

            // This endpoint must return only the logged-in user's parcels.
            const response = await axiosSecure.get("/parcels/my-parcels");
            setParcels(Array.isArray(response.data) ? response.data : []);
            setLastUpdated(new Date());
        } catch (error) {
            setLoadError(
                error.response?.data?.message ||
                "Could not load your parcels. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        let cancelled = false;

        const loadParcels = async () => {
            try {
                const response = await axiosSecure.get("/parcels/my-parcels");

                if (!cancelled) {
                    setParcels(
                        Array.isArray(response.data) ? response.data : []
                    );
                    setLoadError("");
                    setLastUpdated(new Date());
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(
                        error.response?.data?.message ||
                        "Could not load your parcels. Please try again."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadParcels();

        const intervalId = setInterval(() => {
            if (!document.hidden) loadParcels();
        }, 15000);

        const handleVisibilityChange = () => {
            if (!document.hidden) loadParcels();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [axiosSecure]);

    const getStatus = (parcel) =>
        String(parcel.delivery_status || parcel.status || "pending")
            .toLowerCase()
            .replaceAll("_", "-");

    const completedParcels = parcels.filter((parcel) =>
        ["delivered", "completed"].includes(getStatus(parcel))
    );

    const activeParcels = parcels.filter((parcel) =>
        [
            "pending",
            "assigned",
            "picked-up",
            "in-transit",
            "out-for-delivery",
        ].includes(getStatus(parcel))
    );

    const unpaidParcels = parcels.filter((parcel) =>
        ["unpaid", "pending"].includes(
            String(parcel.paymentStatus || parcel.payment_status || "unpaid").toLowerCase()
        )
    );

    const stats = [
        {
            title: "Total Parcels",
            value: parcels.length,
            description: "Parcels created by you",
            icon: <FaBox />,
            iconStyle: "bg-primary/10 text-primary",
        },
        {
            title: "In Progress",
            value: activeParcels.length,
            description: "Parcels on their way",
            icon: <FaTruck />,
            iconStyle: "bg-info/10 text-info",
        },
        {
            title: "Delivered",
            value: completedParcels.length,
            description: "Successfully delivered",
            icon: <FaCheckCircle />,
            iconStyle: "bg-success/10 text-success",
        },
        {
            title: "Unpaid Parcels",
            value: unpaidParcels.length,
            description: "Payments that may need attention",
            icon: <FaCreditCard />,
            iconStyle: "bg-warning/15 text-warning",
        },
    ];

    const quickActions = [
        {
            title: "Send a Parcel",
            description: "Create a new delivery request",
            icon: <FaPlus />,
            to: "/sendParcel",
            iconStyle: "bg-primary/10 text-primary",
        },
        {
            title: "My Parcels",
            description: "View all your parcel details",
            icon: <FaClipboardList />,
            to: "/dashboard/myParcels",
            iconStyle: "bg-info/10 text-info",
        },
        {
            title: "Track a Parcel",
            description: "Check the latest delivery status",
            icon: <FaSearch />,
            to: "/dashboard/track",
            iconStyle: "bg-secondary/10 text-secondary",
        },
        {
            title: "Update Profile",
            description: "Keep your personal information current",
            icon: <FaUserCircle />,
            to: "/dashboard/profile",
            iconStyle: "bg-success/10 text-success",
        },
    ];

    return (
        <main className="min-h-screen space-y-6 bg-base-200 p-4 text-base-content sm:p-6 lg:p-8">
            {/* Welcome */}
            <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Hello, {user?.displayName?.split(" ")[0] || "there"}! 👋
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
                            Welcome to Quick Parcel Delivery. Send parcels,
                            track deliveries, and keep everything in one place.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-base-content/60">
                            <FaUserCircle className="text-primary" />
                            <span>{user?.email || "Your account"}</span>
                        </div>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center self-start rounded-2xl bg-primary/10 text-4xl text-primary sm:self-center">
                        <FaShippingFast />
                    </div>
                </div>
            </section>

            {/* Parcel Overview */}
            <section>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                            Your Parcel Overview
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => fetchParcels(true)}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "Refresh now"}
                    </button>
                </div>

                {loading ? (
                    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-base-300 bg-base-100">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                ) : loadError ? (
                    <div className="alert alert-error">
                        <span>{loadError}</span>
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => fetchParcels(true)}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-base-content/60">
                                            {item.title}
                                        </p>
                                        <h3 className="mt-3 text-3xl font-bold">
                                            {item.value}
                                        </h3>
                                    </div>
                                    <div className={`rounded-2xl p-3 text-xl ${item.iconStyle}`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-base-content/50">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Quick Actions */}
            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-bold sm:text-2xl">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            to={action.to}
                            className="group flex items-center gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                        >
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${action.iconStyle}`}>
                                {action.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold">{action.title}</h3>
                                <p className="mt-1 text-xs leading-5 text-base-content/60">
                                    {action.description}
                                </p>
                            </div>
                            <FaArrowRight className="shrink-0 text-base-content/40 transition group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default UserDashboard;
