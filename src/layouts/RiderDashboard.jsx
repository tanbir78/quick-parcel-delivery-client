import { useCallback, useEffect, useState } from "react";
import {
    FaBox,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaUser,
    FaShippingFast,
} from "react-icons/fa";
import UseAuth from "../hocks/UseAuth";
import useAxiosSecure from "../hocks/UseAxiosSecure";

const RiderDashboard = () => {
    const { user } = UseAuth();
    const axiosSecure = useAxiosSecure();

    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const fetchDeliveries = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            setLoadError("");

            const response = await axiosSecure.get("/rider/delivery-tasks");

            setParcels(
                Array.isArray(response.data) ? response.data : []
            );
            setLastUpdated(new Date());
        } catch (error) {
            setLoadError(
                error.response?.data?.message ||
                "Could not refresh your delivery overview."
            );
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let timer;

        const load = async () => {
            try {
                const response = await axiosSecure.get("/rider/delivery-tasks");
                if (cancelled) return;

                setParcels(
                    Array.isArray(response.data) ? response.data : []
                );
                setLoadError("");
                setLastUpdated(new Date());
            } catch (error) {
                if (!cancelled) {
                    setLoadError(
                        error.response?.data?.message ||
                        "Could not refresh your delivery overview."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        // Automatically refresh the overview every 15 seconds.
        timer = setInterval(() => {
            if (!document.hidden) load();
        }, 15000);

        // Refresh immediately when rider returns to this browser tab.
        const handleVisibilityChange = () => {
            if (!document.hidden) load();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            cancelled = true;
            clearInterval(timer);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [axiosSecure]);
    const getStatus = (parcel) =>
        String(
            parcel.delivery_status || parcel.status || "pending"
        ).toLowerCase();

    const completedCount = parcels.filter((parcel) =>
        ["delivered", "completed"].includes(getStatus(parcel))
    ).length;

    const activeCount = parcels.filter((parcel) =>
        ["assigned", "pending", "picked-up", "picked_up", "in-transit", "in_transit"].includes(
            getStatus(parcel)
        )
    ).length;

    const pickedUpCount = parcels.filter((parcel) =>
        ["picked-up", "picked_up", "in-transit", "in_transit"].includes(
            getStatus(parcel)
        )
    ).length;

    const stats = [
        {
            title: "Total Tasks",
            value: parcels.length,
            description: "All assigned deliveries",
            icon: <FaBox />,
            iconStyle: "bg-primary/10 text-primary",
        },
        {
            title: "Pending Tasks",
            value: activeCount,
            description: "Tasks to work on",
            icon: <FaClock />,
            iconStyle: "bg-warning/15 text-warning",
        },
        {
            title: "Picked Up",
            value: pickedUpCount,
            description: "Parcels in progress",
            icon: <FaTruck />,
            iconStyle: "bg-info/10 text-info",
        },
        {
            title: "Completed",
            value: completedCount,
            description: "Successfully delivered",
            icon: <FaCheckCircle />,
            iconStyle: "bg-success/10 text-success",
        },
    ];

    return (
        <main className="min-h-screen space-y-6 bg-base-200 p-4 text-base-content sm:p-6 lg:p-8">

            {/* Welcome Card */}
            <section className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
                <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Welcome back,{" "}
                            {user?.displayName?.split(" ")[0] || "Rider"}!
                            <span className="ml-2">👋</span>
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
                            Ready for another productive day? Manage your
                            deliveries and keep every parcel moving.
                        </p>
                    </div>

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl bg-primary/10 text-4xl text-primary sm:self-center">
                        <FaShippingFast />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-base-300 pt-5 text-sm text-base-content/60">
                    <span className="flex items-center gap-2">
                        <FaUser className="text-primary" />
                        {user?.email || "Rider account"}
                    </span>

                    <span className="badge badge-success badge-outline">
                        Rider Portal
                    </span>
                </div>
            </section>

            {/* Statistics */}
            <section>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                            Your Delivery Overview
                        </h2>
                        <p className="mt-1 text-sm text-base-content/60">
                            Auto-refreshes every 15 seconds
                            {lastUpdated && (
                                <> · Last updated {lastUpdated.toLocaleTimeString()}</>
                            )}
                        </p>
                    </div>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => fetchDeliveries(true)}
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
                            className="btn btn-sm"
                            onClick={() => fetchDeliveries(true)}
                            disabled={loading}
                        >
                            {loading ? "Refreshing..." : "Retry"}
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

                                    <div
                                        className={`rounded-2xl p-3 text-xl ${item.iconStyle}`}
                                    >
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
        </main>
    );
};

export default RiderDashboard;