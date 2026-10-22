import React, { useState } from "react";
import UseAuth from "../../hocks/UseAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import { FaCreditCard, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

// Reusable detail card
const Detail = ({ label, value }) => (
    <div className="rounded-xl bg-base-200/70 p-3 min-w-0">
        <p className="text-xs font-medium opacity-60 mb-1">
            {label}
        </p>

        <p className="text-sm font-semibold break-words">
            {value ?? "N/A"}
        </p>
    </div>
);

// Format date
const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString();
};

const MyParcels = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedParcel, setSelectedParcel] = useState(null);

    const {
        data: parcels = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["my-parcels", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/parcels?email=${encodeURIComponent(user.email)}`
            );

            return res.data.data;
        },
    });

    // Pay parcel
    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`);
    };

    // Delete parcel
    const handleDelete = (parcel) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete "${parcel.parcelTitle}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                const res = await axiosSecure.delete(
                    `/parcels/${parcel._id}`
                );

                await queryClient.invalidateQueries({
                    queryKey: ["my-parcels", user?.email],
                });

                if (selectedParcel?._id === parcel._id) {
                    setSelectedParcel(null);
                }

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text:
                        res.data?.message ||
                        "Parcel deleted successfully.",
                    confirmButtonColor: "#063B3D",
                });
            } catch (error) {
                console.error("Delete failed:", error);

                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text:
                        error.response?.data?.message ||
                        "Could not delete the parcel.",
                    confirmButtonColor: "#063B3D",
                });
            }
        });
    };

    // Loading
    if (isLoading) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-teal-700" />
            </div>
        );
    }

    // Error
    if (isError) {
        return (
            <div className="p-6 text-center">
                <p className="text-error mb-3">
                    Failed to load your parcels.
                </p>

                <button
                    onClick={() => refetch()}
                    className="btn bg-teal-800 text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Page heading */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                        My Parcels
                    </h2>

                    <p className="text-sm opacity-60 mt-1">
                        Manage and track your parcels
                    </p>
                </div>

                <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                    <p className="text-xs opacity-60">
                        Total Parcels
                    </p>

                    <p className="text-2xl font-bold text-teal-700">
                        {parcels.length}
                    </p>
                </div>
            </div>

            {/* Parcels table */}
            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Parcel Type</th>
                            <th>Title</th>
                            <th>Created At</th>
                            <th>Cost</th>
                            <th>Payment Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-12 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl">
                                            📦
                                        </span>

                                        <p className="font-semibold">
                                            No parcels found
                                        </p>

                                        <p className="text-sm opacity-60">
                                            Your parcels will appear here.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>

                                    <td>
                                        {parcel.parcelType === "document" ? (
                                            <span className="badge badge-info">
                                                Document
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">
                                                Non-document
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <p className="font-semibold">
                                            {parcel.parcelTitle}
                                        </p>

                                        <p className="text-xs opacity-60 mt-1">
                                            {parcel.trackingId}
                                        </p>
                                    </td>

                                    <td>
                                        {formatDate(parcel.createdAt)}
                                    </td>

                                    <td className="font-semibold whitespace-nowrap">
                                        ৳ {parcel.deliveryCost}
                                    </td>

                                    <td>
                                        {parcel.paymentStatus === "paid" ? (
                                            <span className="badge badge-success">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="badge badge-error">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="btn btn-sm btn-info btn-outline"
                                                onClick={() =>
                                                    setSelectedParcel(parcel)
                                                }
                                                title="View parcel details"
                                            >
                                                <FaEye />
                                                View
                                            </button>

                                            {parcel.paymentStatus !== "paid" && (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        handlePay(parcel._id)
                                                    }
                                                    title="Pay for parcel"
                                                >
                                                    <FaCreditCard />
                                                    Pay
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-sm btn-error btn-outline"
                                                onClick={() =>
                                                    handleDelete(parcel)
                                                }
                                                title="Delete parcel"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {selectedParcel && (
                <div
                    className="modal modal-open z-50"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedParcel(null);
                        }
                    }}
                >
                    <div className="modal-box max-w-3xl w-11/12 p-0 overflow-hidden rounded-2xl shadow-2xl">
                        {/* Modal header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-600 p-6 md:p-8 text-white">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

                            <div className="absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-white/10" />

                            <div className="relative flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="rounded-lg bg-white/15 p-2 text-xl">
                                            📦
                                        </span>

                                        <span className="text-xs font-semibold tracking-[0.2em] text-teal-100">
                                            PARCEL DETAILS
                                        </span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold break-words">
                                        {selectedParcel.parcelTitle}
                                    </h2>

                                    <p className="mt-2 text-sm text-teal-100 break-all">
                                        Tracking ID: {selectedParcel.trackingId || "N/A"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedParcel(null)}
                                    className="btn btn-sm btn-circle border-0 bg-white/15 text-white hover:bg-white/25"
                                    aria-label="Close parcel details"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="relative mt-5 flex flex-wrap gap-2">
                                <span className="badge border-0 bg-white/20 px-3 py-3 text-white capitalize">
                                    {selectedParcel.status || "Unknown"}
                                </span>

                                <span
                                    className={`badge border-0 px-3 py-3 capitalize ${
                                        selectedParcel.paymentStatus === "paid"
                                            ? "bg-emerald-300 text-emerald-950"
                                            : "bg-amber-300 text-amber-950"
                                    }`}
                                >
                                    {selectedParcel.paymentStatus || "Unknown"}
                                </span>
                            </div>
                        </div>

                        {/* Modal content */}
                        <div className="max-h-[65vh] space-y-6 overflow-y-auto p-5 md:p-7">
                            {/* Parcel information */}
                            <section>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-xl bg-teal-100 p-3 text-xl">
                                        📦
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg">
                                            Parcel Information
                                        </h3>

                                        <p className="text-xs opacity-60">
                                            Basic details about your shipment
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Detail
                                        label="Parcel Type"
                                        value={selectedParcel.parcelType}
                                    />

                                    <Detail
                                        label="Weight"
                                        value={
                                            selectedParcel.weight != null
                                                ? `${selectedParcel.weight} kg`
                                                : "N/A"
                                        }
                                    />

                                    <Detail
                                        label="Delivery Cost"
                                        value={
                                            selectedParcel.deliveryCost != null
                                                ? `৳ ${selectedParcel.deliveryCost}`
                                                : "N/A"
                                        }
                                    />

                                    <Detail
                                        label="Payment Method"
                                        value={
                                            selectedParcel.paymentMethod ||
                                            "Not selected"
                                        }
                                    />

                                    <Detail
                                        label="Created At"
                                        value={formatDate(selectedParcel.createdAt)}
                                    />

                                    <Detail
                                        label="Last Updated"
                                        value={formatDate(selectedParcel.updatedAt)}
                                    />
                                </div>
                            </section>

                            <div className="divider my-0" />

                            {/* Sender and receiver */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sender */}
                                <section className="min-w-0">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-xl bg-sky-100 p-3 text-xl">
                                            🧑
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg">
                                                Sender Details
                                            </h3>

                                            <p className="text-xs opacity-60">
                                                Pickup information
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Detail
                                            label="Name"
                                            value={selectedParcel.senderName}
                                        />

                                        <Detail
                                            label="Email"
                                            value={selectedParcel.createdByEmail}
                                        />

                                        <Detail
                                            label="Contact"
                                            value={selectedParcel.senderContact}
                                        />

                                        <Detail
                                            label="Region"
                                            value={selectedParcel.senderRegion}
                                        />

                                        <Detail
                                            label="Service Center"
                                            value={selectedParcel.senderServiceCenter}
                                        />

                                        <Detail
                                            label="Address"
                                            value={selectedParcel.senderAddress}
                                        />

                                        <Detail
                                            label="Pickup Instruction"
                                            value={selectedParcel.pickupInstruction}
                                        />
                                    </div>
                                </section>

                                {/* Receiver */}
                                <section className="min-w-0">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-xl bg-emerald-100 p-3 text-xl">
                                            📍
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg">
                                                Receiver Details
                                            </h3>

                                            <p className="text-xs opacity-60">
                                                Delivery information
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Detail
                                            label="Name"
                                            value={selectedParcel.receiverName}
                                        />

                                        <Detail
                                            label="Contact"
                                            value={selectedParcel.receiverContact}
                                        />

                                        <Detail
                                            label="Region"
                                            value={selectedParcel.receiverRegion}
                                        />

                                        <Detail
                                            label="Service Center"
                                            value={selectedParcel.receiverServiceCenter}
                                        />

                                        <Detail
                                            label="Address"
                                            value={selectedParcel.receiverAddress}
                                        />

                                        <Detail
                                            label="Delivery Instruction"
                                            value={selectedParcel.deliveryInstruction}
                                        />
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex justify-end border-t border-base-300 bg-base-200/50 p-4 md:px-7">
                            <button
                                onClick={() => setSelectedParcel(null)}
                                className="btn border-0 bg-teal-800 px-6 text-white hover:bg-teal-900"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyParcels;