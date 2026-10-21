import { useQuery } from "@tanstack/react-query";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaSyncAlt } from "react-icons/fa";

import useAxiosSecure from "../hocks/UseAxiosSecure";
import Loading from "../pages/shared/Loading";

const STATUS_COLORS = {
    pending: "#3B82F6",       // Blue
    assigned: "#86EFAC",      // Light Green
    "pending-pickup": "#8B5CF6", // Purple
    "in-transit": "#0EA5E9",  // Sky Blue
    delivered: "#22C55E",     // Green
    cancelled: "#EF4444",     // Red
};

const STATUS_LABELS = {
    pending: "Pending",
    assigned: "Rider Assigned",
    "pending-pickup": "Pending Pickup",
    "in-transit": "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: statusCounts = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["admin-delivery-status-count"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/admin/delivery-status-count"
            );

            if (!Array.isArray(res.data)) {
                throw new Error("Invalid response from server.");
            }

            return res.data;
        },
    });

    // Total parcels
    const totalParcels = statusCounts.reduce(
        (total, item) => total + (Number(item.count) || 0),
        0
    );

    // Prepare chart data
    const chartData = statusCounts
        .map((item) => ({
            status: item.status || "pending",
            name:
                STATUS_LABELS[item.status] ||
                item.status ||
                "Unknown",
            value: Number(item.count) || 0,
        }))
        .filter((item) => item.value > 0);

    if (isLoading) {
        return <Loading message="Loading parcel status chart..." />;
    }

    if (isError) {
        return (
            <div className="p-6">
                <div className="alert alert-error">
                    <span>
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Failed to load parcel status."}
                    </span>

                    <button
                        className="btn btn-sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? "Retrying..." : "Retry"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="mx-auto max-w-3xl space-y-6">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold md:text-4xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 text-base-content/60">
                            Monitor parcel delivery statuses at a glance.
                        </p>
                    </div>

                    <button
                        onClick={() => refetch()}
                        className="btn btn-primary"
                        disabled={isFetching}
                    >
                        <FaSyncAlt
                            className={isFetching ? "animate-spin" : ""}
                        />
                        {isFetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {/* Pie Chart */}
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="text-center text-xl font-bold">
                            Parcel Status Distribution
                        </h2>

                        {chartData.length === 0 ? (
                            <div className="py-10 text-center text-base-content/60">
                                No parcel data available.
                                <p className="mt-2 text-3xl font-bold text-base-content">
                                    Total: {totalParcels}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Donut Pie Chart with Total in Center */}
                                <div className="relative h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={85}
                                                outerRadius={145}
                                                paddingAngle={3}
                                            >
                                                {chartData.map((item) => (
                                                    <Cell
                                                        key={item.status}
                                                        fill={STATUS_COLORS[item.status] || "#14B8A6"}
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} parcels`,
                                                    name,
                                                ]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Total in the Center */}
                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-sm text-base-content/60">
                                            Total Parcels
                                        </span>

                                        <span className="text-3xl font-bold">
                                            {totalParcels}
                                        </span>
                                    </div>
                                </div>

                                {/* Legend Below Chart */}
                                <div className="border-t border-base-300 pt-5">
                                    <h3 className="mb-4 text-center font-semibold">
                                        Parcel Status Legend
                                    </h3>

                                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-3">
                                        {chartData.map((item) => (
                                            <div
                                                key={item.status}
                                                className="flex items-center gap-2"
                                            >
                                                <span
                                                    className="h-3 w-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            STATUS_COLORS[item.status] || "#14B8A6",
                                                    }}
                                                />

                                                <span className="text-sm">
                                                    {item.name} ({item.value})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;