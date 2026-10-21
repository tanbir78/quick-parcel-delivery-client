import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import UseAxiosSecure from '../../hocks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import UseAuth from '../../hocks/UseAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../hocks/useTrackingLogger';

const PaymentForm = () => {
    const { logTracking } = useTrackingLogger();
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = UseAxiosSecure();
    const [error, setError] = useState('');
    const { parcelId } = useParams();
    const user = UseAuth();
    // console.log(parcelId);

    const { data: parcel, isLoading } = useQuery({
        queryKey: ['parcel', parcelId],
        enabled: !!parcelId,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data.data;
        },
    });
    if (isLoading) {
        return <p className="text-center mt-10">Loading parcel...</p>;
    }
    // console.log(parcel);
    const amount = parcel.deliveryCost;
    const amountInCents = amount * 100;


    const handleSubmit = async e => {
        e.preventDefault();
        if (!stripe || !elements)
            return;

        const card = elements.getElement(CardElement);
        if (!card)
            return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) setError(error.message);
        else {
            setError('');
            console.log('payment method', paymentMethod);

            // Create PaymentIntent
            const res = await axiosSecure.post(
                "/create-payment-intent",
                { parcelId }
            );

            const clientSecret = res.data.clientSecret;

            // Confirm payment ONLY ONCE
            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card,
                        billing_details: {
                            name: user?.displayName || "Customer",
                            email: user?.email,
                        },
                    },
                });

            if (stripeError) {
                setError(stripeError.message);
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                // Save payment history in backend
                const paymentRes = await axiosSecure.post("/payments", {
                    parcelId,
                    transactionId: paymentIntent.id,
                });

                if (paymentRes.data.success) {
                    console.log("Payment history saved successfully");

                    // parcel track
                    await logTracking({
                        parcelId: parcel._id,
                        trackingId: parcel.trackingId,
                        status: "paid",
                        title: "Payment Completed",
                        description: "Payment has been confirmed.",
                    });

                    Swal.fire({
                        icon: "success",
                        title: "Payment Successful!",
                        html: `
            <p>Your payment has been completed successfully.</p>
            <p style="margin-top: 12px;">
                <strong>Transaction ID:</strong>
            </p>
            <p style="overflow-wrap: anywhere;">
                ${paymentIntent.id}
            </p>
        `,
                        confirmButtonText: "Done",
                        confirmButtonColor: "#16a34a",
                    });
                }
            } else {
                setError(
                    `Payment status: ${paymentIntent?.status || "unknown"}`
                );
            }

            console.log("res from intent", res);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md  mx-auto'>
                <CardElement className='p-2 border rounded'>
                </CardElement>
                <button type='submit' className='btn btn-primary w-full'
                    disabled={!stripe}>
                    Pay ${amount} For Parcel Pickup
                </button>
                {error && (
                    <p role="alert" className="text-sm text-error">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default PaymentForm;