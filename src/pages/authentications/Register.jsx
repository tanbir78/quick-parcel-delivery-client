import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import axios from "axios";

import UseAuth from "../../hocks/UseAuth";
import UseAxios from "../../hocks/UseAxios";
import SocialLogin from "./SocialLogin";

const Register = () => {
    const { createUser, updateUserProfile } = UseAuth();
    const axiosInstance = UseAxios();

    const [profilePic, setProfilePic] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Register handler
    const onSubmit = async (data) => {
        if (loading) return;

        setLoading(true);

        try {
            // 1. Create Firebase account
            const result = await createUser(
                data.email,
                data.password
            );

            // 2. Update Firebase profile
            await updateUserProfile({
                displayName: data.name,
                photoURL: profilePic || "",
            });

            // 3. Save user in MongoDB
            const userInfo = {
                name: data.name,
                email: data.email,
                photoURL: profilePic || "",
                role: "user",
                created_at: new Date().toISOString(),
                last_log_in: new Date().toISOString(),
            };

            await axiosInstance.post("/users", userInfo);

            // 4. Sign out so the user can login manually
            await signOut(getAuth());

            // 5. Show success popup
            const popup = await Swal.fire({
                title: "Registration Complete!",
                text: "Your account has been created successfully. Please login to continue.",
                icon: "success",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#91B51C",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: false,
            });

            // 6. Navigate to login after button click
            if (popup.isConfirmed) {
                navigate("/login", {
                    replace: true,
                    state: {
                        email: data.email,
                        from: location.state?.from || "/",
                    },
                });
            }
        } catch (error) {
            console.error("Registration error:", error);

            // If registration succeeded but a later step failed,
            // sign out to avoid leaving the user automatically logged in.
            try {
                await signOut(getAuth());
            } catch {
                // Ignore sign-out errors here.
            }

            let message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again.";

            if (error.code === "auth/email-already-in-use") {
                message = "This email is already registered. Please login.";
            } else if (error.code === "auth/weak-password") {
                message = "Please use a stronger password.";
            } else if (error.code === "auth/invalid-email") {
                message = "Please enter a valid email address.";
            }

            Swal.fire({
                title: "Registration Failed",
                text: message,
                icon: "error",
                confirmButtonColor: "#91B51C",
            });
        } finally {
            setLoading(false);
        }
    };

    // Upload profile picture to ImgBB
    const handleImageUpload = async (event) => {
        const image = event.target.files?.[0];

        if (!image) return;

        if (!image.type.startsWith("image/")) {
            Swal.fire("Invalid File", "Please select an image.", "warning");
            event.target.value = "";
            return;
        }

        if (image.size > 5 * 1024 * 1024) {
            Swal.fire(
                "Image Too Large",
                "Please select an image smaller than 5 MB.",
                "warning"
            );
            event.target.value = "";
            return;
        }

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append("image", image);

            const imageUploadUrl =
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

            const response = await axios.post(
                imageUploadUrl,
                formData
            );

            setProfilePic(response.data.data.url);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Profile picture uploaded",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Image upload error:", error);

            Swal.fire(
                "Upload Failed",
                "Could not upload your profile picture.",
                "error"
            );
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-5">
                <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
                    Create an Account
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Register with Quick
                </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name */}
                <div className="mb-3">
                    <label className="block text-xs text-gray-700 mb-1">
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Your name"
                        {...register("name", {
                            required: "Name is required",
                        })}
                        className="w-full h-10 px-3 text-xs bg-white border border-gray-300 rounded outline-none focus:border-[#C6EF4A] focus:ring-1 focus:ring-[#C6EF4A]"
                    />

                    {errors.name && (
                        <p className="text-red-500 text-[11px] mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Profile Picture */}
                <div className="mb-3">
                    <label className="block text-xs text-gray-700 mb-1">
                        Profile Picture
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded"
                    />

                    {uploadingImage && (
                        <p className="text-xs text-gray-500 mt-1">
                            Uploading image...
                        </p>
                    )}

                    {profilePic && (
                        <img
                            src={profilePic}
                            alt="Profile preview"
                            className="mt-2 w-16 h-16 rounded-full object-cover"
                        />
                    )}
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="block text-xs text-gray-700 mb-1">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            },
                        })}
                        className="w-full h-10 px-3 text-xs bg-white border border-gray-300 rounded outline-none focus:border-[#C6EF4A] focus:ring-1 focus:ring-[#C6EF4A]"
                    />

                    {errors.email && (
                        <p className="text-red-500 text-[11px] mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-xs text-gray-700 mb-1">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="At least 6 characters"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        className="w-full h-10 px-3 text-xs bg-white border border-gray-300 rounded outline-none focus:border-[#C6EF4A] focus:ring-1 focus:ring-[#C6EF4A]"
                    />

                    {errors.password && (
                        <p className="text-red-500 text-[11px] mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="w-full h-11 rounded bg-[#C6EF4A] hover:bg-[#B9E83E] disabled:opacity-60 disabled:cursor-not-allowed text-black text-sm font-semibold transition"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="loading loading-spinner loading-sm" />
                            Creating Account...
                        </span>
                    ) : (
                        "Register"
                    )}
                </button>
            </form>

            {/* Login Link */}
            <p className="text-xs text-gray-500 mt-3">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-[#91B51C] hover:underline font-medium"
                >
                    Login
                </Link>
            </p>

            {/* Social Login */}
            <SocialLogin />
        </div>
    );
};

export default Register;