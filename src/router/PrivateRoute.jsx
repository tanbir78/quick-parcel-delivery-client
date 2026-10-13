import React from 'react';
import UseAuth from '../hocks/UseAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
    const { user, loading } = UseAuth();

    if (loading) {
        return <span className="loading loading-spinner loading-xs"></span>
    }
    if (!user) {
        <Navigate to='/login'></Navigate>
    }

    return children;
};

export default PrivateRoute;