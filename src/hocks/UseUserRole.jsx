
import { useQuery } from "@tanstack/react-query";
import UseAuth from "./UseAuth";
import UseAxiosSecure from "./UseAxiosSecure";

const UseUserRole = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: role, isLoading, error } = useQuery({
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
        role: role ?? null,
        roleLoading: !!user?.email && isLoading,
        error,
    };
};

export default UseUserRole;
