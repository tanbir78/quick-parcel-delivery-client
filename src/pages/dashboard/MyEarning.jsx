import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaWallet,
    FaMoneyBillWave,
    FaClock,
    FaChartLine,
    FaCheckCircle,
} from "react-icons/fa";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import UseAxiosSecure from "../../hocks/UseAxiosSecure";

const MyEarining = () => {
    const axiosSecure = UseAxiosSecure();
    const [period, setPeriod] = useState("week");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["rider-earnings-summary"],
        queryFn: async () => {
            const res = await axiosSecure.get("/rider/earnings-summary");
            return res.data;
        },
    });

    const summary = data?.summary || {
        totalEarnings: 0,
        totalCashout: 0,
        pendingEarnings: 0,
        requestedCashout: 0,
        availableEarnings: 0,
    };

    const periods = [
        { key: "today", label: "Today" },
        { key: "week", label: "This Week" },
        { key: "month", label: "This Month" },
        { key: "year", label: "This Year" },
        { key: "overall", label: "Overall" },
    ];

    const chartData = useMemo(
        () => data?.analysis?.[period] || [],
        [data, period]
    );

    const money = (amount) =>
        new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);

    const cards = [
        {
            title: "Total Earnings",
            amount: summary.totalEarnings,
            description: "Lifetime earnings from completed deliveries",
            icon: <FaWallet />,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Total Cash Out",
            amount: summary.totalCashout,
            description: "Money already paid to you",
            icon: <FaMoneyBillWave />,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Pending Earnings",
            amount: summary.pendingEarnings,
            description: "Earnings not yet paid out",
            icon: <FaClock />,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
        {
            title: "Cash Out Requested",
            amount: summary.requestedCashout,
            description: "Waiting for admin approval/payment",
            icon: <FaCheckCircle />,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                Failed to load earnings: {error?.message || "Please try again."}
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div>
                <h2 className="text-2xl font-bold md:text-3xl">
                    My Earnings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Track your delivery income and cash-out history.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>
                                <h3 className="mt-2 text-2xl font-bold">
                                    {money(card.amount)}
                                </h3>
                            </div>

                            <div
                                className={`rounded-xl p-3 text-xl ${card.bg} ${card.color}`}
                            >
                                {card.icon}
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Available balance */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gray-900 p-6 text-white sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm text-gray-300">
                        Available for Cash Out
                    </p>
                    <h3 className="mt-2 text-3xl font-bold">
                        {money(summary.availableEarnings)}
                    </h3>
                    <p className="mt-2 text-xs text-gray-300">
                        Completed deliveries not yet requested for cash out
                    </p>
                </div>

                <div className="text-4xl text-green-400">
                    <FaChartLine />
                </div>
            </div>

            {/* Analysis */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h3 className="text-xl font-bold">
                            Earnings Analysis
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Explore your income over different periods.
                        </p>
                    </div>

                    <select
                        className="select select-bordered w-full md:w-44"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        {periods.map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 h-72 w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 12, left: 4, bottom: 4 }}
                            >
                                <defs>
                                    <linearGradient
                                        id="earningGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#16a34a"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#16a34a"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `৳${value}`}
                                />
                                <Tooltip
                                    formatter={(value) => [money(value), "Earnings"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    fill="url(#earningGradient)"
                                    connectNulls
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                            No earnings data available for this period.
                        </div>
                    )}
                </div>
            </div>

            {/* Period summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-base-300 p-5">
                    <p className="text-sm text-gray-500">
                        {periods.find((p) => p.key === period)?.label} Earnings
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                        {money(data?.totalsByPeriod?.[period] || 0)}
                    </h3>
                </div>

                <div className="rounded-xl border border-base-300 p-5">
                    <p className="text-sm text-gray-500">Completed Deliveries</p>
                    <h3 className="mt-2 text-2xl font-bold">
                        {summary.completedDeliveries || 0}
                    </h3>
                </div>

                <div className="rounded-xl border border-base-300 p-5">
                    <p className="text-sm text-gray-500">Average per Delivery</p>
                    <h3 className="mt-2 text-2xl font-bold">
                        {money(summary.averagePerDelivery || 0)}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default MyEarining;