import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://quick-parcels.vercel.app`
})


const UseAxios = () => {
    return axiosInstance;
};

export default UseAxios;