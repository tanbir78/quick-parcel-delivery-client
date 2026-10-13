import React from 'react';
import { Outlet } from 'react-router';
import authImg from '../assets/authImage.png'
import QuickLogo from '../pages/shared/QuickLogo';

const AuthLayout = () => {
    return (
        <div className="p-12 bg-[#F8FDEB]">
            <QuickLogo></QuickLogo>

            <div className="hero-content flex-col lg:flex-row-reverse">

                <div className='flex-1'>
                    <img
                        alt="Tailwind CSS hero component"
                        src={authImg}
                        className="max-w-sm object-contain"
                    />
                </div>

                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
