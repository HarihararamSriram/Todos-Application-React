import styles from './Stripe.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StripeHeader({ keycloak }) {
    const navigate = useNavigate();
    const loadData = async () => {
        const intentEndpoint =
            'http://localhost:5000/stripe/create-payment-intent';

        try {
            const username = keycloak.tokenParsed.preferred_username;
            const response = await axios.post(intentEndpoint, {
                items: [{ id: 'premium' }],
                username: username,
            });
            return response.data.clientSecret;
        } catch (e) {
            console.log(
                '>> PaymentIntent failed; Failed to get client secret for intent from server',
                e,
            );
        }
    };

    const premBtnHandler = () => {
        loadData().then((stripeClientSecret) => {
            const url = new URL('checkout', window.location.origin);
            url.searchParams.append('stripeClientSecret', stripeClientSecret);
            navigate(`${url.pathname}${url.search}`);
        });
    };
    return (
        <header className={styles['prem-btn-header']}>
            <div className={styles['prem-btn-wrppr']}>
                <button onClick={premBtnHandler} className={styles['prem-btn']}>
                    Purchase Premium
                </button>
            </div>
        </header>
    );
}

export default StripeHeader;
