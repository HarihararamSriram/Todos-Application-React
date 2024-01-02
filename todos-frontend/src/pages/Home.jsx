import Profile from '../components/Profile';
import StripeHeader from '../components/StripeHeader';
import TodoContainer from '../components/TodoContainer';
import TodoProvider from '../store/TodoProvider';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

function Home() {
    const { username, initialized, keycloak, accessToken } = useKeyCloakAuth();
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
    return (
        <ApolloProvider client={client}>
            {initialized && (
                <>
                    <StripeHeader keycloak={keycloak} />
                    <h1 style={{ textAlign: 'center' }}>Todos</h1>
                    <Profile keycloak={keycloak} initialized={initialized} />
                    {accessToken && (
                        <TodoProvider username={username}>
                            <TodoContainer />
                        </TodoProvider>
                    )}
                </>
            )}
        </ApolloProvider>
    );
}

function useKeyCloakAuth() {
    const { keycloak, initialized } = useKeycloak();

    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        if (initialized) {
            setAccessToken(keycloak.token);
        }
    }, [initialized, keycloak.token]);
    return {
        username: initialized && keycloak.tokenParsed.preferred_username,
        initialized,
        keycloak,
        accessToken,
    };
}

export default Home;
