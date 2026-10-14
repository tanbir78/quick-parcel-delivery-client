import { useState } from "react";
import useTracking from "./UseTracking";

const UpdateTracking = () => {
    const { updateTracking, isUpdating, error } = useTracking();

    const [trackingId, setTrackingId] = useState("");
    const [status, setStatus] = useState("in_transit");
    const [note, setNote] = useState("");
    const [location, setLocation] = useState("");

    const handleUpdateTracking = async (e) => {
        e.preventDefault();

        try {
            await updateTracking({
                trackingId,
                status,
                note,
                location,
            });

            alert("Tracking updated successfully!");

            setNote("");
            setLocation("");
        } catch (err) {
            console.error("Tracking update failed:", err);
        }
    };

    return (
        <div className="mx-auto max-w-xl p-4">
            <h2 className="mb-5 text-2xl font-bold">
                Update Parcel Tracking
            </h2>

            <form
                onSubmit={handleUpdateTracking}
                className="space-y-4"
            >
                <div>
                    <label className="mb-1 block font-medium">
                        Tracking ID
                    </label>

                    <input
                        className="input input-bordered w-full"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter tracking ID"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Status
                    </label>

                    <select
                        className="select select-bordered w-full"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="in_transit">In Transit</option>
                        <option value="arrived_at_hub">Arrived at Hub</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Note
                    </label>

                    <input
                        className="input input-bordered w-full"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Parcel dispatched from warehouse"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Location
                    </label>

                    <input
                        className="input input-bordered w-full"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Dhaka Warehouse"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Update Tracking"}
                </button>

                {error && (
                    <p className="text-error">{error}</p>
                )}
            </form>
        </div>
    );
};

export default UpdateTracking;
