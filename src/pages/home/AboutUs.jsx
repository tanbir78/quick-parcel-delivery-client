import React from "react";
import { Link } from 'react-router';
import {
    FaBullseye,
    FaEye,
    FaHandshake,
    FaUserShield,
    FaRoute,
    FaClipboardCheck,
    FaStore,
    FaUserFriends,
    FaHeart,
    FaLeaf,
    FaArrowRight,
    FaBoxOpen,
    FaCheckCircle,
    FaBalanceScale,
} from "react-icons/fa";

const missionVision = [
    {
        icon: <FaBullseye />,
        title: "Our Mission",
        description:
            "To make parcel delivery simpler through a convenient digital platform where customers can manage their deliveries with greater confidence.",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: <FaEye />,
        title: "Our Vision",
        description:
            "To build a dependable delivery ecosystem that connects people, merchants, and riders through a more transparent delivery experience.",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
];

const differences = [
    {
        icon: <FaRoute />,
        title: "A Clear Delivery Journey",
        description:
            "Parcel progress and delivery status help users understand where their parcel stands throughout the process.",
        color: "text-info",
        bg: "bg-info/10",
    },
    {
        icon: <FaStore />,
        title: "Built for Growing Businesses",
        description:
            "Merchants can use a centralized platform to organize parcel bookings and manage delivery information.",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: <FaUserFriends />,
        title: "A Connected Delivery Team",
        description:
            "Customers, administrators, and riders each have their own role in keeping delivery operations organized.",
        color: "text-success",
        bg: "bg-success/10",
    },
    {
        icon: <FaClipboardCheck />,
        title: "Accountable Operations",
        description:
            "Recorded parcel statuses and delivery updates help make the delivery process easier to follow.",
        color: "text-warning",
        bg: "bg-warning/10",
    },
];

const promises = [
    {
        icon: <FaUserShield />,
        title: "Respect Your Information",
        description:
            "We believe personal and delivery information should be handled responsibly.",
    },
    {
        icon: <FaBalanceScale />,
        title: "Keep Things Transparent",
        description:
            "Clear parcel statuses help users understand the progress of their deliveries.",
    },
    {
        icon: <FaHandshake />,
        title: "Take Responsibility",
        description:
            "Every delivery deserves careful coordination and clear communication.",
    },
    {
        icon: <FaHeart />,
        title: "Put People First",
        description:
            "Behind every parcel is a person waiting for something important.",
    },
];

const AboutUs = () => {
    return (
        <main className="overflow-hidden bg-base-100 text-base-content">
            {/* Page Introduction */}
            <section className="relative bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-4 py-20 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl text-primary shadow-sm">
                        <FaBoxOpen />
                    </div>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-primary">
                        Get to Know Us
                    </p>

                    <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
                        More Than Parcels,
                        <span className="block text-primary">
                            We Connect People.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-base-content/70 md:text-lg">
                        We believe parcel delivery should be organized, transparent,
                        and convenient. Our platform brings customers, merchants,
                        and delivery teams together to make every delivery journey
                        easier to manage.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <span className="badge badge-lg gap-2 border-0 bg-primary/10 px-4 py-4 text-primary">
                            <FaCheckCircle />
                            Transparency
                        </span>

                        <span className="badge badge-lg gap-2 border-0 bg-success/10 px-4 py-4 text-success">
                            <FaCheckCircle />
                            Responsibility
                        </span>

                        <span className="badge badge-lg gap-2 border-0 bg-secondary/10 px-4 py-4 text-secondary">
                            <FaCheckCircle />
                            Convenience
                        </span>
                    </div>
                </div>
            </section>

            {/* Mission and Vision */}
            <section className="px-4 py-16 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                            Our Purpose
                        </p>

                        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                            What We Believe In
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-base-content/60">
                            Our mission guides what we build today. Our vision
                            inspires what we want to build tomorrow.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {missionVision.map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-3xl border border-base-300 bg-base-100 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-9"
                            >
                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${item.bg} ${item.color} transition group-hover:rotate-6`}
                                >
                                    {item.icon}
                                </div>

                                <h3 className="mt-6 text-2xl font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-4 leading-8 text-base-content/70">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="bg-base-200 px-4 py-16 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                            Our Approach
                        </p>

                        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                            Thoughtfully Built for Delivery
                        </h2>

                        <p className="mt-4 leading-7 text-base-content/60">
                            We focus on the tools and processes that help people
                            manage parcels with greater clarity.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {differences.map((item, index) => (
                            <div
                                key={item.title}
                                className="flex gap-5 rounded-3xl border border-base-300 bg-base-100 p-6 transition duration-300 hover:border-primary/30 hover:shadow-lg md:p-8"
                            >
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${item.bg} ${item.color}`}
                                >
                                    {item.icon}
                                </div>

                                <div>
                                    <div className="text-xs font-bold tracking-widest text-base-content/40">
                                        FEATURE 0{index + 1}
                                    </div>

                                    <h3 className="mt-2 text-lg font-bold">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-base-content/70">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery Accountability */}
            <section className="px-4 py-16 md:py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                            Behind Every Delivery
                        </p>

                        <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Every Update Has a Purpose.
                        </h2>

                        <p className="mt-5 leading-8 text-base-content/70">
                            A parcel goes through different stages before reaching
                            its destination. Keeping those stages organized helps
                            customers and delivery teams stay on the same page.
                        </p>

                        <div className="mt-7 space-y-5">
                            {[
                                {
                                    title: "Organized Parcel Records",
                                    description:
                                        "Parcel details stay connected to the delivery process.",
                                },
                                {
                                    title: "Status-Based Progress",
                                    description:
                                        "Delivery stages make parcel progress easier to understand.",
                                },
                                {
                                    title: "Clear Delivery Outcomes",
                                    description:
                                        "The final delivery status helps communicate the outcome.",
                                },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-3">
                                    <FaCheckCircle className="mt-1 shrink-0 text-lg text-success" />

                                    <div>
                                        <h3 className="font-bold">{item.title}</h3>

                                        <p className="mt-1 text-sm leading-6 text-base-content/60">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative status card */}
                    <div className="rounded-[2rem] border border-base-300 bg-base-200 p-5 sm:p-8">
                        <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-base-content/50">
                                        Delivery workflow
                                    </p>

                                    <h3 className="mt-1 text-xl font-bold">
                                        A clearer journey
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-primary/10 p-3 text-2xl text-primary">
                                    <FaRoute />
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                {[
                                    {
                                        label: "Parcel Created",
                                        detail: "Details recorded",
                                        color: "bg-info",
                                    },
                                    {
                                        label: "Rider Assigned",
                                        detail: "Delivery arranged",
                                        color: "bg-success",
                                    },
                                    {
                                        label: "In Transit",
                                        detail: "Parcel on its journey",
                                        color: "bg-warning",
                                    },
                                    {
                                        label: "Delivered",
                                        detail: "Final status recorded",
                                        color: "bg-primary",
                                    },
                                ].map((step, index) => (
                                    <div
                                        key={step.label}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span
                                                className={`h-4 w-4 rounded-full ${step.color} ring-4 ring-base-200`}
                                            />

                                            {index !== 3 && (
                                                <span className="h-8 border-l-2 border-dashed border-base-300" />
                                            )}
                                        </div>

                                        <div className="flex flex-1 items-center justify-between gap-3">
                                            <div>
                                                <h4 className="font-semibold">
                                                    {step.label}
                                                </h4>

                                                <p className="mt-1 text-xs text-base-content/50">
                                                    {step.detail}
                                                </p>
                                            </div>

                                            <FaCheckCircle className="text-success" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 rounded-2xl bg-success/10 p-4 text-sm text-success">
                                <FaCheckCircle className="mr-2 inline" />
                                A well-organized delivery journey starts with clear
                                information.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Promises */}
            <section className="bg-base-200 px-4 py-16 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                            Our Promise
                        </p>

                        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                            The Principles Behind Our Work
                        </h2>

                        <p className="mt-4 leading-7 text-base-content/60">
                            The experience we aim to provide is guided by four
                            simple principles.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {promises.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-3xl border border-base-300 bg-base-100 p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                                    {item.icon}
                                </div>

                                <h3 className="mt-5 font-bold">{item.title}</h3>

                                <p className="mt-3 text-sm leading-7 text-base-content/60">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="px-4 py-16 md:py-20">
                <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-primary to-secondary p-8 text-center text-white shadow-xl md:p-14">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                        <FaHeart />
                    </div>

                    <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">
                        Let’s Make Every Delivery Count.
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">
                        Thank you for being part of our journey. We look forward
                        to helping you manage your next parcel.
                    </p>

                    <Link
                        className="btn mt-8 rounded-full border-0 bg-white px-7 text-primary hover:bg-white/90"
                        to='/login'>
                        Get Started <FaArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default AboutUs;