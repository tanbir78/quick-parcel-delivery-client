import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa6';
import UseAxiosSecure from '../../hocks/UseAxiosSecure';
import UseAuth from '../../hocks/UseAuth';

const PaymentHistory = () => {
    const axiosSecure = UseAxiosSecure();
    const authData = UseAuth();
    const user = authData?.user || authData;

    const { data: payments = [], isLoading, isError } = useQuery({
        queryKey: ['payment-history', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/payments?email=${encodeURIComponent(user.email)}`
            );
            return res.data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center mt-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-center text-error mt-10">
                Failed to load payment history.
            </p>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Payment History
            </h2>

            <div className="stats stats-vertical md:stats-horizontal shadow w-full mb-6">
                <div className="stat">
                    <div className="stat-figure text-success">
                        <FaMoneyBillWave className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Payments</div>
                    <div className="stat-value text-success">
                        {payments.length}
                    </div>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="text-center py-12 bg-base-200 rounded-xl">
                    <FaBoxOpen className="text-5xl text-base-content/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">
                        No Payment History
                    </h3>
                    <p className="text-base-content/70 mt-2">
                        Your completed payments will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Paid At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <th>{index + 1}</th>

                                    <td>
                                        <span
                                            className="font-mono text-xs break-all"
                                            title={payment.transactionId}
                                        >
                                            {payment.transactionId}
                                        </span>
                                    </td>

                                    <td className="font-semibold">
                                        {(payment.amount / 100).toFixed(2)}{' '}
                                        {payment.currency?.toUpperCase()}
                                    </td>

                                    <td>
                                        {payment.paymentMethod || 'Stripe'}
                                    </td>

                                    <td>
                                        <span className="badge badge-success">
                                            {payment.paymentStatus}
                                        </span>
                                    </td>

                                    <td>
                                        {payment.paidAt
                                            ? new Date(payment.paidAt).toLocaleString()
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
