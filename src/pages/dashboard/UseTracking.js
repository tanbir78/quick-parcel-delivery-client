import { useState } from "react";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";


const useTracking = () => {
    const axiosSecure = UseAxiosSecure();

    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    const updateTracking = async ({
        trackingId,
        status,
        note,
        location,
    }) => {
        setIsUpdating(true);
        setError("");

        try {
            const response = await axiosSecure.post("/tracking", {
                trackingId,
                status,
                note,
                location,
            });

            return response.data;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to update tracking";

            setError(message);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateTracking, isUpdating, error };
};

export default useTracking;
