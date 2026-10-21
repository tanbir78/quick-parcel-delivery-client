import React from 'react';
import { NavLink, Outlet } from 'react-router';
import QuickLogo from '../pages/shared/QuickLogo';
import { FaHouse, FaBoxOpen, FaMoneyBillTransfer, FaMapLocationDot, FaRegUser } from "react-icons/fa6";
import { FaCheckCircle, FaMoneyBillWave, FaMotorcycle, FaRoute, FaTasks, FaUserClock, FaUsersCog } from 'react-icons/fa';
import UseUserRole from '../hocks/UseUserRole';

const DashboardLayout = () => {
    const { role, roleLoading } = UseUserRole();
    // console.log(role);

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                {/* Navbar */}
                <div className="navbar bg-base-300 w-full lg:hidden">
                    <div className="flex-none ">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2">DashBoard</div>
                </div>
                {/* Page content here */}
                <Outlet></Outlet>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">

                    {/* Sidebar content here */}
                    <QuickLogo></QuickLogo>

                    <li>
                        <NavLink to="/">
                            <FaHouse className="inline mr-2 text-blue-500 text-xl" />
                            Home
                        </NavLink>
                    </li>

                    {/* user links */}
                    {!roleLoading && role === "user" &&
                        <>
                            <li>
                                <NavLink to="/dashboard/myParcels">
                                    <FaBoxOpen className="inline mr-2 text-orange-500 text-xl" />
                                    My Parcels
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/paymentHistory">
                                    <FaMoneyBillTransfer className="inline mr-2 text-emerald-500 text-xl" />
                                    Payment History
                                </NavLink>
                            </li>
                        </>
                    }

                    <li>
                        <NavLink to="/dashboard/track">
                            <FaMapLocationDot className="inline mr-2 text-purple-500 text-xl" />
                            Track a Parcel
                        </NavLink>
                    </li>

                    {/* <li>
                        <NavLink to="/dashboard/update-tracking">
                            <FaRoute className="inline  mr-2 text-blue-500 text-xl" />
                            Update Tracking
                        </NavLink>
                    </li> */}

                    {/* riders links */}
                    {!roleLoading && role === "rider" &&
                        <>
                            <li>
                                <NavLink to="/dashboard/my-deliveries">
                                    <FaTasks className="inline mr-2 text-blue-500 text-xl" />
                                    My Deliveries
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/completed-deliveries">
                                    <FaCheckCircle className="inline mr-2 text-green-500 text-xl" />
                                    Completed Deliveries
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/my-earning">
                                    <FaMoneyBillWave className="inline mr-2 text-green-500 text-xl" />
                                    My Earnings
                                </NavLink>
                            </li>
                        </>
                    }

                    {/* admin links */}
                    {!roleLoading && role === "admin" &&
                        <>
                            <li>
                                <NavLink to="/dashboard/assign-riders">
                                    <FaMotorcycle className="inline mr-2 text-yellow-500 text-xl" />
                                    Assign Riders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/active-riders">
                                    <FaMotorcycle className="inline mr-2 text-green-500 text-xl" />
                                    Active Riders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/pending-riders">
                                    <FaUserClock className="inline mr-2 text-yellow-500 text-xl" />
                                    Pending Riders
                                </NavLink>
                            </li>

                            {/* admin routes */}
                            <li>
                                <NavLink to="/dashboard/make-admin">
                                    <FaUsersCog className="inline mr-2 text-blue-500 text-xl" />
                                    Make Admin
                                </NavLink>
                            </li>
                        </>
                    }

                    <li>
                        <NavLink to="/dashboard/profile">
                            <FaRegUser className="inline mr-2 text-pink-500 text-xl" />
                            Update Profile
                        </NavLink>
                    </li>
                    
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;