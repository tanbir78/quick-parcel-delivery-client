import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import UseAuth from "../../hocks/UseAuth";
import SocialLogin from "./SocialLogin";
import axios from "axios";
import UseAxios from "../../hocks/UseAxios";

const Register = () => {
    const { createUser, updateUserProfile } = UseAuth();
    const [profilePic, setProfilePic] = useState('');
    const axiosInstance = UseAxios();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);

        createUser(data.email, data.password)
            .then(async (result) => {
                console.log("Registration successful:", result.user);

                // update userinfo in the database
                const userInfo = {
                    email: data.email,
                    role: 'user', // default role
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }
                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);

                // update user profile in firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('profile name picture updated');
                    })
                    .catch((error) => {
                        console.log('error : ', error);
                    })

            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        // console.log(image);
        const formData = new FormData();
        formData.append('image', image);

        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        const res = await axios.post(imageUploadUrl, formData);

        // console.log(res.data.data.url);
        setProfilePic(res.data.data.url);
    }

    return (
        <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-5">
                <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
                    Create an Account
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Register with ZapShift
                </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Name */}
                <div className="mb-2">
                    <label className="block text-xs text-gray-700 mb-1">
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Name"
                        {...register("name", {
                            required: "Name is required",
                        })}
                        className="
                            w-full
                            h-10
                            px-3
                            text-xs
                            bg-white
                            border
                            border-gray-300
                            rounded
                            outline-none
                            focus:border-[#C6EF4A]
                            focus:ring-1
                            focus:ring-[#C6EF4A]
                        "
                    />

                    {errors.name && (
                        <p className="text-red-500 text-[11px] mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* add picture */}
                <div className="mb-2">
                    <label className="block text-xs text-gray-700 mb-1">
                        User Picture</label>
                    <input

                        type="file"
                        onChange={handleImageUpload}
                        className="input" placeholder="Your Profile Picture"
                        // accept="image/*"
                        // {...register("photo", {
                        //     required: "User picture is required",
                        //     validate: {
                        //         imageOnly: (files) =>
                        //             files?.[0]?.type.startsWith("image/") ||
                        //             "Please select an image file",
                        //         maxSize: (files) =>
                        //             files?.[0]?.size <= 2 * 1024 * 1024 ||
                        //             "Image size must be less than 2 MB",
                        //     },
                        // })}
                        className="w-full px-3 py-2 text-xs bg-white border
                                    border-gray-300 rounded outline-none
                                    focus:border-[#C6EF4A] focus:ring-1
                                    focus:ring-[#C6EF4A]"/>
                    {/* {errors.photo && (
                        <p className="text-red-500 text-[11px] mt-1">
                            {errors.photo.message}
                        </p>
                    )} */}
                </div>


                {/* Email */}
                <div className="mb-2">
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
                                message:
                                    "Please enter a valid email address",
                            },
                        })}
                        className="
                            w-full
                            h-10
                            px-3
                            text-xs
                            bg-white
                            border
                            border-gray-300
                            rounded
                            outline-none
                            focus:border-[#C6EF4A]
                            focus:ring-1
                            focus:ring-[#C6EF4A]
                        "
                    />

                    {errors.email && (
                        <p className="text-red-500 text-[11px] mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-2">
                    <label className="block text-xs text-gray-700 mb-1">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be 6 characters or longer",
                            },
                        })}
                        className="
                            w-full
                            h-10
                            px-3
                            text-xs
                            bg-white
                            border
                            border-gray-300
                            rounded
                            outline-none
                            focus:border-[#C6EF4A]
                            focus:ring-1
                            focus:ring-[#C6EF4A]
                        "
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
                    className="
                        w-full
                        h-10
                        rounded
                        bg-[#C6EF4A]
                        hover:bg-[#B9E83E]
                        text-black
                        text-xs
                        font-medium
                        transition
                    "
                >
                    Register
                </button>
            </form>

            {/* Login */}
            <p className="text-xs text-gray-500 mt-2">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-[#91B51C] hover:underline font-medium"
                >
                    Login
                </Link>
            </p>

            {/* Google Login */}
            <SocialLogin />

        </div>
    );
};

export default Register;

