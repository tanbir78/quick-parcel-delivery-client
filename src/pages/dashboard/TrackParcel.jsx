
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";


const TrackParcel = () => {
    const axiosSecure = UseAxiosSecure();
    const [trackingId, setTrackingId] = useState("");
    const [activeId, setActiveId] = useState("");

    const {
        data: result,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["tracking", activeId],
        enabled: Boolean(activeId),
        queryFn: async () => {
            const response = await axiosSecure.get(
                `/tracking/${encodeURIComponent(activeId)}`
            );
            return response.data;
        },
        retry: false,
    });

    const parcel = result?.data?.parcel;
    const updates = result?.data?.trackingUpdates || [];

    const handleSearch = (e) => {
        e.preventDefault();

        const id = trackingId.trim();
        if (!id) return;

        setActiveId(id);
    };

    return (
        <div className="mx-auto max-w-3xl p-4">
            <h2 className="mb-2 text-2xl font-bold">
                Track Your Parcel
            </h2>

            <p className="mb-5 text-gray-500">
                Enter your tracking ID to check parcel status.
            </p>

            <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-col gap-3 sm:flex-row"
            >
                <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID"
                    className="input input-bordered w-full"
                    required
                />

                <button type="submit" className="btn btn-primary">
                    Search
                </button>
            </form>

            {isLoading && (
                <p className="py-4">Loading tracking history...</p>
            )}

            {isError && (
                <p className="text-error">
                    {error?.response?.data?.message ||
                        "Failed to load tracking information."}
                </p>
            )}

            {parcel && (
                <div className="mb-6 rounded-xl border p-4">
                    <h3 className="text-lg font-bold">
                        {parcel.parcelTitle || "Parcel Details"}
                    </h3>

                    <p>
                        Tracking ID: <strong>{parcel.trackingId}</strong>
                    </p>

                    <p>
                        Current status:{" "}
                        <strong>{parcel.status.replaceAll("_", " ")}</strong>
                    </p>

                    <p>From: {parcel.senderRegion || "N/A"}</p>
                    <p>To: {parcel.receiverRegion || "N/A"}</p>
                </div>
            )}

            {parcel && (
                <div>
                    <h3 className="mb-4 text-xl font-bold">
                        Tracking History
                    </h3>

                    {updates.length === 0 ? (
                        <p>No tracking updates available.</p>
                    ) : (
                        <ul className="timeline timeline-vertical timeline-compact">
                            {updates.map((item, index) => (
                                <li key={item._id || `${item.timestamp}-${index}`}>
                                    {index > 0 && (
                                        <hr className="bg-primary" />
                                    )}

                                    <div className="timeline-middle">
                                        <span className="text-primary">●</span>
                                    </div>

                                    <div className="timeline-end mb-5 rounded-lg border p-4">
                                        <p className="font-bold capitalize">
                                            {item.status.replaceAll("_", " ")}
                                        </p>

                                        <p>{item.note}</p>

                                        {item.location && (
                                            <p className="text-sm text-gray-500">
                                                Location: {item.location}
                                            </p>
                                        )}

                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>

                                    {index < updates.length - 1 && (
                                        <hr className="bg-base-300" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackParcel;
