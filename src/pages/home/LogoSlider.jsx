import React from "react";
import Marquee from "react-fast-marquee";

import logo1 from "../../assets/brands/amazon.png";
import logo2 from "../../assets/brands/amazon_vector.png";
import logo3 from "../../assets/brands/casio.png";
import logo4 from "../../assets/brands/moonstar.png";
import logo5 from "../../assets/brands/randstad.png";
import logo6 from "../../assets/brands/star.png";
import logo7 from "../../assets/brands/start_people.png";

const LogoSlider = () => {
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

    const MarqueeComponent = Marquee.default || Marquee; // FIX

    return (
        <section className="py-16 bg-base-100">

            <div className="max-w-7xl mx-auto px-4 text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold">
                    We've helped thousands of sales teams
                </h2>
            </div>

            <MarqueeComponent
                speed={50}
                gradient={false}
                pauseOnHover={true}
            >
                {logos.map((logo, index) => (
                    <div key={index} className="mx-8">
                        <img
                            src={logo}
                            alt="client logo"
                            className="h-6 md:h-6 object-contain transition duration-300"
                        />
                    </div>
                ))}
            </MarqueeComponent>

        </section>
    );
};

export default LogoSlider;