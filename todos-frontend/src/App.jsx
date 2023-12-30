import './App.css';
import TodoContainer from './components/TodoContainer';
import TodoProvider from './store/TodoProvider';
import { setContext } from '@apollo/client/link/context';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
} from '@apollo/client';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeHeader from './StripeHeader';
import axios from 'axios';

const stripePromise = loadStripe(
    'pk_test_51OSYrmSJzGbMUzSAz6B0Z23PaO8fcl29T6htjT3igW9VvKjzlzDjFJBHdXrTwIFpcMoeF61eiLp46130VDuVz5Tr002KZ1tJBX',
);

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

function App() {
    const { keycloak, initialized } = useKeycloak();

    const [accessToken, setAccessToken] = useState(null);
    const [stripeClientSecret, setStripeClientSecret] = useState('');

    const loadData = async () => {
        const intentEndpoint =
            'http://localhost:5000/stripe/create-payment-intent';

        try {
            const username = keycloak.tokenParsed.preferred_username;
            const response = await axios.post(intentEndpoint, {
                items: [{ id: 'premium' }],
                username: username,
            });
            setStripeClientSecret(response.data.clientSecret);
        } catch (e) {
            console.log(
                '>> PaymentIntent failed; Failed to get client secret from intent ',
                e,
            );
        }
    };

    useEffect(() => {
        if (initialized) loadData();
    }, [initialized]);

    useEffect(() => {
        if (initialized) {
            setAccessToken(keycloak.token);
        }
    }, [initialized, keycloak.token]);

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
        };
    });

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
    const stripeOptions = {
        clientSecret: stripeClientSecret,
        appearance: {
            theme: 'night',
        },
    };
    //? We need to set the options to `Element` after `stripeClientSecret` is loaded, hence we use the below variable
    const stripeClientSecretLoaded = stripeClientSecret.trim().length > 0;
    return (
        <>
            {initialized && stripeClientSecretLoaded && (
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <ApolloProvider client={client}>
                        <main>
                            <StripeHeader clientSecret={stripeClientSecret} />
                            <h1 style={{ textAlign: 'center' }}>Todos</h1>
                            <Profile
                                keycloak={keycloak}
                                initialized={initialized}
                            />
                            {accessToken && (
                                <TodoProvider
                                    username={
                                        keycloak.tokenParsed.preferred_username
                                    }
                                >
                                    <TodoContainer
                                        username={
                                            keycloak.tokenParsed
                                                .preferred_username
                                        }
                                    />
                                </TodoProvider>
                            )}
                        </main>
                    </ApolloProvider>
                </Elements>
            )}
        </>
    );
}

export default App;
