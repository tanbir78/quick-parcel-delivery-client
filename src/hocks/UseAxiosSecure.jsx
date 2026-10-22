import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAuth } from 'firebase/auth';
import UseAuth from './UseAuth';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
    const { logOut } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const token = await currentUser.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;

                console.log('API error status:', status);
                console.log('API error data:', error.response?.data);

                if (status === 401) {
                    await logOut();
                    navigate('/login');
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;