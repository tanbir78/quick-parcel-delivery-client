import bookingIcon from "../../assets/bookingIcon.png";

const HowItWorksCard = ({ item }) => {
    return (
        <div className="bg-base-100 rounded-2xl p-6 min-h-[190px] border border-base-200 hover:shadow-md transition-all duration-300">

            {/* Icon */}
            <div className="mb-5">
                <img
                    src={bookingIcon}
                    alt={item.title}
                    className="w-12 h-12 object-contain"
                />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-3">
                {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-base-content/60 leading-relaxed">
                {item.description}
            </p>

        </div>
    );
};

export default HowItWorksCard;