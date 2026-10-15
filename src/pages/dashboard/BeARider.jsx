import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";

import UseAuth from "../../hocks/UseAuth";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import warehouses from "../../data/warehouses.json";

const BearRider = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.displayName || "",
            email: user?.email || "",
            age: "",
            region: "",
            district: "",
            phone: "",
            nid: "",
            bikeBrand: "",
            bikeRegistrationNumber: "",
            address: "",
            experience: "",
            emergencyContact: "",
            status: "pending",
        },
    });

    const selectedRegion = useWatch({
        control,
        name: "region",
    });

    // Get unique regions from active service centers.
    const regions = useMemo(() => {
        return [
            ...new Set(
                warehouses
                    .filter((item) => item.status === "active")
                    .map((item) => item.region)
                    .filter(Boolean)
            ),
        ].sort();
    }, []);

    // Show only districts connected to the selected region.
    const districts = useMemo(() => {
        return [
            ...new Set(
                warehouses
                    .filter(
                        (item) =>
                            item.status === "active" &&
                            item.region === selectedRegion
                    )
                    .map((item) => item.district)
                    .filter(Boolean)
            ),
        ].sort();
    }, [selectedRegion]);

    const onSubmit = async (data) => {
        const application = {
            ...data,
            name: user?.displayName || "",
            email: user?.email || "",
            status: "pending",
            appliedAt: new Date().toISOString(),
        };

        try {
            setSubmitting(true);

            // Backend endpoint for rider applications.
            const response = await axiosSecure.post("/riderApplications", application);

            if (response.data?.insertedId || response.data?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Application Submitted!",
                    text: "Your rider application is pending review.",
                });

                reset({
                    name: user?.displayName || "",
                    email: user?.email || "",
                    age: "",
                    region: "",
                    district: "",
                    phone: "",
                    nid: "",
                    bikeBrand: "",
                    bikeRegistrationNumber: "",
                    address: "",
                    experience: "",
                    emergencyContact: "",
                    status: "pending",
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "Application Submitted",
                    text: "Please check your application status.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text:
                    error.response?.data?.message ||
                    "Could not submit your application. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Become a Rider
                        </h2>
                        <p className="text-base-content/70 mt-2">
                            Submit your information to apply as a delivery rider.
                            Your application will be reviewed by the admin.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal information */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4">
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.displayName || ""}
                                        readOnly
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="input input-bordered w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Age</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="18"
                                        placeholder="Enter your age"
                                        className="input input-bordered w-full"
                                        {...register("age", {
                                            required: "Age is required",
                                            valueAsNumber: true,
                                            min: {
                                                value: 18,
                                                message: "You must be at least 18",
                                            },
                                            max: {
                                                value: 100,
                                                message: "Enter a valid age",
                                            },
                                        })}
                                    />
                                    {errors.age && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.age.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">Phone Number</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="input input-bordered w-full"
                                        {...register("phone", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9+\-\s()]{7,20}$/,
                                                message: "Enter a valid phone number",
                                            },
                                        })}
                                    />
                                    {errors.phone && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">
                                            National ID Card Number
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your NID number"
                                        className="input input-bordered w-full"
                                        {...register("nid", {
                                            required: "NID number is required",
                                            minLength: {
                                                value: 10,
                                                message: "Enter a valid NID number",
                                            },
                                        })}
                                    />
                                    {errors.nid && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.nid.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">
                                            Emergency Contact Number
                                        </span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Emergency contact number"
                                        className="input input-bordered w-full"
                                        {...register("emergencyContact", {
                                            required: "Emergency contact is required",
                                        })}
                                    />
                                    {errors.emergencyContact && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.emergencyContact.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="divider" />

                        {/* Service area */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4">
                                Preferred Service Area
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Region</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        {...register("region", {
                                            required: "Please select a region",
                                        })}
                                    >
                                        <option value="">Select region</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.region && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.region.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">District</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        disabled={!selectedRegion}
                                        {...register("district", {
                                            required: "Please select a district",
                                        })}
                                    >
                                        <option value="">Select district</option>
                                        {districts.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.district.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Current Address</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="House, road, area, and other address details"
                                        className="textarea textarea-bordered w-full"
                                        {...register("address", {
                                            required: "Current address is required",
                                        })}
                                    />
                                    {errors.address && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="divider" />

                        {/* Bike information */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4">
                                Bike Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Bike Brand</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Honda, Yamaha, Bajaj"
                                        className="input input-bordered w-full"
                                        {...register("bikeBrand", {
                                            required: "Bike brand is required",
                                        })}
                                    />
                                    {errors.bikeBrand && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.bikeBrand.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">
                                            Bike Registration Number
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter registration number"
                                        className="input input-bordered w-full"
                                        {...register("bikeRegistrationNumber", {
                                            required: "Registration number is required",
                                        })}
                                    />
                                    {errors.bikeRegistrationNumber && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.bikeRegistrationNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">
                                            Delivery Experience
                                        </span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        {...register("experience", {
                                            required: "Please select your experience",
                                        })}
                                    >
                                        <option value="">Select experience</option>
                                        <option value="No experience">No experience</option>
                                        <option value="Less than 1 year">
                                            Less than 1 year
                                        </option>
                                        <option value="1–3 years">1–3 years</option>
                                        <option value="More than 3 years">
                                            More than 3 years
                                        </option>
                                    </select>
                                    {errors.experience && (
                                        <p className="text-error text-sm mt-1">
                                            {errors.experience.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Application status is not editable by the applicant. */}
                        <div className="rounded-lg bg-base-200 p-4">
                            <p className="font-semibold">Application Status</p>
                            <span className="badge badge-warning mt-2">Pending</span>
                            <p className="text-sm text-base-content/70 mt-2">
                                Your application will remain pending until an admin
                                reviews it.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !user}
                            className="btn btn-primary w-full"
                        >
                            {submitting ? "Submitting..." : "Submit Rider Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BearRider;
