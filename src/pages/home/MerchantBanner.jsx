import waveImage from "../../assets/2b.png";
import parcelImage from "../../assets/2a.png";

const MerchantBanner = () => {
    return (
        <section data-aos='zoom-in-up' className="py-20">
            <div className="bg-[#03373D] rounded-4xl overflow-hidden relative">

                {/* Top Decoration */}
                <img
                    src={waveImage}
                    alt=""
                    className="absolute top-0 left-0 w-full pointer-events-none"
                />

                <div className="grid lg:grid-cols-2 gap-10 items-center px-8 md:px-14 py-12">

                    {/* Left Content */}
                    <div>
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-6">
                            Merchant and Customer Satisfaction
                            is Our First Priority
                        </h2>

                        <p className="text-white/80 max-w-lg mb-8">
                            We offer the lowest delivery charge with the highest value
                            along with 100% safety of your product. Pathao courier
                            delivers your parcels in every corner of Bangladesh right
                            on time.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="btn bg-[#CAEB66] hover:bg-lime-400 border-0 text-black rounded-full px-8">
                                Become a Merchant
                            </button>

                            <button className="btn btn-outline border-[#CAEB66] text-[#CAEB66] hover:bg-lime-300 hover:text-black rounded-full px-8">
                                Earn with ZapShift Courier
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={parcelImage}
                            alt="Parcel Illustration"
                            className="w-[400px] max-w-full"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MerchantBanner;