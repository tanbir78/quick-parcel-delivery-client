import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import UseAuth from "../../hocks/UseAuth";
import SocialLogin from "./SocialLogin";

const Register = () => {
    const { createUser } = UseAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);

        createUser(data.email, data.password)
            .then((result) => {
                console.log("Registration successful:", result.user);
            })
            .catch((error) => {
                console.log(error);
            });
    };

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


// import React from 'react';
// import { useForm } from 'react-hook-form';
// import UseAuth from '../../hocks/UseAuth';
// import { Link } from 'react-router';
// import SocialLogin from './SocialLogin';

// const Register = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const { createUser } = UseAuth();

//     const onSubmit = data => {
//         console.log(data);
//         createUser(data.mail, data.password)
//             .then(result => {
//                 console.log(result.user);
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//     }
//     return (
//         <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
//             <div className="card-body">

//                 <h1 className="text-5xl font-bold">Create An Account!</h1>

//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <fieldset className="fieldset">

//                         <label className="label">Email</label>
//                         <input type="email" {...register('mail', {
//                             required: true,
//                             pattern: {
//                                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                 message: "Please enter a valid email address"
//                             }
//                         })} className="input" placeholder="Email" />
//                         {
//                             errors.mail?.type === 'required' && <p
//                                 className='text-red-500'>Email is required</p>
//                         }
//                         {/* Pattern Error */}
//                         {errors.mail?.type === "pattern" && (
//                             <p className="text-red-500">
//                                 {errors.mail.message}
//                             </p>
//                         )}
//                         <label className="label">Password</label>
//                         <input type="password" {...register('password', {
//                             required: true,
//                             minLength: 6
//                         })} className="input" placeholder="Password" />
//                         {
//                             errors.password?.type === 'required' && <p
//                                 className='text-red-500'>Password is required</p>
//                         }
//                         {
//                             errors.password?.type === 'minLength' && <p
//                                 className='text-red-500'>Password must be 6 characters or longer</p>
//                         } <button className="btn btn-primary mt-4">Register</button>
//                     </fieldset>
//                     <p><small>Already have an account? <Link className='btn btn-link' to='/login' >Login</Link></small></p>
//                 </form>
//                 <SocialLogin></SocialLogin>
//             </div>
//         </div>
//     );
// };

// export default Register;