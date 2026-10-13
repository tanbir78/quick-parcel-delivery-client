import React from "react";
import ServiceCard from "./ServiceCard";
import services from "../../data/services.json";

// React Icons
import {
    FaShippingFast,
    FaTruck,
    FaBoxes,
    FaMoneyBillWave,
    FaBuilding,
    FaUndo,
} from "react-icons/fa";

const icons = [
    FaShippingFast,
    FaTruck,
    FaBoxes,
    FaMoneyBillWave,
    FaBuilding,
    FaUndo,
];

const Services = () => {
    return (
        <section className="py-16 bg-base-200 bg-blue-100">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our Services
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-500">
                        Enjoy fast, reliable parcel delivery with real-time tracking and
                        zero hassle. From personal packages to business shipments — we
                        deliver on time, every time.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            Icon={icons[index]}
                            title={service.title}
                            description={service.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;