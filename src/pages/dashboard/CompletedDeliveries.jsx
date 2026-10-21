
import { useCallback, useEffect, useState } from "react";
import {
    FaBox,
    FaCheckCircle,
    FaClock,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaPhone,
    FaWallet,
} from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";

const CompletedDeliveries = () => {
    const axiosSecure = UseAxiosSecure();

    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cashoutId, setCashoutId] = useState(null);

    const fetchCompletedDeliveries = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axiosSecure.get(
                "/rider/completed-deliveries"
            );

            setParcels(
                Array.isArray(res.data) ? res.data : []
            );
        } catch (error) {
            console.error(error);

            Swal.fire(
                "Error",
                error.response?.data?.message ||
                "Failed to load completed deliveries.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        fetchCompletedDeliveries();
    }, [fetchCompletedDeliveries]);

    const formatMoney = (amount) =>
        `৳${Number(amount || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const formatDate = (date) => {
        if (!date) return "Not recorded";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "Not recorded";
        }

        return parsed.toLocaleString("en-BD", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const handleCashout = async (parcel) => {
        const amount = Number(parcel.riderEarning) || 0;

        if (amount <= 0) {
            await Swal.fire(
                "Unavailable",
                "No valid earning is available for this delivery.",
                "warning"
            );
            return;
        }

        const confirmation = await Swal.fire({
            title: "Request Cash Out?",
            html: `
                <p>Tracking ID: <b>${parcel.trackingId || "N/A"}</b></p>
                <p>Rider earning: <b>${formatMoney(amount)}</b></p>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Submit Request",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#16a34a",
        });

        if (!confirmation.isConfirmed) return;

        try {
            setCashoutId(parcel._id);

            const res = await axiosSecure.post(
                `/rider/cashout/${parcel._id}`
            );

            await fetchCompletedDeliveries();

            await Swal.fire(
                "Request Submitted",
                res.data?.message ||
                "Your cash-out request has been submitted.",
                "success"
            );
        } catch (error) {
            console.error("Cash-out error:", error);

            await Swal.fire(
                "Cash Out Failed",
                error.response?.data?.message ||
                "Could not submit the cash-out request.",
                "error"
            );

            await fetchCompletedDeliveries();
        } finally {
            setCashoutId(null);
        }
    };

    const totalEarnings = parcels.reduce(
        (sum, parcel) =>
            sum + (Number(parcel.riderEarning) || 0),
        0
    );

    const availableEarnings = parcels.reduce(
        (sum, parcel) =>
            sum +
            (parcel.cashoutStatus === "available"
                ? Number(parcel.riderEarning) || 0
                : 0),
        0
    );

    const requestedEarnings = parcels.reduce(
        (sum, parcel) =>
            sum +
            (parcel.cashoutStatus === "requested"
                ? Number(parcel.riderEarning) || 0
                : 0),
        0
    );

    const paidEarnings = parcels.reduce(
        (sum, parcel) =>
            sum +
            (parcel.cashoutStatus === "paid"
                ? Number(parcel.riderEarning) || 0
                : 0),
        0
    );

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    <FaCheckCircle className="text-success" />
                    Completed Deliveries
                </h2>

                <p className="text-base-content/70 mt-2">
                    Delivery history and timestamps.
                </p>
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Completed Parcels"
                    value={parcels.length}
                    icon={<FaBox />}
                />

                <SummaryCard
                    title="Total Earnings"
                    value={formatMoney(totalEarnings)}
                    icon={<FaMoneyBillWave />}
                />

                <SummaryCard
                    title="Available to Cash Out"
                    value={formatMoney(availableEarnings)}
                    icon={<FaWallet />}
                />

                <SummaryCard
                    title="Requested / Paid"
                    value={`${formatMoney(requestedEarnings)} / ${formatMoney(paidEarnings)}`}
                    icon={<FaCheckCircle />}
                />
            </div> */}

            {parcels.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center py-12">
                        <FaBox className="text-5xl text-base-content/40" />

                        <h3 className="text-xl font-semibold mt-3">
                            No Completed Deliveries
                        </h3>

                        <p className="text-base-content/60">
                            Your delivery history will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Parcel</th>
                                <th>Receiver</th>
                                <th>Route</th>
                                <th>Picked Up</th>
                                <th>Delivered</th>
                                <th>Status</th>
                                <th>Fee</th>
                                <th>Earning</th>
                                <th>Cash Out</th>
                            </tr>
                        </thead>

                        <tbody>
                            {parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <div className="font-semibold">
                                            {parcel.parcelTitle ||
                                                parcel.parcelName ||
                                                "Parcel"}
                                        </div>

                                        <div className="text-xs font-mono text-base-content/60 mt-1">
                                            {parcel.trackingId ||
                                                String(parcel._id)}
                                        </div>

                                        <div className="text-xs text-base-content/60">
                                            {parcel.parcelType || "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="font-medium">
                                            {parcel.receiverName || "N/A"}
                                        </div>

                                        <div className="text-xs flex items-center gap-1 mt-1">
                                            <FaPhone />
                                            {parcel.receiverContact ||
                                                parcel.receiverPhone ||
                                                "N/A"}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex items-start gap-2">
                                            <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />

                                            <div>
                                                <div className="text-sm">
                                                    {parcel.senderRegion || "N/A"}
                                                </div>
                                                <div className="text-xs text-base-content/60">
                                                    {parcel.senderServiceCenter || ""}
                                                </div>

                                                <div className="text-xs my-1">↓</div>

                                                <div className="text-sm">
                                                    {parcel.receiverRegion || "N/A"}
                                                </div>
                                                <div className="text-xs text-base-content/60">
                                                    {parcel.receiverServiceCenter || ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="text-sm whitespace-nowrap">
                                        <FaClock className="inline mr-1 text-primary" />
                                        {formatDate(parcel.pickedUpAt)}
                                    </td>

                                    <td className="text-sm whitespace-nowrap">
                                        <FaClock className="inline mr-1 text-success" />
                                        {formatDate(
                                            parcel.deliveredAt ||
                                            parcel.updatedAt
                                        )}
                                    </td>

                                    <td>
                                        <span className="badge badge-success whitespace-nowrap">
                                            {String(parcel.delivery_status)
                                                .toLowerCase() ===
                                                "service center delivered"
                                                ? "Service Center Delivered"
                                                : "Delivered"}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap">
                                        {formatMoney(parcel.deliveryFee)}
                                    </td>

                                    <td>
                                        <div className="font-bold text-success whitespace-nowrap">
                                            {formatMoney(parcel.riderEarning)}
                                        </div>

                                        <div className="text-xs text-base-content/60">
                                            {parcel.earningPercentage ?? "—"}%
                                        </div>
                                    </td>

                                    <td>
                                        {parcel.cashoutStatus === "paid" ? (
                                            <span className="badge badge-success gap-1">
                                                <FaCheckCircle />
                                                Paid
                                            </span>
                                        ) : parcel.cashoutStatus === "requested" ? (
                                            <span className="badge badge-warning">
                                                Requested
                                            </span>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-sm whitespace-nowrap"
                                                disabled={cashoutId !== null}
                                                onClick={() =>
                                                    handleCashout(parcel)
                                                }
                                            >
                                                {cashoutId === parcel._id ? (
                                                    <span className="loading loading-spinner loading-xs" />
                                                ) : (
                                                    <FaWallet />
                                                )}
                                                Cash Out
                                            </button>
                                        )}
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

const SummaryCard = ({ title, value, icon }) => (
    <div className="card bg-base-100 shadow">
        <div className="card-body">
            <div className="flex justify-between items-center gap-3">
                <div>
                    <p className="text-sm text-base-content/60">{title}</p>
                    <h3 className="text-xl md:text-2xl font-bold mt-2">
                        {value}
                    </h3>
                </div>

                <div className="text-2xl text-primary">{icon}</div>
            </div>
        </div>
    </div>
);

export default CompletedDeliveries;
