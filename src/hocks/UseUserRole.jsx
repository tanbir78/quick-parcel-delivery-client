import { useQuery } from "@tanstack/react-query";
import UseAuth from "./UseAuth";
import UseAxiosSecure from "./UseAxiosSecure";

const UseUserRole = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: role, isLoading, error
    } = useQuery({
        queryKey: ["userRole", user?.email],

        enabled: !!user?.email,

        queryFn: async () => {
            const res = await axiosSecure.get(
                `/users/role?email=${encodeURIComponent(user.email)}`
            );

            return res.data.role;
        },
    });

    return {
        role: user?.email ? role : null,
        roleLoading: user?.email ? isLoading : false,
        error,
    };
};

export default UseUserRole;
