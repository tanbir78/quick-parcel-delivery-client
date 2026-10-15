import React from "react";
import UseAuth from "../../hocks/UseAuth";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import { FaCreditCard, FaEye, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // const { data: parcels = [], // isLoading, // isError,
    // } = useQuery({
    //     queryKey: ["my-parcels", user?.email],
    //     enabled: !!user?.email,
    //     queryFn: async () => {
    //         // Get all parcels
    //         const res = await axiosSecure.get("/parcels");

    //         console.log("Logged in user:", user.email);
    //         console.log("All parcels:", res.data);

    //         // Get only current user's parcels
    //         const myParcels = res.data.data.filter(
    //             (parcel) => parcel.createdByEmail === user.email
    //         );

    //         console.log("My parcels:", myParcels);

    //         return myParcels;
    //     },
    // });

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    // if (isError) {
    //     return <div>Failed to load parcels.</div>;
    // }
    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`,);
            return res.data.data;
        }
    })

    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`);
    }

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

                console.log("Delete response:", res.data);

                // list refresh
                await queryClient.invalidateQueries({
                    queryKey: ["my-parcels", user?.email],
                });

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Parcel deleted successfully.",
                    confirmButtonColor: "#063B3D",
                });
            } catch (error) {
                console.error("Delete failed:", error);
                console.error("Server response:", error.response?.data);

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

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                    My Parcels
                </h2>

                <p className="text-sm opacity-60 mt-1">
                    Total parcels: {parcels.length}
                </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
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
                        {parcels.map((parcel, index) => (
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

                                {/* title */}
                                <td>
                                    <p className="font-semibold">
                                        {parcel.parcelTitle}
                                    </p>
                                </td>

                                <td>
                                    {new Date(
                                        parcel.createdAt
                                    ).toLocaleString()}
                                </td>

                                <td className="font-semibold">
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
                                                console.log("View", parcel)
                                            }
                                        >
                                            <FaEye />
                                            View
                                        </button>

                                        {parcel.paymentStatus !== "paid" && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handlePay(parcel._id)
                                                }
                                            >
                                                <FaCreditCard />
                                                Pay
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-sm btn-error btn-outline"
                                            onClick={() => handleDelete(parcel)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyParcels;