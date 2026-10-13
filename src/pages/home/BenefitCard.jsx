const BenefitCard = ({ benefit }) => {
    return (
        <div className="card bg-base-100 rounded-[24px] shadow-md">
            <div className="card-body px-10 py-8">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">

                    {/* Image */}
                    <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-[150px] h-[150px] object-contain shrink-0"
                    />

                    {/* Divider */}
                    <div className="hidden md:block h-28 border-r border-dashed border-base-content/40"></div>

                    {/* Content */}
                    <div className="flex-1 md:pl-2">
                        <h3 className="text-2xl font-bold text-primary mb-3">
                            {benefit.title}
                        </h3>

                        <p className="text-base leading-8 text-base-content/70 max-w-4xl">
                            {benefit.description}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BenefitCard;