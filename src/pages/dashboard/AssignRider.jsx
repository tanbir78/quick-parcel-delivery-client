import { useEffect, useState } from "react";
import { FaBox, FaMotorcycle, FaTimes, FaMapMarkerAlt, FaUser, } from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import useTrackingLogger from "../../hocks/useTrackingLogger";

const AssignRider = () => {
    const { logTracking } = useTrackingLogger();
    const axiosSecure = UseAxiosSecure();

    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedParcel, setSelectedParcel] = useState(null);
    const [riders, setRiders] = useState([]);
    const [ridersLoading, setRidersLoading] = useState(false);
    const [assigningRiderId, setAssigningRiderId] = useState(null);

    // Load pending and paid parcels
    useEffect(() => {
        let cancelled = false;

        const fetchParcels = async () => {
            try {
                setLoading(true);

                const res = await axiosSecure.get(
                    "/parcels/assign-rider"
                );

                if (!cancelled) {
                    setParcels(
                        Array.isArray(res.data) ? res.data : []
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load parcels:", error);

                    Swal.fire(
                        "Error",
                        error.response?.data?.message ||
                        "Failed to load parcels.",
                        "error"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchParcels();

        return () => {
            cancelled = true;
        };
    }, [axiosSecure]);

    // Open modal and load active riders by service center
    const handleAssignRider = async (parcel) => {
        const district = parcel.receiverServiceCenter?.trim();

        if (!district) {
            Swal.fire(
                "Missing Service Center",
                "This parcel has no receiver service center.",
                "warning"
            );
            return;
        }

        setSelectedParcel(parcel);
        setRiders([]);
        setRidersLoading(true);

        try {
            const res = await axiosSecure.get(
                `/riders/available?district=${encodeURIComponent(
                    district
                )}`
            );

            setRiders(
                Array.isArray(res.data) ? res.data : []
            );
        } catch (error) {
            console.error("Failed to load riders:", error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "Failed to load matching riders.",
                "error"
            );
        } finally {
            setRidersLoading(false);
        }
    };

    // Assign selected rider to the parcel
    const handleSelectRider = async (rider) => {
        const confirmation = await Swal.fire({
            title: "Assign this rider?",
            text: `${rider.name || rider.email} will be assigned to this parcel.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Assign",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a",
        });

        if (!confirmation.isConfirmed) return;

        setAssigningRiderId(rider._id);

        try {
            Swal.fire({
                title: "Assigning Rider...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
            });

            // Backend updates parcel delivery_status and rider workStatus
            const res = await axiosSecure.patch(
                `/parcels/${selectedParcel._id}/assign-rider`,
                {
                    riderId: rider._id,
                }
            );

            // Remove the assigned parcel from the pending list
            setParcels((previous) =>
                previous.filter(
                    (parcel) => parcel._id !== selectedParcel._id
                )
            );

            setSelectedParcel(null);
            setRiders([]);

            await Swal.fire({
                title: "Rider Assigned!",
                text:
                    res.data?.message ||
                    "Parcel assigned successfully.",
                icon: "success",
            });
            // 
            await logTracking({
                parcelId: selectedParcel._id,
                trackingId: selectedParcel.trackingId,
                status: "assigned",
                title: "Rider Assigned",
                description: "A rider has been assigned to your parcel.",

                riderName: rider.name || "",
                riderEmail: rider.email || "",
                riderPhone: rider.phone || rider.phoneNumber || "",
                location: selectedParcel.receiverServiceCenter || "",
            });

        } catch (error) {
            console.error("Assign rider error:", error);

            Swal.fire({
                title: "Assignment Failed",
                text:
                    error.response?.data?.message ||
                    "Could not assign the rider.",
                icon: "error",
            });
        } finally {
            setAssigningRiderId(null);
        }
    };

    const closeModal = () => {
        if (assigningRiderId) return;

        setSelectedParcel(null);
        setRiders([]);
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
            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaMotorcycle className="text-primary" />
                        Assign Rider
                    </h2>

                    <p className="text-base-content/70 mt-1">
                        Assign available riders to paid parcels.
                    </p>
                </div>

                <div className="badge badge-primary badge-lg">
                    Parcels: {parcels.length}
                </div>
            </div>

            {/* Parcel table */}
            {parcels.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <FaBox className="text-4xl text-base-content/40" />

                        <h3 className="text-xl font-semibold mt-2">
                            No Parcels Available
                        </h3>

                        <p className="text-base-content/60">
                            No pending parcels with paid payments were found.
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
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Service Center</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>

                                    <td className="font-mono text-xs">
                                        {parcel.trackingId || parcel._id}
                                    </td>

                                    <td>
                                        <div className="font-semibold">
                                            {parcel.parcelName ||
                                                parcel.title ||
                                                "Parcel"}
                                        </div>

                                        <div className="text-xs text-base-content/60">
                                            {parcel.parcelType || "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="font-medium">
                                            {parcel.senderName || "N/A"}
                                        </div>

                                        <div className="text-xs text-base-content/60">
                                            {parcel.senderEmail || "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="font-medium">
                                            {parcel.receiverName || "N/A"}
                                        </div>

                                        <div className="text-xs text-base-content/60">
                                            {parcel.receiverPhone || "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-primary shrink-0" />
                                            {parcel.receiverServiceCenter || "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <span className="badge badge-success">
                                            {parcel.paymentStatus}
                                        </span>
                                    </td>

                                    <td>
                                        {parcel.delivery_status ? (
                                            <span className="badge badge-info p-2">
                                                {parcel.delivery_status}
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">
                                                {parcel.status}
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() =>
                                                handleAssignRider(parcel)
                                            }
                                        >
                                            <FaMotorcycle />
                                            Assign Rider
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rider selection modal */}
            {selectedParcel && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-5xl">
                        {/* Modal heading */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    Select a Rider
                                </h3>

                                <p className="text-base-content/70 mt-2">
                                    Choose a rider for this parcel.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="badge badge-outline gap-1">
                                        <FaBox />
                                        {selectedParcel.trackingId ||
                                            selectedParcel._id}
                                    </span>

                                    <span className="badge badge-primary gap-1">
                                        <FaMapMarkerAlt />
                                        {selectedParcel.receiverServiceCenter}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn btn-circle btn-ghost btn-sm"
                                onClick={closeModal}
                                disabled={assigningRiderId !== null}
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Rider loading */}
                        {ridersLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <span className="loading loading-spinner loading-lg text-primary" />

                                <p className="mt-3 text-base-content/60">
                                    Finding matching riders...
                                </p>
                            </div>
                        ) : riders.length === 0 ? (
                            /* No matching riders */
                            <div className="text-center py-12">
                                <FaMotorcycle className="text-5xl mx-auto text-base-content/40" />

                                <h4 className="font-semibold text-lg mt-4">
                                    No Riders Available
                                </h4>

                                <p className="text-base-content/60 mt-2">
                                    No active riders found for{" "}
                                    <strong>
                                        {selectedParcel.receiverServiceCenter}
                                    </strong>.
                                </p>
                            </div>
                        ) : (
                            /* Matching riders table */
                            <div className="overflow-x-auto mt-6">
                                <p className="text-sm text-base-content/60 mb-3">
                                    {riders.length} matching rider(s) found
                                </p>

                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Rider</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>District</th>
                                            <th>Bike</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {riders.map((rider, index) => (
                                            <tr key={rider._id}>
                                                <td>{index + 1}</td>

                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <FaUser className="text-primary shrink-0" />

                                                        <span className="font-semibold">
                                                            {rider.name || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {rider.email || "N/A"}
                                                </td>

                                                <td>
                                                    {rider.phone || "N/A"}
                                                </td>

                                                <td>
                                                    {rider.district || "N/A"}
                                                </td>

                                                <td>
                                                    <div className="font-medium">
                                                        {rider.bikeBrand || "N/A"}
                                                    </div>

                                                    <div className="text-xs text-base-content/60">
                                                        {rider.bikeRegistrationNumber ||
                                                            ""}
                                                    </div>
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        disabled={
                                                            assigningRiderId !== null
                                                        }
                                                        onClick={() =>
                                                            handleSelectRider(
                                                                rider
                                                            )
                                                        }
                                                    >
                                                        {assigningRiderId ===
                                                            rider._id ? (
                                                            <span className="loading loading-spinner loading-xs" />
                                                        ) : (
                                                            <FaMotorcycle />
                                                        )}

                                                        Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Modal footer */}
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={closeModal}
                                disabled={assigningRiderId !== null}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(event) => {
                            event.preventDefault();
                            closeModal();
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default AssignRider;
