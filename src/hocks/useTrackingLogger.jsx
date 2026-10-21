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
        riderName,
        riderEmail,
        riderPhone,
        location,
    }) => {
        setLoading(true);

        try {
            const { data } = await axiosSecure.post("/tracking", {
                parcelId,
                trackingId,
                status,
                title,
                description,
                actorRole,
                riderName,
                riderEmail,
                riderPhone,
                location,
            });

            return data;
        } finally {
            setLoading(false);
        }
    };

    return { logTracking, loading };
};

export default useTrackingLogger;