import { FaBox, FaTruck, FaMapMarkerAlt, } from "react-icons/fa";

const Loading = ({ message = "Your parcel is on its way...", fullScreen = false,
}) => {
    return (
        <div className={`flex items-center justify-center bg-base-200 p-6 ${fullScreen ? "min-h-screen" : "min-h-[250px] w-full"
            }`}>
            <div className="w-full max-w-xs rounded-2xl bg-base-100 p-6 text-center shadow-lg">
                <FaBox className="mx-auto mb-3 animate-bounce text-4xl text-success" />

                <h2 className="text-xl font-bold">
                    Parcel<span className="text-success">Go</span>
                </h2>

                <div className="relative mx-auto my-6 h-10 max-w-[220px]">
                    <div className="absolute left-3 right-3 top-5 border-t-2 border-dashed border-success/40" />
                    <FaMapMarkerAlt className="absolute left-0 top-2 text-success" />
                    <FaTruck className="absolute top-1 animate-[move_2s_ease-in-out_infinite_alternate] text-2xl text-primary" />
                    <FaMapMarkerAlt className="absolute right-0 top-2 text-error" />
                </div>

                <span className="loading loading-dots loading-md text-success" />

                <p className="mt-2 text-sm font-medium">{message}</p>
            </div>

            <style>{`
                @keyframes move {
                    from { left: 15%; }
                    to { left: 75%; }
                }
            `}</style>
        </div>
    );
};
export default Loading;