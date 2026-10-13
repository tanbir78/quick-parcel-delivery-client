import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaArrowRight,
    FaQuoteLeft,
} from "react-icons/fa";

import testimonialsData from "../../data/testimonialsData.json";
import TestimonialCard from "./TestimonialCard";
import testimonialImage from "../../assets/customer-top.png";

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const totalTestimonials = testimonialsData.length;

    // Next testimonial
    const handleNext = () => {
        setActiveIndex(
            (prev) => (prev + 1) % totalTestimonials
        );
    };

    // Previous testimonial
    const handlePrevious = () => {
        setActiveIndex(
            (prev) =>
                (prev - 1 + totalTestimonials) %
                totalTestimonials
        );
    };

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Previous card
    const previousIndex =
        (activeIndex - 1 + totalTestimonials) %
        totalTestimonials;

    // Next card
    const nextIndex =
        (activeIndex + 1) % totalTestimonials;

    return (
        <section className="py-16 md:py-24 bg-base-200/50 overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <div className="text-center max-w-2xl mx-auto mb-12">

                    {/* Icon */}
                    {/* <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <FaQuoteLeft className="text-primary text-xl" />
                        </div>
                    </div> */}

                    {/* Testimonial Image */}
                    <div className="flex justify-center mb-5">
                        <img
                            src={testimonialImage}
                            alt="Customer testimonials"
                            className="w-60 h-30 object-contain"
                        />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        What Our Customers Are Saying
                    </h2>

                    <p className="text-base-content/60">
                        Hear from our customers about their experience
                        with our fast, reliable, and hassle-free parcel
                        delivery service.
                    </p>
                </div>

                {/* Desktop Cards */}
                <div className="hidden md:grid grid-cols-3 gap-6 items-center max-w-6xl mx-auto">

                    {/* Previous */}
                    <TestimonialCard
                        testimonial={testimonialsData[previousIndex]}
                    />

                    {/* Active */}
                    <TestimonialCard
                        testimonial={testimonialsData[activeIndex]}
                        active={true}
                    />

                    {/* Next */}
                    <TestimonialCard
                        testimonial={testimonialsData[nextIndex]}
                    />

                </div>

                {/* Mobile Card */}
                <div className="md:hidden max-w-md mx-auto">
                    <TestimonialCard
                        testimonial={testimonialsData[activeIndex]}
                        active={true}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5 mt-8">

                    {/* Previous */}
                    <button
                        onClick={handlePrevious}
                        className="btn btn-circle btn-sm bg-base-100 border-base-200 hover:bg-primary hover:text-primary-content"
                        aria-label="Previous testimonial"
                    >
                        <FaArrowLeft />
                    </button>

                    {/* Dots */}
                    <div className="flex items-center gap-2">
                        {testimonialsData.map((testimonial, index) => (
                            <button
                                key={testimonial.id}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Go to testimonial ${index + 1}`}
                                className={`
                  rounded-full transition-all duration-300
                  ${activeIndex === index
                                        ? "w-6 h-2 bg-primary"
                                        : "w-2 h-2 bg-primary/30 hover:bg-primary/60"
                                    }
                `}
                            />
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        onClick={handleNext}
                        className="btn btn-circle btn-sm bg-primary text-primary-content border-none hover:bg-primary/80"
                        aria-label="Next testimonial"
                    >
                        <FaArrowRight />
                    </button>

                </div>

            </div>
        </section>
    );
};

export default Testimonials;