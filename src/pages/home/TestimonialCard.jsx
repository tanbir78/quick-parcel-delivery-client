import reviewQuote from "../../assets/reviewQuote.png";

const TestimonialCard = ({ testimonial, active = false }) => {
    return (
        <div
            className={`
        bg-base-100 rounded-2xl p-6 md:p-7
        border border-base-200
        transition-all duration-500
        ${active
                    ? "scale-100 opacity-100 shadow-xl"
                    : "scale-95 opacity-40 shadow-sm"
                }
      `}
        >
            {/* Quote */}
            <div className="text-8xl font-bold text-primary/30 mb-4">
                <img src={reviewQuote} alt="" />
            </div>

            {/* Review */}
            <p className="text-sm md:text-base text-base-content/70 leading-relaxed min-h-[110px]">
                {testimonial.review}
            </p>

            {/* Divider */}
            <div className="border-t border-dashed border-primary/40 my-5"></div>

            {/* User */}
            <div className="flex items-center gap-4">
                {/* <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg font-semibold">
                            {testimonial.name.charAt(0)}
                        </span>
                    </div>
                </div> */}
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-lg font-semibold text-primary-content">
                        {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div>
                    <h3 className="font-bold text-base">
                        {testimonial.name}
                    </h3>

                    <p className="text-sm text-base-content/60">
                        {testimonial.role}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;