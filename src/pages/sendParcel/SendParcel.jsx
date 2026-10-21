import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";

import warehousesData from "../../data/warehouses.json";
import UseAuth from "../../hocks/UseAuth";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import { useNavigate } from "react-router";
import useTrackingLogger from "../../hocks/useTrackingLogger";

const SendParcel = () => {
    const { user } = UseAuth();
    const { logTracking } = useTrackingLogger();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            parcelType: "",
            parcelTitle: "",
            weight: "",

            senderName: user?.displayName || "",
            senderContact: "",
            senderRegion: "",
            senderServiceCenter: "",
            senderAddress: "",
            pickupInstruction: "",

            receiverName: "",
            receiverContact: "",
            receiverRegion: "",
            receiverServiceCenter: "",
            receiverAddress: "",
            deliveryInstruction: "",
        },
    });

    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const parcelType = useWatch({
        control,
        name: "parcelType",
    });

    const senderRegion = useWatch({
        control,
        name: "senderRegion",
    });

    const receiverRegion = useWatch({
        control,
        name: "receiverRegion",
    });

    const regions = [
        ...new Set(
            warehousesData
                .filter((item) => item.status === "active")
                .map((item) => item.region)
        ),
    ];

    const senderCenters = senderRegion
        ? warehousesData
            .filter(
                (item) =>
                    item.status === "active" &&
                    item.region === senderRegion
            )
            .map((item) => item.district)
        : [];

    const receiverCenters = receiverRegion
        ? warehousesData
            .filter(
                (item) =>
                    item.status === "active" &&
                    item.region === receiverRegion
            )
            .map((item) => item.district)
        : [];

    // =========================================
    // GENERATE TRACKING ID
    // =========================================

    const generateTrackingId = () => {
        const datePart = new Date()
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "");

        const randomPart = Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();

        return `ZP${datePart}${randomPart}`;
    };

    // =========================================
    // DELIVERY COST
    // =========================================

    const calculateDeliveryCost = (data) => {
        let cost = 0;

        // -------------------------
        // DOCUMENT
        // -------------------------

        if (data.parcelType === "document") {
            cost = 60;
        }

        // -------------------------
        // NON-DOCUMENT
        // -------------------------

        if (data.parcelType === "non-document") {
            const weight = Number(data.weight) || 0;

            // Up to 1 KG
            cost = 80;

            // More than 1 KG
            if (weight > 1) {
                cost = 80 + (weight - 1) * 20;
            }
        }

        // -------------------------
        // DIFFERENT SERVICE CENTER
        // -------------------------

        if (
            data.senderServiceCenter !==
            data.receiverServiceCenter
        ) {
            cost += 30;
        }

        return Math.ceil(cost);
    };

    // =========================================
    // SUBMIT
    // =========================================

    const onSubmit = (data) => {
        // =====================================
        // DELIVERY COST
        // =====================================

        const deliveryCost = calculateDeliveryCost(data);

        // =====================================
        // PRICE BREAKDOWN
        // =====================================

        let baseCharge = 0;
        let weightCharge = 0;
        let serviceCenterCharge = 0;

        // Document
        if (data.parcelType === "document") {
            baseCharge = 60;
        }

        // Non-document
        if (data.parcelType === "non-document") {
            const weight = Number(data.weight) || 0;

            baseCharge = 80;

            if (weight > 1) {
                weightCharge = (weight - 1) * 20;
            }
        }

        // Different service center
        if (
            data.senderServiceCenter !==
            data.receiverServiceCenter
        ) {
            serviceCenterCharge = 30;
        }

        // =====================================
        // CREATE PARCEL DATA
        // =====================================

        const now = new Date().toISOString();

        const parcelData = {
            // =================================
            // PARCEL INFO
            // =================================

            parcelType: data.parcelType,

            parcelTitle: data.parcelTitle,

            weight:
                data.parcelType === "document"
                    ? 0
                    : Number(data.weight),

            // =================================
            // SENDER INFO
            // =================================

            senderName: data.senderName,

            senderContact: data.senderContact,

            senderRegion: data.senderRegion,

            senderServiceCenter:
                data.senderServiceCenter,

            senderAddress: data.senderAddress,

            pickupInstruction:
                data.pickupInstruction,

            // =================================
            // RECEIVER INFO
            // =================================

            receiverName: data.receiverName,

            receiverContact: data.receiverContact,

            receiverRegion: data.receiverRegion,

            receiverServiceCenter:
                data.receiverServiceCenter,

            receiverAddress: data.receiverAddress,

            deliveryInstruction:
                data.deliveryInstruction,

            // =================================
            // USER INFO
            // =================================

            createdByEmail: user?.email || "",

            // =================================
            // DELIVERY COST
            // =================================

            deliveryCost: deliveryCost,

            // =================================
            // TRACKING
            // =================================

            trackingId: generateTrackingId(),

            status: "pending",

            // =================================
            // PAYMENT
            // =================================

            paymentStatus: "unpaid",

            paymentMethod: null,

            // =================================
            // DATE & TIME
            // =================================

            createdAt: now,

            updatedAt: now,

            // =================================
            // TRACKING HISTORY
            // =================================

            trackingHistory: [
                {
                    status: "pending",
                    timestamp: now,
                    note: "Parcel created",
                },
            ],
        };


        Swal.fire({
            title: "Review Your Parcel",

            html: `
                <div style="
                    text-align: left;
                    margin-top: 15px;
                ">

                    <!-- ========================
                         PARCEL TYPE
                    ========================= -->

                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 8px 0;
                        font-size: 14px;
                    ">

                        <span style="
                            color: #6b7280;
                        ">
                            Parcel Type
                        </span>

                        <strong style="
                            color: #063B3D;
                        ">
                            ${data.parcelType === "document"
                    ? "Document"
                    : "Non-Document"
                }
                        </strong>

                    </div>


                    <!-- ========================
                         WEIGHT
                    ========================= -->

                    ${data.parcelType === "non-document"
                    ? `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 8px 0;
                                    font-size: 14px;
                                ">

                                    <span style="
                                        color: #6b7280;
                                    ">
                                        Parcel Weight
                                    </span>

                                    <strong style="
                                        color: #063B3D;
                                    ">
                                        ${Number(data.weight).toFixed(
                        2
                    )} KG
                                    </strong>

                                </div>
                            `
                    : ""
                }


                    <!-- ========================
                         BASE CHARGE
                    ========================= -->

                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 8px 0;
                        font-size: 14px;
                    ">

                        <span style="
                            color: #6b7280;
                        ">
                            ${data.parcelType === "document"
                    ? "Document Delivery"
                    : "Base Delivery Charge"
                }
                        </span>

                        <strong style="
                            color: #063B3D;
                        ">
                            ৳ ${baseCharge.toFixed(2)}
                        </strong>

                    </div>


                    <!-- ========================
                         WEIGHT CHARGE
                    ========================= -->

                    ${weightCharge > 0
                    ? `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 8px 0;
                                    font-size: 14px;
                                ">

                                    <span style="
                                        color: #6b7280;
                                    ">
                                        Extra Weight Charge
                                    </span>

                                    <strong style="
                                        color: #063B3D;
                                    ">
                                        ৳ ${weightCharge.toFixed(2)}
                                    </strong>

                                </div>
                            `
                    : ""
                }


                    <!-- ========================
                         SERVICE CENTER CHARGE
                    ========================= -->

                    ${serviceCenterCharge > 0
                    ? `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 8px 0;
                                    font-size: 14px;
                                ">

                                    <span style="
                                        color: #6b7280;
                                    ">
                                        Different Service Center
                                    </span>

                                    <strong style="
                                        color: #063B3D;
                                    ">
                                        ৳ ${serviceCenterCharge.toFixed(
                        2
                    )}
                                    </strong>

                                </div>
                            `
                    : ""
                }


                    <!-- ========================
                         DIVIDER
                    ========================= -->

                    <div style="
                        border-top: 1px solid #e5e7eb;
                        margin: 12px 0;
                    "></div>


                    <!-- ========================
                         TOTAL
                    ========================= -->

                    <div style="
                        background: #f0fbd2;
                        border: 2px solid #C6EF4A;
                        border-radius: 12px;
                        padding: 16px;
                        margin-top: 12px;
                    ">

                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            gap: 10px;
                        ">

                            <div>

                                <div style="
                                    font-size: 11px;
                                    color: #527052;
                                    margin-bottom: 3px;
                                    font-weight: 700;
                                    letter-spacing: 0.5px;
                                ">
                                    TOTAL DELIVERY COST
                                </div>

                                <div style="
                                    font-size: 15px;
                                    font-weight: 700;
                                    color: #063B3D;
                                ">
                                    Amount to Pay
                                </div>

                            </div>

                            <div style="
                                font-size: 28px;
                                font-weight: 800;
                                color: #063B3D;
                                white-space: nowrap;
                            ">
                                ৳ ${deliveryCost}
                            </div>

                        </div>

                    </div>


                    <!-- ========================
                         INFO
                    ========================= -->

                    <p style="
                        text-align: center;
                        font-size: 12px;
                        color: #9ca3af;
                        margin-top: 14px;
                        margin-bottom: 0;
                    ">
                        Please review the price before proceeding to payment.
                    </p>

                </div>
            `,

            // =================================
            // BUTTONS
            // =================================

            showCancelButton: true,

            confirmButtonText:
                "Proceed to Payment",

            cancelButtonText:
                "Go Back & Edit",

            // =================================
            // COLORS
            // =================================

            confirmButtonColor:
                "#C6EF4A",

            cancelButtonColor:
                "#ffffff",

            color:
                "#063B3D",

            background:
                "#ffffff",

            // =================================
            // SETTINGS
            // =================================

            reverseButtons: true,

            focusConfirm: false,

            allowOutsideClick: false,

            customClass: {
                popup:
                    "rounded-2xl",

                confirmButton:
                    "text-black font-semibold px-5 py-3",

                cancelButton:
                    "text-[#063B3D] font-semibold border border-gray-300 px-5 py-3",
            },

        }).then((result) => {

            // =================================
            // PROCEED TO PAYMENT
            // =================================

            if (result.isConfirmed) {

                console.log("Ready for payment:", parcelData);

                // save data to the server
                axiosSecure.post("/parcels", parcelData)

                    .then(async (res) => {
                        console.log("Parcel saved:", res.data);
                        //here you could redirect to a payment page 
                        if (res.data.insertedId) {
                            Swal.fire({
                                icon: "info",

                                title: "Proceeding to Payment",

                                html: `
                        <p style="
                            color: #6b7280;
                            font-size: 14px;
                        ">
                            Your total delivery cost is
                        </p>

                        <p style="
                            color: #063B3D;
                            font-size: 30px;
                            font-weight: 800;
                            margin-top: 8px;
                        ">
                            ৳ ${deliveryCost}
                        </p>
                    `,

                                confirmButtonText:
                                    "Continue",

                                confirmButtonColor:
                                    "#C6EF4A",

                                color:
                                    "#063B3D",

                                customClass: {
                                    confirmButton:
                                        "text-black font-semibold",
                                },
                            }).then(() => {

                                /*
                                 * Later, when you create
                                 * the payment page:
                                 *
                                 * navigate("/payment");
                                 *
                                 * For now we only log
                                 * the parcel data.
                                 */
                            });

                            // await logTracking({
                            //     parcelId: res.data.insertedId,
                            //     trackingId: parcelData.trackingId,
                            //     status: "submitted",
                            //     title: "Parcel Submitted",
                            //     description: "Your parcel has been successfully submitted.",
                            //     actorRole: "user",
                            // });

                            navigate("/dashboard/myParcels");
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "Failed to save parcel:",
                            error
                        );
                    });
            }

            // =================================
            // GO BACK & EDIT
            // =================================

            if (
                result.dismiss ===
                Swal.DismissReason.cancel
            ) {
                // Alert closes.
                // User returns to the form.
                // Existing form data remains available.
            }
        });
    };

    // =========================================
    // JSX
    // =========================================

    return (
        <section className="min-h-screen bg-base-200 py-10 md:py-16">

            <div className="max-w-6xl mx-auto px-4">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="mb-8">

                    <h1 className="text-3xl md:text-4xl font-bold text-[#063B3D]">
                        Send A Parcel
                    </h1>

                    <p className="mt-4 text-sm font-semibold text-[#063B3D]">
                        Enter your parcel details
                    </p>

                    <div className="border-b border-base-300 mt-4"></div>

                </div>


                {/* =================================
                    FORM
                ================================= */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                >

                    {/* =================================
                        PARCEL INFO
                    ================================= */}

                    <div className="bg-base-100 p-5 md:p-6 rounded-xl">

                        <h2 className="text-xl font-bold text-[#063B3D] mb-5">
                            Parcel Info
                        </h2>


                        {/* PARCEL TYPE */}

                        <div className="flex items-center gap-8 mb-5">

                            <label className="flex items-center gap-2 cursor-pointer">

                                <input
                                    type="radio"
                                    value="document"
                                    {...register("parcelType", {
                                        required:
                                            "Parcel type is required",
                                    })}
                                    className="radio radio-sm radio-success"
                                />

                                <span className="text-sm text-[#063B3D]">
                                    Document
                                </span>

                            </label>


                            <label className="flex items-center gap-2 cursor-pointer">

                                <input
                                    type="radio"
                                    value="non-document"
                                    {...register("parcelType", {
                                        required:
                                            "Parcel type is required",
                                    })}
                                    className="radio radio-sm radio-success"
                                />

                                <span className="text-sm text-[#063B3D]">
                                    Non-Document
                                </span>

                            </label>

                        </div>


                        {errors.parcelType && (
                            <p className="text-red-500 text-xs mb-3">
                                {errors.parcelType.message}
                            </p>
                        )}


                        {/* NAME + WEIGHT */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* PARCEL NAME */}

                            <div>

                                <label className="block text-sm font-medium text-[#063B3D] mb-2">
                                    Parcel Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Parcel Name"
                                    {...register("parcelTitle", {
                                        required:
                                            "Parcel name is required",
                                    })}
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        bg-white
                                    "
                                />

                                {errors.parcelTitle && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {
                                            errors.parcelTitle
                                                .message
                                        }
                                    </p>
                                )}

                            </div>


                            {/* WEIGHT */}

                            <div>

                                <label className="block text-sm font-medium text-[#063B3D] mb-2">
                                    Parcel Weight (KG)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Parcel Weight (KG)"
                                    disabled={
                                        parcelType ===
                                        "document"
                                    }
                                    {...register("weight", {
                                        validate: (value) => {

                                            if (
                                                parcelType ===
                                                "non-document" &&
                                                !value
                                            ) {
                                                return "Weight is required for non-document";
                                            }

                                            if (
                                                parcelType ===
                                                "non-document" &&
                                                Number(value) <= 0
                                            ) {
                                                return "Weight must be greater than 0";
                                            }

                                            return true;
                                        },
                                    })}
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        bg-white
                                        disabled:bg-gray-100
                                    "
                                />

                                {parcelType ===
                                    "document" && (
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            Weight is not required for documents.
                                        </p>
                                    )}

                                {errors.weight && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.weight.message}
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        SENDER + RECEIVER
                    ================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                        {/* =================================
                            SENDER INFO
                        ================================= */}

                        <div className="bg-base-100 rounded-xl p-5 md:p-6">

                            <h2 className="text-xl font-bold text-[#063B3D]">
                                Sender Info
                            </h2>

                            <p className="text-sm text-gray-500 mt-1 mb-5">
                                Enter the pickup information.
                            </p>


                            <div className="space-y-4">

                                {/* NAME */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Sender name"
                                        defaultValue={
                                            user?.displayName ||
                                            ""
                                        }
                                        {...register(
                                            "senderName",
                                            {
                                                required:
                                                    "Sender name is required",
                                            }
                                        )}
                                        className="input input-bordered w-full bg-white"
                                    />

                                    {errors.senderName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors.senderName
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* CONTACT */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Contact
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        {...register(
                                            "senderContact",
                                            {
                                                required:
                                                    "Sender contact is required",
                                            }
                                        )}
                                        className="input input-bordered w-full bg-white"
                                    />

                                    {errors.senderContact && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .senderContact
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* REGION */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Select Region
                                    </label>

                                    <select
                                        {...register(
                                            "senderRegion",
                                            {
                                                required:
                                                    "Sender region is required",

                                                onChange: () => {
                                                    setValue(
                                                        "senderServiceCenter",
                                                        ""
                                                    );
                                                },
                                            }
                                        )}
                                        className="select select-bordered w-full bg-white"
                                    >

                                        <option value="">
                                            Select region
                                        </option>

                                        {regions.map(
                                            (region) => (
                                                <option
                                                    key={
                                                        region
                                                    }
                                                    value={
                                                        region
                                                    }
                                                >
                                                    {region}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {errors.senderRegion && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .senderRegion
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* SERVICE CENTER */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Select Service Center
                                    </label>

                                    <select
                                        {...register(
                                            "senderServiceCenter",
                                            {
                                                required:
                                                    "Sender service center is required",
                                            }
                                        )}
                                        disabled={
                                            !senderRegion
                                        }
                                        className="select select-bordered w-full bg-white"
                                    >

                                        <option value="">
                                            {senderRegion
                                                ? "Select service center"
                                                : "Select region first"}
                                        </option>

                                        {senderCenters.map(
                                            (center) => (
                                                <option
                                                    key={
                                                        center
                                                    }
                                                    value={
                                                        center
                                                    }
                                                >
                                                    {center}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {errors.senderServiceCenter && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .senderServiceCenter
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* ADDRESS */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Address
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Enter pickup address"
                                        {...register(
                                            "senderAddress",
                                            {
                                                required:
                                                    "Sender address is required",
                                            }
                                        )}
                                        className="textarea textarea-bordered w-full bg-white"
                                    />

                                    {errors.senderAddress && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .senderAddress
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* PICKUP INSTRUCTION */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Pick up Instruction
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Enter pickup instruction"
                                        {...register(
                                            "pickupInstruction",
                                            {
                                                required:
                                                    "Pickup instruction is required",
                                            }
                                        )}
                                        className="textarea textarea-bordered w-full bg-white"
                                    />

                                    {errors.pickupInstruction && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .pickupInstruction
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            RECEIVER INFO
                        ================================= */}

                        <div className="bg-base-100 rounded-xl p-5 md:p-6">

                            <h2 className="text-xl font-bold text-[#063B3D]">
                                Receiver Info
                            </h2>

                            <p className="text-sm text-gray-500 mt-1 mb-5">
                                Enter the delivery information.
                            </p>


                            <div className="space-y-4">

                                {/* NAME */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Receiver name"
                                        {...register(
                                            "receiverName",
                                            {
                                                required:
                                                    "Receiver name is required",
                                            }
                                        )}
                                        className="input input-bordered w-full bg-white"
                                    />

                                    {errors.receiverName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .receiverName
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* CONTACT */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Contact
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        {...register(
                                            "receiverContact",
                                            {
                                                required:
                                                    "Receiver contact is required",
                                            }
                                        )}
                                        className="input input-bordered w-full bg-white"
                                    />

                                    {errors.receiverContact && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .receiverContact
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* REGION */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Select Region
                                    </label>

                                    <select
                                        {...register(
                                            "receiverRegion",
                                            {
                                                required:
                                                    "Receiver region is required",

                                                onChange: () => {
                                                    setValue(
                                                        "receiverServiceCenter",
                                                        ""
                                                    );
                                                },
                                            }
                                        )}
                                        className="select select-bordered w-full bg-white"
                                    >

                                        <option value="">
                                            Select region
                                        </option>

                                        {regions.map(
                                            (region) => (
                                                <option
                                                    key={
                                                        region
                                                    }
                                                    value={
                                                        region
                                                    }
                                                >
                                                    {region}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {errors.receiverRegion && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .receiverRegion
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* SERVICE CENTER */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Select Service Center
                                    </label>

                                    <select
                                        {...register(
                                            "receiverServiceCenter",
                                            {
                                                required:
                                                    "Receiver service center is required",
                                            }
                                        )}
                                        disabled={
                                            !receiverRegion
                                        }
                                        className="select select-bordered w-full bg-white"
                                    >

                                        <option value="">
                                            {receiverRegion
                                                ? "Select service center"
                                                : "Select region first"}
                                        </option>

                                        {receiverCenters.map(
                                            (center) => (
                                                <option
                                                    key={
                                                        center
                                                    }
                                                    value={
                                                        center
                                                    }
                                                >
                                                    {center}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {errors.receiverServiceCenter && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .receiverServiceCenter
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* ADDRESS */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Address
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Enter delivery address"
                                        {...register(
                                            "receiverAddress",
                                            {
                                                required:
                                                    "Receiver address is required",
                                            }
                                        )}
                                        className="textarea textarea-bordered w-full bg-white"
                                    />

                                    {errors.receiverAddress && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .receiverAddress
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* DELIVERY INSTRUCTION */}

                                <div>

                                    <label className="block text-sm font-medium mb-2">
                                        Delivery Instruction
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Enter delivery instruction"
                                        {...register(
                                            "deliveryInstruction",
                                            {
                                                required:
                                                    "Delivery instruction is required",
                                            }
                                        )}
                                        className="textarea textarea-bordered w-full bg-white"
                                    />

                                    {errors.deliveryInstruction && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                errors
                                                    .deliveryInstruction
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        SUBMIT
                    ================================= */}

                    <div className="flex justify-end">

                        <button
                            type="submit"
                            className="
                                px-8
                                py-3
                                rounded-md
                                bg-[#C6EF4A]
                                hover:bg-[#B9E83E]
                                text-black
                                font-semibold
                                transition
                                cursor-pointer
                            "
                        >
                            Submit Parcel
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
};

export default SendParcel;