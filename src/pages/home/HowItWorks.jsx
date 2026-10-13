import howItWorksData from "../../data/howItWorks.json";
import HowItWorksCard from "./HowItWorksCard";

const HowItWorks = () => {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <div className="mb-6">

                    <h2 className="text-2xl md:text-3xl font-bold">
                        How It Works
                    </h2>

                    {/* Small Line */}
                    <div className="mt-3 w-full border-t border-primary/30"></div>

                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {howItWorksData.map((item) => (
                        <HowItWorksCard
                            key={item.id}
                            item={item}
                        />
                    ))}

                </div>

            </div>
        </section>
    );
};

export default HowItWorks;