import { useCallback, useEffect, useState } from "react";
import { FaBox, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaTruck, } from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import useTrackingLogger from "../../hocks/useTrackingLogger";

const PendingDeliveries = () => {
    const { logTracking } = useTrackingLogger();
    const axiosSecure = UseAxiosSecure();

    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchDeliveries = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axiosSecure.get(
                "/rider/delivery-tasks"
            );

            setParcels(
                Array.isArray(res.data) ? res.data : []
            );
        } catch (error) {
            console.error("Failed to fetch deliveries:", error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "Failed to load delivery tasks.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    const handleDeliveryAction = async (parcel) => {
        const currentStatus = (
            parcel.delivery_status || parcel.status || ""
        ).toLowerCase();

        const isInTransit = currentStatus === "in-transit";

        const action = isInTransit ? "delivered" : "picked-up";

        const confirmation = await Swal.fire({
            title: isInTransit
                ? "Mark as Delivered?"
                : "Mark as Picked Up?",
            text: isInTransit
                ? `Confirm delivery of ${parcel.trackingId}?`
                : `Confirm pickup of ${parcel.trackingId}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isInTransit
                ? "Yes, Delivered"
                : "Yes, Picked Up",
            cancelButtonText: "Cancel",
            confirmButtonColor: isInTransit
                ? "#16a34a"
                : "#2563eb",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setUpdatingId(parcel._id);

            const res = await axiosSecure.patch(
                `/rider/delivery-tasks/${parcel._id}/status`,
                { action }
            );

            // Refresh tasks after a successful update.
            await fetchDeliveries();

            await Swal.fire(
                "Success",
                res.data?.message ||
                "Delivery status updated successfully.",
                "success"
            );
            const trackingRes = await logTracking({
                parcelId: parcel._id,
                trackingId: parcel.trackingId,
                status: isInTransit ? "delivered" : "picked_up",
                title: isInTransit ? "Parcel Delivered" : "Parcel Picked Up",
                description: isInTransit
                    ? "Your parcel has been delivered successfully."
                    : "The rider has picked up your parcel.",
            });

            // console.log("Tracking saved:", trackingRes);

        } catch (error) {
            console.error("Status update failed:", error);

            Swal.fire(
                "Update Failed",
                error.response?.data?.message ||
                "Could not update delivery status.",
                "error"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (parcel) => {
        const status = (
            parcel.delivery_status || parcel.status || "pending"
        ).toLowerCase();

        if (status === "delivered") {
            return (
                <span className="badge badge-success p-5">
                    Delivered
                </span>
            );
        }

        if (status === "in-transit") {
            return (
                <span className="badge badge-info p-5">
                    In Transit
                </span>
            );
        }

        return (
            <span className="badge badge-warning p-5">
                Pending Pickup
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaTruck className="text-primary" />
                        My Deliveries
                    </h2>

                    <p className="text-base-content/70 mt-1">
                        Manage your assigned pickup and delivery tasks.
                    </p>
                </div>

                <div className="badge badge-primary badge-lg">
                    Tasks: {parcels.length}
                </div>
            </div>

            {parcels.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <FaBox className="text-4xl text-base-content/40" />

                        <h3 className="text-xl font-semibold mt-2">
                            No Delivery Tasks
                        </h3>

                        <p className="text-base-content/60">
                            You have no pending pickups or active deliveries.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tracking ID</th>
                                <th>Parcel</th>
                                <th>Receiver</th>
                                <th>Pickup Address</th>
                                <th>Delivery Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {parcels.map((parcel, index) => {
                                const status = (
                                    parcel.delivery_status ||
                                    parcel.status ||
                                    "pending"
                                ).toLowerCase();

                                const isInTransit =
                                    status === "in-transit";

                                const isDelivered =
                                    status === "delivered";

                                return (
                                    <tr key={parcel._id}>
                                        <td>{index + 1}</td>

                                        <td className="font-mono text-xs">
                                            {parcel.trackingId || parcel._id}
                                        </td>

                                        <td>
                                            <div className="font-semibold">
                                                {parcel.parcelTitle ||
                                                    parcel.parcelName ||
                                                    "Parcel"}
                                            </div>
                                            <div className="text-xs text-base-content/60">
                                                {parcel.parcelType || "N/A"}
                                                {" · "}
                                                {parcel.weight ?? 0} kg
                                            </div>
                                        </td>

                                        <td>
                                            <div className="font-medium">
                                                {parcel.receiverName || "N/A"}
                                            </div>
                                            <div className="text-xs flex items-center gap-1 mt-1">
                                                <FaPhone />
                                                {parcel.receiverContact ||
                                                    parcel.receiverPhone ||
                                                    "N/A"}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex items-start gap-2">
                                                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                                                <div>
                                                    <div className="font-medium">
                                                        {parcel.senderServiceCenter ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-xs text-base-content/60">
                                                        {parcel.senderAddress ||
                                                            "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="flex items-start gap-2">
                                                <FaMapMarkerAlt className="text-success mt-1 shrink-0" />
                                                <div>
                                                    <div className="font-medium">
                                                        {parcel.receiverServiceCenter ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-xs text-base-content/60">
                                                        {parcel.receiverAddress ||
                                                            "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            {getStatusBadge(parcel)}
                                        </td>

                                        <td>
                                            {isDelivered ? (
                                                <span className="text-success flex items-center gap-2">
                                                    <FaCheckCircle />
                                                    Completed
                                                </span>
                                            ) : (
                                                <button
                                                    className={`btn btn-sm ${isInTransit
                                                        ? "btn-success"
                                                        : "btn-primary"
                                                        }`}
                                                    disabled={
                                                        updatingId !== null
                                                    }
                                                    onClick={() =>
                                                        handleDeliveryAction(
                                                            parcel
                                                        )
                                                    }
                                                >
                                                    {updatingId ===
                                                        parcel._id ? (
                                                        <span className="loading loading-spinner loading-xs" />
                                                    ) : isInTransit ? (
                                                        <FaCheckCircle />
                                                    ) : (
                                                        <FaBox />
                                                    )}

                                                    {isInTransit
                                                        ? "Mark Delivered"
                                                        : "Mark Picked Up"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PendingDeliveries;
