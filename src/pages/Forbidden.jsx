import { FaBoxOpen, FaArrowLeft, FaShieldAlt, FaLock, } from "react-icons/fa";
import { Link, Navigate } from "react-router";

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-base-100 shadow-xl">
                <div className="p-8 md:p-12">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-error/10 px-4 py-2 text-sm font-semibold text-error">
                        <FaShieldAlt />
                        Access Denied
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
                        403
                    </h1>

                    <h2 className="mt-4 text-2xl font-bold md:text-3xl">
                        Oops! You're not authorized.
                    </h2>

                    <p className="mt-4 leading-7 text-base-content/80">
                        Looks like this parcel is for someone with
                        different access permissions. Please return
                        to your dashboard or go back to the previous page.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/"
                            className="btn btn-primary gap-2"
                        >
                            Back to Home
                        </Link>

                        <button
                            onClick={() => Navigate(-1)}
                            className="btn btn-outline gap-2"
                        >
                            <FaArrowLeft />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
