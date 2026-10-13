import BenefitCard from "./BenefitCard";
import { benefits } from "./benefitsData";

const Benefits = () => {
    return (
        <section className="py-20 bg-base-200">
            <div className="container mx-auto px-4">

                {/* Top Dashed Line */}
                <div className="border-t border-dashed border-base-content/50 mb-16"></div>

                <div className="text-center mb-12">
                    <h2 className="text-4xl text-primary font-bold mb-4">
                        Why Choose Us
                    </h2>

                    <p className="max-w-2xl mx-auto text-base-content/70">
                        Experience reliable delivery services backed by
                        real-time tracking, secure handling, and dedicated
                        customer support.
                    </p>
                </div>

                <div className="space-y-8">
                    {benefits.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            benefit={benefit}
                        />
                    ))}
                </div>

                {/* Bottom Dashed Line */}
                <div className="border-t border-dashed border-base-content/50 mt-16"></div>
            </div>
        </section>
    );
};

export default Benefits;