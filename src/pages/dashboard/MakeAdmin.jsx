
import { useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";

const MakeAdmin = () => {
    const axiosSecure = UseAxiosSecure();

    const [searchEmail, setSearchEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        const email = searchEmail.trim();

        // if (email.length < 3) {
        //     setError("Enter at least 3 characters to search.");
        //     setUsers([]);
        //     setSearched(false);
        //     return;
        // }

        try {
            setLoading(true);
            setError("");
            setSearched(false);

            const response = await axiosSecure.get(
                `/users/search?email=${encodeURIComponent(email)}`
            );

            setUsers(Array.isArray(response.data) ? response.data : []);
            setSearched(true);
        } catch (err) {
            setUsers([]);
            setError(
                err.response?.data?.message ||
                "Failed to search users. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (user) => {
        const makeAdmin = user.role !== "admin";
        const newRole = makeAdmin ? "admin" : "user";

        const confirmation = await Swal.fire({
            title: makeAdmin ? "Make this user an Admin?" : "Remove Admin role?",
            text: `${user.email} will have the role "${newRole}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: makeAdmin ? "Yes, make Admin" : "Yes, remove Admin",
            cancelButtonText: "Cancel",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setUpdatingId(user._id);

            await axiosSecure.patch(`/users/${user._id}/role`, {
                role: newRole,
            });

            setUsers((previousUsers) =>
                previousUsers.map((item) =>
                    item._id === user._id
                        ? { ...item, role: newRole }
                        : item
                )
            );

            await Swal.fire({
                icon: "success",
                title: "Role Updated",
                text: `${user.email} is now ${newRole}.`,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    err.response?.data?.message ||
                    "Could not update the user's role.",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                    Manage Users
                </h2>
                <p className="text-base-content/70 mt-2">
                    Search for a user by email and manage their role.
                </p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <input
                            type="text"
                            placeholder="Enter user email..."
                            className="input input-bordered w-full"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {error && (
                        <p className="text-error mt-3">{error}</p>
                    )}

                    {loading && (
                        <p className="text-center py-6">
                            Searching users...
                        </p>
                    )}

                    {!loading && searched && users.length === 0 && (
                        <p className="text-center py-6 text-base-content/70">
                            No users found.
                        </p>
                    )}

                    {!loading && users.length > 0 && (
                        <div className="overflow-x-auto mt-5">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Created At</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.email}</td>

                                            <td>
                                                {user.created_at
                                                    ? new Date(
                                                          user.created_at
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        user.role === "admin"
                                                            ? "badge-success"
                                                            : "badge-ghost"
                                                    }`}
                                                >
                                                    {user.role || "user"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${
                                                        user.role === "admin"
                                                            ? "btn-error"
                                                            : "btn-primary"
                                                    }`}
                                                    disabled={
                                                        updatingId !== null
                                                    }
                                                    onClick={() =>
                                                        handleRoleChange(user)
                                                    }
                                                >
                                                    {updatingId === user._id
                                                        ? "Updating..."
                                                        : user.role === "admin"
                                                          ? "Remove Admin"
                                                          : "Make Admin"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MakeAdmin;
