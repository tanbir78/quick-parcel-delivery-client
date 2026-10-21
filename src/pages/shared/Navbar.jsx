import React from 'react';
import { Link, NavLink } from 'react-router';
import QuickLogo from './QuickLogo';
import UseAuth from '../../hocks/UseAuth';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logOut } = UseAuth();

    const handleLogOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navItems = <>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/sendParcel'>Send A Percel</NavLink></li>
        <li><NavLink to='/coverage'>Coverage</NavLink></li>
        {
            user && <>
                <li><NavLink to='/dashboard'>DashBoard</NavLink></li>
            </>
        }
        <li><NavLink to='/beARider'>Be A Rider</NavLink></li>
        <li><NavLink to='/about'>About Us</NavLink></li>
    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navItems}
                    </ul>
                </div>
                <span className="btn btn-ghost text-xl"><QuickLogo></QuickLogo></span>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>
            <div className="navbar-end">
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {
                        user ?
                            <button onClick={handleLogOut} className="btn">
                                Log Out
                            </button>
                            :
                            <Link className="btn" to="/login">
                                Log in
                            </Link>
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;