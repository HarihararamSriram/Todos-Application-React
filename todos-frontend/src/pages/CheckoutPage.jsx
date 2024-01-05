import CheckoutForm from '../components/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Navigate } from 'react-router-dom';

const stripePromise = loadStripe(
    'pk_test_51OSYrmSJzGbMUzSAz6B0Z23PaO8fcl29T6htjT3igW9VvKjzlzDjFJBHdXrTwIFpcMoeF61eiLp46130VDuVz5Tr002KZ1tJBX',
);
function CheckoutPage() {
    //? Secret we get after Payment; this will be useful for checking Intent Status after payment
    let isCheckoutFormVisible = true;
    const stripeClientSecretAfterPayment = new URLSearchParams(
        window.location.search,
    ).get('payment_intent_client_secret');
    if(stripeClientSecretAfterPayment)
        isCheckoutFormVisible = false;

    //? The Same secret we get before Payment
    const stripeClientSecretBeforePayment = new URLSearchParams(
        window.location.search,
    ).get('stripeClientSecret');

    const stripeClientSecret = stripeClientSecretAfterPayment
        ? stripeClientSecretAfterPayment
        : stripeClientSecretBeforePayment;

    //? If we don't have either of this, then user is redirected back to home page.
    if (!stripeClientSecret) {
        //? To redirect to 'home' page when you directly access it.
        return <Navigate to="/" replace={true} />;
    }
    //? We need to set the options to `Element` after `stripeClientSecret` is loaded, hence we use the below variable
    

    const stripeOptions = {
        clientSecret: stripeClientSecret,
        appearance: {
            theme: 'night',
        },
    };
    const stripeClientSecretLoaded =
        stripeClientSecret && stripeClientSecret.trim().length > 0;
    return (
        <>
            {stripeClientSecretLoaded && (
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <CheckoutForm isCheckoutFormVisible={isCheckoutFormVisible} />
                </Elements>
            )}
        </>
    );
}

export default CheckoutPage;
