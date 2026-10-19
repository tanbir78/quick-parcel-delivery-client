import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

import SocialLogin from "./SocialLogin";
import UseAuth from "../../hocks/UseAuth";

const Login = () => {
    const { signInUser } = UseAuth();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = (data) => {
        // console.log(data);
        signInUser(data.email, data.password)
            .then((result) => {
                console.log("Login successful:", result.user);
                navigate(from);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-5">
                <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight">
                    Welcome Back
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Login with ZapShift
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>

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
                                message: "Please enter a valid email",
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

                {/* Forgot Password */}
                <div className="mb-2">
                    <Link
                        to="/forgot-password"
                        className="text-xs text-gray-500 hover:text-[#91B51C]"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Login Button */}
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
                    Login
                </button>

            </form>

            {/* Register */}
            <p className="text-xs text-gray-500 mt-2">
                Don't have an account?{" "}
                <Link state={{ from }}
                    to="/register"
                    className="text-[#91B51C] hover:underline font-medium"
                >
                    Register
                </Link>
            </p>

            {/* Google Login */}
            <SocialLogin />

        </div>
    );
};

export default Login;

// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { Link } from 'react-router';
// import SocialLogin from './SocialLogin';
// import UseAuth from '../../hocks/UseAuth';

// const Login = () => {
//     const { signInUser } = UseAuth();
//     const { register, handleSubmit, formState: { errors } } = useForm();

//     const onSubmit = data => {
//         console.log(data);
//         signInUser(data.email, data.password)
//             .then((result) => {
//                 console.log("Login successful:", result.user);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     return (
//         <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
//             <div className="card-body">

//                 <h1 className="text-5xl font-bold">Please Login!</h1>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <fieldset className="fieldset">

//                         <label className="label">Email</label>
//                         <input type="email" {...register('mail')} className="input" placeholder="Email" />

//                         <label className="label">Password</label>
//                         <input type="password" {...register('password', {
//                             required: true,
//                             minLength: 6
//                         })}
//                             className="input" placeholder="Password" />
//                         {
//                             errors.password?.type === 'required' && <p
//                                 className='text-red-500'>Password is required</p>
//                         }
//                         {
//                             errors.password?.type === 'minLength' && <p
//                                 className='text-red-500'>Password must be 6 characters or longer</p>
//                         }
//                         <div><a className="link link-hover">Forgot password?</a></div>
//                         <button className="btn btn-primary mt-4">Login</button>
//                     </fieldset>
//                     <p><small>Not Register? <Link className='btn btn-link' to='/register' >Register</Link></small></p>
//                 </form>
//                 <SocialLogin></SocialLogin>
//             </div>
//         </div>
//     );
// };

// export default Login;