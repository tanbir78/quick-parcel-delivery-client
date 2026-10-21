import React, { Children } from 'react';
import UseAuth from '../hocks/UseAuth';
import UseUserRole from '../hocks/UseUserRole';
import { Navigate } from 'react-router';

const UserRoute = ({ children }) => {
    const { user, loading } = UseAuth();
    const { role, roleLoading } = UseUserRole();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xs"></span>
    }

    if (!user || role !== "user") {
        return <Navigate state={{ from: location.pathname }} to='/forbidden'></Navigate>
    }

    return children
};

export default UserRoute;
