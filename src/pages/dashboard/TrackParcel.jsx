import { useState } from "react";
import {
  FaBox,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";

const TrackParcel = () => {
  const axiosSecure = UseAxiosSecure();

  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      setError("Please enter a tracking ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axiosSecure.get(
        `/tracking/${trackingId.trim()}`
      );

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError("Parcel not found.");
      }
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "Parcel not found. Please check your tracking ID."
          : "Unable to track parcel. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const parcel = result?.parcel;
  const updates = result?.trackingHistory || [];

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status) => {
    const value = (status || "").toLowerCase();

    if (value.includes("delivered")) {
      return "text-green-600";
    }

    if (
      value.includes("picked") ||
      value.includes("transit") ||
      value.includes("assigned")
    ) {
      return "text-blue-600";
    }

    return "text-orange-500";
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <FaBox className="mx-auto mb-3 text-5xl text-primary" />

          <h1 className="text-3xl font-bold">
            Track Your Parcel
          </h1>

          <p className="mt-2 text-base-content/70">
            Enter your tracking ID to see parcel progress and rider details.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleTrack}
          className="mb-8 flex flex-col gap-3 rounded-xl bg-base-100 p-5 shadow sm:flex-row"
        >
          <input
            type="text"
            placeholder="Enter tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            <FaSearch />
            {loading ? "Tracking..." : "Track Parcel"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {parcel && (
          <div className="space-y-6">

            {/* Parcel Information */}
            <div className="rounded-xl bg-base-100 p-6 shadow">
              <h2 className="mb-5 text-xl font-bold">
                Parcel Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-base-content/60">
                    Tracking ID
                  </p>
                  <p className="font-semibold">
                    {parcel.trackingId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-base-content/60">
                    Parcel Title
                  </p>
                  <p className="font-semibold">
                    {parcel.parcelTitle || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-base-content/60">
                    Parcel Type
                  </p>
                  <p className="font-semibold">
                    {parcel.parcelType || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-base-content/60">
                    Payment Status
                  </p>
                  <p className="font-semibold">
                    {parcel.paymentStatus || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-base-content/60">
                    Delivery Status
                  </p>
                  <p
                    className={`font-semibold ${getStatusColor(
                      parcel.delivery_status || parcel.status
                    )}`}
                  >
                    {parcel.delivery_status ||
                      parcel.status ||
                      "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sender and Receiver */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-base-100 p-6 shadow">
                <h3 className="mb-3 font-bold">Sender Location</h3>

                <p>
                  <FaMapMarkerAlt className="mr-2 inline text-primary" />
                  {parcel.senderServiceCenter || "N/A"},{" "}
                  {parcel.senderRegion || "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-base-100 p-6 shadow">
                <h3 className="mb-3 font-bold">Receiver Location</h3>

                <p>
                  <FaMapMarkerAlt className="mr-2 inline text-primary" />
                  {parcel.receiverServiceCenter || "N/A"},{" "}
                  {parcel.receiverRegion || "N/A"}
                </p>
              </div>
            </div>

            {/* Rider Details */}
            {/* <div className="rounded-xl bg-base-100 p-6 shadow">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
                <FaMotorcycle className="text-primary" />
                Rider Information
              </h2>

              {(() => {
                const assignedEvent = [...updates]
                  .reverse()
                  .find(
                    (item) =>
                      item.status === "assigned" ||
                      item.riderName ||
                      item.riderEmail ||
                      item.riderPhone
                  );

                const riderName =
                  assignedEvent?.riderName ||
                  parcel.assignedRiderName;

                const riderEmail =
                  assignedEvent?.riderEmail ||
                  parcel.assignedRiderEmail;

                const riderPhone =
                  assignedEvent?.riderPhone ||
                  parcel.assignedRiderPhone;

                const riderLocation =
                  assignedEvent?.location ||
                  parcel.riderLocation;

                if (
                  !riderName &&
                  !riderEmail &&
                  !riderPhone &&
                  !riderLocation
                ) {
                  return (
                    <p className="text-base-content/60">
                      No rider has been assigned yet.
                    </p>
                  );
                }

                return (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-base-content/60">
                        Rider Name
                      </p>
                      <p className="font-semibold">
                        <FaUser className="mr-2 inline text-primary" />
                        {riderName || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-base-content/60">
                        Rider Email
                      </p>
                      <p className="break-all font-semibold">
                        <FaEnvelope className="mr-2 inline text-primary" />
                        {riderEmail || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-base-content/60">
                        Rider Phone
                      </p>
                      <p className="font-semibold">
                        <FaPhone className="mr-2 inline text-primary" />
                        {riderPhone || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-base-content/60">
                        Rider Location
                      </p>
                      <p className="font-semibold">
                        <FaMapMarkerAlt className="mr-2 inline text-primary" />
                        {riderLocation || "Not available"}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div> */}

            {/* Tracking Timeline */}
            <div className="rounded-xl bg-base-100 p-6 shadow">
              <h2 className="mb-6 text-xl font-bold">
                Tracking History
              </h2>

              {updates.length === 0 ? (
                <p className="text-base-content/60">
                  No tracking history available yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {updates.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="relative flex gap-4"
                    >
                      {index !== updates.length - 1 && (
                        <div className="absolute left-[15px] top-9 h-full w-0.5 bg-base-300" />
                      )}

                      <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content">
                        {item.status === "delivered" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaBox />
                        )}
                      </div>

                      <div className="flex-1 rounded-lg border border-base-300 p-4">
                        <h3 className="font-bold">
                          {item.title || item.status || "Parcel Update"}
                        </h3>

                        <p className="mt-1 text-sm text-base-content/70">
                          {item.description || "Status updated."}
                        </p>

                        <p className="mt-2 text-xs text-base-content/60">
                          <FaClock className="mr-1 inline" />
                          {formatDate(item.createdAt)}
                        </p>

                        {item.location && (
                          <p className="mt-2 text-sm">
                            <FaMapMarkerAlt className="mr-2 inline text-primary" />
                            {item.location}
                          </p>
                        )}

                        {(item.riderName ||
                          item.riderEmail ||
                          item.riderPhone) && (
                          <div className="mt-3 space-y-2 border-t border-base-300 pt-3 text-sm">
                            {item.riderName && (
                              <p>
                                <FaUser className="mr-2 inline text-primary" />
                                {item.riderName}
                              </p>
                            )}

                            {item.riderEmail && (
                              <p className="break-all">
                                <FaEnvelope className="mr-2 inline text-primary" />
                                {item.riderEmail}
                              </p>
                            )}

                            {item.riderPhone && (
                              <p>
                                <FaPhone className="mr-2 inline text-primary" />
                                {item.riderPhone}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackParcel;