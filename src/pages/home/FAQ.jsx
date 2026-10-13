import { useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import faqData from "../../data/faq.json";
import FAQItem from "./FAQItem";

const FAQ = () => {
    const [activeId, setActiveId] = useState(1);

    const handleToggle = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="py-16 md:py-24 bg-base-200/50">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-10">

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Frequently Asked Question (FAQ)
                    </h2>

                    <p className="text-base-content/60 leading-relaxed">
                        Find answers to the most common questions about
                        our parcel delivery service, tracking, booking,
                        and support.
                    </p>

                </div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto space-y-3">

                    {faqData.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={activeId === faq.id}
                            onClick={() => handleToggle(faq.id)}
                        />
                    ))}

                </div>

                {/* See More Button */}
                <div className="flex justify-center mt-8">

                    <button className="btn btn-primary rounded-lg px-6">
                        See More FAQs

                        <FaArrowUpRightFromSquare className="text-sm" />
                    </button>

                </div>

            </div>
        </section>
    );
};

export default FAQ;