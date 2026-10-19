import { useCallback, useEffect, useState } from "react";
import {
    FaEye,
    FaCheck,
    FaTimes,
    FaUserClock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";

const PendingRiders = () => {
    const axiosSecure = UseAxiosSecure();

    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRider, setSelectedRider] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const fetchPendingRiders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get("/riderApplications/pending");
            setRiders(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Failed to load applications.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        fetchPendingRiders();
    }, [fetchPendingRiders]);

    // const { isPending, data: riders = [], refetch } = useQuery({
    //     queryKey: ['pending-riders'],
    //     queryFn: async () => {
    //         const res = await axiosSecure.get("/riders/pending");
    //         return res.data;
    //     }
    // })

    const handleDecision = async (rider, status, email) => {
        const isAccept = status === "active";

        const confirmation = await Swal.fire({
            title: isAccept ? "Accept this rider?" : "Reject this application?",
            text: isAccept
                ? `${rider.name}'s application will be approved.`
                : `${rider.name}'s application will be rejected.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isAccept ? "Yes, Accept" : "Yes, Reject",
            cancelButtonText: "Go Back",
            confirmButtonColor: isAccept ? "#16a34a" : "#dc2626",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setProcessingId(rider._id);

            await axiosSecure.patch(
                `/riderApplications/${rider._id}/status`,
                { status, email }
            );

            setRiders((previous) =>
                previous.filter((item) => item._id !== rider._id)
            );
            setSelectedRider(null);

            await Swal.fire(
                isAccept ? "Rider Accepted!" : "Application Rejected",
                isAccept
                    ? "The rider is now active."
                    : "The application has been rejected.",
                "success"
            );
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.message || "Could not update application.",
                "error"
            );
        } finally {
            setProcessingId(null);
        }
    };

    const Detail = ({ label, value }) => (
        <div className="border-b border-base-300 py-2">
            <p className="text-sm text-base-content/60">{label}</p>
            <p className="font-medium break-words">
                {value === undefined || value === null || value === ""
                    ? "Not provided"
                    : String(value)}
            </p>
        </div>
    );

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
                        <FaUserClock className="text-warning" />
                        Pending Rider Applications
                    </h2>
                    <p className="text-base-content/70 mt-1">
                        Review applications and accept or reject riders.
                    </p>
                </div>

                <div className="badge badge-warning badge-lg">
                    Pending: {riders.length}
                </div>
            </div>

            {riders.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <FaUserClock className="text-4xl text-base-content/40" />
                        <h3 className="text-xl font-semibold mt-2">
                            No Pending Applications
                        </h3>
                        <p className="text-base-content/60">
                            All applications have been reviewed.
                        </p>
                        <button
                            className="btn btn-outline btn-sm mt-3"
                            onClick={fetchPendingRiders}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Rider</th>
                                <th>Contact</th>
                                <th>Service Area</th>
                                <th>Bike</th>
                                <th>Status</th>
                                <th>Details</th>
                                <th>Decision</th>
                            </tr>
                        </thead>

                        <tbody>
                            {riders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <div className="font-semibold">{rider.name}</div>
                                        <div className="text-xs text-base-content/60">
                                            Age: {rider.age || "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <div>{rider.phone}</div>
                                        <div className="text-xs text-base-content/60">
                                            {rider.email}
                                        </div>
                                    </td>

                                    <td>
                                        <div>{rider.region}</div>
                                        <div className="text-xs text-base-content/60">
                                            {rider.district}
                                        </div>
                                    </td>

                                    <td>
                                        <div>{rider.bikeBrand}</div>
                                        <div className="text-xs text-base-content/60">
                                            {rider.bikeRegistrationNumber}
                                        </div>
                                    </td>

                                    <td>
                                        <span className="badge badge-warning">Pending</span>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-outline btn-info btn-sm"
                                            onClick={() => setSelectedRider(rider)}
                                            aria-label={`View ${rider.name}'s details`}
                                        >
                                            <FaEye /> View
                                        </button>
                                    </td>

                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                disabled={processingId !== null}
                                                onClick={() => handleDecision(rider, "active", rider.email)}
                                                title="Accept application"
                                            >
                                                <FaCheck />
                                            </button>

                                            <button
                                                className="btn btn-error btn-sm"
                                                disabled={processingId !== null}
                                                onClick={() => handleDecision(rider, "rejected", rider.email)}
                                                title="Reject application"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rider details modal */}
            {selectedRider && (
                <dialog className="modal modal-open" open>
                    <div className="modal-box max-w-3xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    Rider Application Details
                                </h3>
                                <p className="text-base-content/60 mt-1">
                                    Review the full application before making a decision.
                                </p>
                            </div>

                            <button
                                className="btn btn-circle btn-ghost btn-sm"
                                onClick={() => setSelectedRider(null)}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-5">
                            <div className="badge badge-warning mb-3">
                                {selectedRider.status || "pending"}
                            </div>

                            <h4 className="font-bold text-lg">Personal Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <Detail label="Full Name" value={selectedRider.name} />
                                <Detail label="Email" value={selectedRider.email} />
                                <Detail label="Age" value={selectedRider.age} />
                                <Detail label="Phone" value={selectedRider.phone} />
                                <Detail label="National ID Number" value={selectedRider.nid} />
                                <Detail
                                    label="Emergency Contact"
                                    value={selectedRider.emergencyContact}
                                />
                            </div>

                            <h4 className="font-bold text-lg mt-5">
                                Service Area & Address
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <Detail label="Region" value={selectedRider.region} />
                                <Detail label="District" value={selectedRider.district} />
                                <div className="sm:col-span-2">
                                    <Detail
                                        label="Current Address"
                                        value={selectedRider.address}
                                    />
                                </div>
                            </div>

                            <h4 className="font-bold text-lg mt-5">Bike Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <Detail label="Bike Brand" value={selectedRider.bikeBrand} />
                                <Detail
                                    label="Registration Number"
                                    value={selectedRider.bikeRegistrationNumber}
                                />
                                <Detail
                                    label="Delivery Experience"
                                    value={selectedRider.experience}
                                />
                                <Detail
                                    label="Application Date"
                                    value={
                                        selectedRider.appliedAt
                                            ? new Date(selectedRider.appliedAt).toLocaleString()
                                            : "Not provided"
                                    }
                                />
                            </div>
                        </div>

                        <div className="modal-action flex-wrap">
                            <button
                                className="btn"
                                disabled={processingId !== null}
                                onClick={() => setSelectedRider(null)}
                            >
                                Close
                            </button>

                            <button
                                className="btn btn-error"
                                disabled={processingId !== null}
                                onClick={() =>
                                    handleDecision(selectedRider, "rejected")
                                }
                            >
                                <FaTimes />
                                Reject Application
                            </button>

                            <button
                                className="btn btn-success"
                                disabled={processingId !== null}
                                onClick={() => handleDecision(selectedRider, "active")}
                            >
                                <FaCheck />
                                {processingId === selectedRider._id
                                    ? "Processing..."
                                    : "Accept Rider"}
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                        onSubmit={(event) => {
                            event.preventDefault();
                            setSelectedRider(null);
                        }}
                    >
                        <button type="submit">close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default PendingRiders;
