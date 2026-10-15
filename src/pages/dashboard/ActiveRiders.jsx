
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    FaMotorcycle,
    FaBan,
    FaSearch,
    FaSyncAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";

const ActiveRiders = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState("");

    // Fetch active riders using TanStack Query
    const {
        data: riders = [],
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["riders", "active"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/riderApplications?status=active"
            );
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // Deactivate rider mutation
    const deactivateMutation = useMutation({
        mutationFn: async (riderId) => {
            const res = await axiosSecure.patch(
                `/riderApplications/${riderId}/status`,
                { status: "inactive" }
            );
            return res.data;
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["riders"],
            });

            Swal.fire({
                icon: "success",
                title: "Rider Deactivated",
                text: "The rider is now inactive.",
            });
        },

        onError: (error) => {
            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "Failed to deactivate rider.",
                "error"
            );
        },
    });

    // Search by rider name
    const filteredRiders = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        if (!query) return riders;

        return riders.filter((rider) =>
            (rider.name || "").toLowerCase().includes(query)
        );
    }, [riders, searchText]);

    const handleDeactivate = async (rider) => {
        const confirmation = await Swal.fire({
            title: "Deactivate Rider?",
            text: `Are you sure you want to deactivate ${rider.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Deactivate",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc2626",
        });

        if (confirmation.isConfirmed) {
            deactivateMutation.mutate(rider._id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <span>Failed to load active riders.</span>
                <button className="btn btn-sm" onClick={() => refetch()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaMotorcycle className="text-success" />
                        Active Riders
                    </h2>
                    <p className="text-base-content/70 mt-1">
                        Search and manage active delivery riders.
                    </p>
                </div>

                <button
                    className="btn btn-outline btn-sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    <FaSyncAlt />
                    {isFetching ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
                <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                    <FaSearch className="text-base-content/50" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search rider by name..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setSearchText("")}
                        >
                            Clear
                        </button>
                    )}
                </label>

                <div className="badge badge-success badge-lg">
                    Showing {filteredRiders.length} of {riders.length}
                </div>
            </div>

            {/* Table */}
            {filteredRiders.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <FaMotorcycle className="text-4xl text-base-content/40" />
                        <h3 className="text-xl font-semibold">
                            {searchText ? "No Matching Riders" : "No Active Riders"}
                        </h3>
                        <p className="text-base-content/60">
                            {searchText
                                ? "Try another rider name."
                                : "There are currently no active riders."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Rider Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>District</th>
                                <th>Bike</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRiders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td className="font-semibold">{rider.name || "N/A"}</td>
                                    <td>{rider.email || "N/A"}</td>
                                    <td>{rider.phone || "N/A"}</td>
                                    <td>{rider.region || "N/A"}</td>
                                    <td>{rider.district || "N/A"}</td>
                                    <td>
                                        <div>{rider.bikeBrand || "N/A"}</div>
                                        <div className="text-xs text-base-content/60">
                                            {rider.bikeRegistrationNumber || ""}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">Active</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-error btn-sm"
                                            disabled={deactivateMutation.isPending}
                                            onClick={() => handleDeactivate(rider)}
                                        >
                                            <FaBan />
                                            {deactivateMutation.isPending
                                                ? "Processing..."
                                                : "Deactivate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;
