import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaUndo,
  FaUserCircle,
} from "react-icons/fa";

import UseAuth from "../../hocks/UseAuth";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";
import warehouses from "../../data/warehouses.json";

// Upload a selected image to ImgBB and return its hosted URL.
const uploadImageToImgBB = async (imageFile) => {
  const apiKey = import.meta.env.VITE_image_upload_key;

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing. Add VITE_image_upload_key to your .env file and restart Vite."
    );
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(
      result.error?.message || "Could not upload the image to ImgBB."
    );
  }

  return result.data.url;
};

const UpdateProfile = () => {
  const auth = UseAuth();
  const user = auth?.user;
  const updateUserProfile = auth?.updateUserProfile;
  const axiosSecure = UseAxiosSecure();

  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(user?.photoURL || "");
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
      phone: "",
      region: "",
      district: "",
      address: "",
    },
  });

  const selectedRegion = useWatch({ control, name: "region" });
  const photoURL = watch("photoURL");

  const regions = useMemo(
    () =>
      [
        ...new Set(
          warehouses
            .filter((item) => item.status === "active")
            .map((item) => item.region)
            .filter(Boolean)
        ),
      ].sort(),
    []
  );

  const districts = useMemo(
    () =>
      [
        ...new Set(
          warehouses
            .filter(
              (item) =>
                item.status === "active" && item.region === selectedRegion
            )
            .map((item) => item.district)
            .filter(Boolean)
        ),
      ].sort(),
    [selectedRegion]
  );

  useEffect(() => {
    if (!user) return;

    reset((current) => ({
      ...current,
      name: user.displayName || current.name || "",
      email: user.email || "",
      photoURL: user.photoURL || current.photoURL || "",
    }));

    setPreviewURL(user.photoURL || "");
  }, [user, reset]);

  useEffect(() => {
    return () => {
      if (previewURL?.startsWith("blob:")) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire(
        "Unsupported image",
        "Please choose a JPG, PNG, or WebP image.",
        "warning"
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire(
        "Image too large",
        "Please choose an image smaller than 5 MB.",
        "warning"
      );
      event.target.value = "";
      return;
    }

    if (previewURL?.startsWith("blob:")) {
      URL.revokeObjectURL(previewURL);
    }

    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!user?.email) {
      Swal.fire("Login required", "Please log in first.", "warning");
      return;
    }

    try {
      setSaving(true);

      let uploadedPhotoURL = user.photoURL || data.photoURL?.trim() || "";

      // Upload the image only if the user selected a new file.
      if (selectedFile) {
        uploadedPhotoURL = await uploadImageToImgBB(selectedFile);
      }

      const profileData = {
        name: data.name.trim(),
        email: user.email,
        photoURL: uploadedPhotoURL,
        phone: data.phone.trim(),
        region: data.region,
        district: data.district,
        address: data.address.trim(),
        updatedAt: new Date().toISOString(),
      };

      // Persist profile fields in MongoDB through the authenticated backend.
      await axiosSecure.patch("/users/profile", profileData);

      // Update Firebase Auth display name/photo if this helper exists in UseAuth.
      if (typeof updateUserProfile === "function") {
        await updateUserProfile({
          displayName: profileData.name,
          photoURL: profileData.photoURL,
        });
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewURL(profileData.photoURL);

      reset({
        ...data,
        email: user.email,
        photoURL: profileData.photoURL,
      });

      await Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile information has been saved.",
        confirmButtonText: "Great!",
      });
    } catch (error) {
      console.error("Profile update failed:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Could not update your profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (previewURL?.startsWith("blob:")) {
      URL.revokeObjectURL(previewURL);
    }

    setSelectedFile(null);
    setPreviewURL(user?.photoURL || "");

    if (fileInputRef.current) fileInputRef.current.value = "";

    reset({
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
      phone: "",
      region: "",
      district: "",
      address: "",
    });
  };

  const fieldClass =
    "input input-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none";

  const selectClass =
    "select select-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary focus:outline-none";

  const labelClass = "mb-2 block text-sm font-medium text-base-content";

  return (
    <section className="min-h-screen bg-base-200 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-base-content md:text-4xl">
            Update Profile
          </h1>
          <p className="mt-2 text-base-content/60">
            Manage your personal information for Quick Parcel Delivery.
          </p>
        </header>

        {/* Profile summary */}
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body flex flex-col items-center gap-4 sm:flex-row">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                {previewURL ? (
                  <img
                    src={previewURL}
                    alt="Profile preview"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-base-200 text-4xl text-base-content/50">
                    <FaUserCircle />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-base-content">
                {user?.displayName || "Quick User"}
              </h2>
              <p className="mt-1 text-sm text-base-content/60">
                {user?.email || "No email available"}
              </p>
              <span className="badge badge-primary mt-3">Quick Account</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body space-y-7">
            <div>
              <h2 className="text-xl font-bold text-base-content">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-base-content/60">
                Keep your account information up to date.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Full name */}
              <div>
                <label className={labelClass}>
                  <FaUser className="mr-2 inline text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={fieldClass}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must contain at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  <FaEnvelope className="mr-2 inline text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  className={`${fieldClass} cursor-not-allowed opacity-70`}
                  {...register("email")}
                />
                <p className="mt-1 text-xs text-base-content/50">
                  Your registered email cannot be changed here.
                </p>
              </div>

              {/* Device image upload */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  <FaCamera className="mr-2 inline text-primary" />
                  Profile Picture
                </label>

                <div className="flex flex-col items-center gap-4 rounded-xl border border-base-300 bg-base-200 p-5 sm:flex-row">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                      {previewURL ? (
                        <img src={previewURL} alt="Selected profile preview" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-base-300 text-4xl text-base-content/50">
                          <FaUserCircle />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex-1">
                    <p className="font-semibold text-base-content">
                      Upload from your device
                    </p>
                    <p className="mt-1 text-sm text-base-content/60">
                      JPG, PNG, or WebP · Maximum 5 MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="file-input file-input-bordered mt-3 w-full max-w-md border-base-300 bg-base-100 text-base-content"
                    />
                    {selectedFile && (
                      <p className="mt-2 break-all text-xs text-base-content/60">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  <FaPhone className="mr-2 inline text-primary" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={fieldClass}
                  {...register("phone", {
                    pattern: {
                      value: /^[0-9+\-\s()]{7,20}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className={labelClass}>
                  <FaMapMarkerAlt className="mr-2 inline text-primary" />
                  Region
                </label>
                <select
                  className={selectClass}
                  {...register("region", {
                    onChange: () => {
                      // Clear district when region changes.
                      setValue("district", "");
                    },
                  })}
                >
                  <option value="">Select region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className={labelClass}>District / Service Center</label>
                <select
                  className={selectClass}
                  disabled={!selectedRegion}
                  {...register("district")}
                >
                  <option value="">Select district</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className={labelClass}>Current Address</label>
                <textarea
                  rows={4}
                  placeholder="House, road, area, and other address details"
                  className="textarea textarea-bordered w-full border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none"
                  {...register("address", {
                    maxLength: {
                      value: 300,
                      message: "Address cannot exceed 300 characters",
                    },
                  })}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-error">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-base-300 bg-base-200 p-4">
              <h3 className="font-semibold text-base-content">
                Account Information
              </h3>
              <p className="mt-2 text-sm text-base-content/60">
                Your profile is linked to your authenticated account. Your
                parcel and payment history will continue to use your registered
                email address.
              </p>
            </div>

            {/* Full-width save action */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="btn btn-outline"
              >
                <FaUndo />
                Reset
              </button>

              <button
                type="submit"
                disabled={saving || !user}
                className="btn btn-primary"
              >
                {saving ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <FaSave />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateProfile;
