import { useState } from 'react';
import styles from './StripeHeader.module.css';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

function StripeHeader({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const paymentElementOptions = {
        layout: 'tabs',
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case 'succeeded':
                    setMessage('Payment succeeded!');
                    break;
                case 'processing':
                    setMessage('Your payment is processing.');
                    break;
                case 'requires_payment_method':
                    setMessage(
                        'Your payment was not successful, please try again.',
                    );
                    break;
                default:
                    setMessage('Something went wrong.');
                    break;
            }
            console.log(paymentIntent.status);
        });
    };

    return (
        <header className={styles['strip-btn-header']}>
            <form onSubmit={handleSubmit}>
                {/* <PaymentElement options={paymentElementOptions} /> */}
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
        </header>
    );
}

export default StripeHeader;
