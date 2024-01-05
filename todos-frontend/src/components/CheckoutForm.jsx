import { useContext, useEffect, useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SET_USER_PREMIUM } from '../store/TodoQueries';
import TodoContext from '../store/Todo-Context';

function CheckoutForm({ isCheckoutFormVisible }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { username } = useContext(TodoContext);
    const [setUserPremium, { data, loadingSetPrem, error }] = useMutation(
        SET_USER_PREMIUM,
        { variables: { username: username } },
    );

    const paymentElementOptions = {
        layout: 'tabs',
    };

    useEffect(() => {
        //? This effect runs when our loading status of our Mutation to Premium State CHANGE ITS 'loading' state and 'data'.
        // After successful mutation, there is data and loading is false for the mutation.
        if (!loadingSetPrem && data) {
            navigate('/successful-payment');
        }
    }, [loadingSetPrem, data]);

    useEffect(() => {
        if (!stripe || !elements) return;

        //* There will be a URL parameter with VALID client secret of the `PaymentIntent` after completion in the redirection link.
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret',
        );

        if (!clientSecret) {
            return;
        }

        //? This code executes post the completion of transaction. After transaction, we *extract* the `PaymentIntent` object and check the *status*.
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case 'succeeded': {
                    setUserPremium();
                    break;
                }
                case 'processing':
                    setMessage('Your payment is processing.');
                    break;
                case 'requires_payment_method': {
                    setMessage(
                        'Your payment was not successful, please try again.',
                    );
                    break;
                }
                default:
                    setMessage('Something went wrong.');
                    break;
            }
            console.log(paymentIntent.status);
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:5173/checkout',
            },
        });
        console.error(error);
    };

    return (
        <>
            {isCheckoutFormVisible && (
                <form onSubmit={handleSubmit}>
                    <PaymentElement options={paymentElementOptions} />
                    <button
                        disabled={isLoading || !stripe || !elements}
                        style={{
                            padding: '1.5rem 1rem',
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'transparent',
                            borderRadius: '1.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        {isLoading ? 'Loading...' : 'Pay Now'}
                    </button>
                    {message && <div id="payment-message">{message}</div>}
                </form>
            )}
        </>
    );
}

export default CheckoutForm;
