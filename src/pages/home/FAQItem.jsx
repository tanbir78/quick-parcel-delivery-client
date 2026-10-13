import { FaChevronDown } from "react-icons/fa";

const FAQItem = ({ faq, isOpen, onClick }) => {
    return (
        <div
            className={`
                rounded-xl border transition-all duration-300
                ${isOpen
                    ? "border-primary bg-primary/5"
                    : "border-base-200 bg-base-100"
                }
            `}
        >
            {/* Question */}
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <span className="font-semibold text-sm md:text-base">
                    {faq.question}
                </span>

                <FaChevronDown
                    className={`
                        shrink-0 text-sm transition-transform duration-300
                        ${isOpen ? "rotate-180 text-primary" : ""}
                    `}
                />
            </button>

            {/* Answer */}
            <div
                className={`
                    grid transition-all duration-300
                    ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                `}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-base-200 px-5 py-4">
                        <p className="text-sm md:text-base text-base-content/60 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQItem;