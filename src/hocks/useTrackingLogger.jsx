import { useState } from "react";
import useAxiosSecure from "./UseAxiosSecure";

const useTrackingLogger = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const logTracking = async ({
        parcelId,
        trackingId,
        status,
        title,
        description,
        actorRole = "system",
    }) => {
        setLoading(true);

        try {
            const response = await axiosSecure.post("/tracking", {
                parcelId,
                trackingId,
                status,
                title,
                description,
                actorRole,
            });

            return response.data;
        } finally {
            setLoading(false);
        }
    };

    return { logTracking, loading };
};

export default useTrackingLogger;