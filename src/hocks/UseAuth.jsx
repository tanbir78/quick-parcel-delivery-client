import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const UseAuth = () => {
    const authInfo = use(AuthContext)
    return authInfo;
};

export default UseAuth;