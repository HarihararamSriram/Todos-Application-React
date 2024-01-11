import './App.css';
import { Outlet } from 'react-router-dom';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
    useQuery,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import TodoProvider from './store/TodoProvider';
import { GET_USER } from './store/TodoQueries';

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

function App() {
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
            {initialized && <AppMain keycloak={keycloak} username={username} />}
        </ApolloProvider>
    );
}

function AppMain({ keycloak, username }) {
    //? The very First GraphQL query to BACKEND that is used to get the User details from the DB.
    const { loading, error, data } = useQuery(GET_USER, {
        variables: { username: username },
    });
    if (loading) return <div style={{ textAlign: 'center' }}>Loading...</div>;
    if (error) {
        console.log(error);
        return <div style={{ textAlign: 'center' }}>Error...</div>;
    }
    const { user } = data;

    return (
        <TodoProvider user={user}>
            <main>
                <Outlet context={{ keycloak, username, user }} />
            </main>
        </TodoProvider>
    );
}

function useKeyCloakAuth() {
    const { keycloak, initialized } = useKeycloak();
    const username = initialized && keycloak.tokenParsed.preferred_username;

    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        if (initialized) {
            setAccessToken(keycloak.token);
        }
    }, [initialized, keycloak.token]);

    return {
        username: username,
        initialized,
        keycloak,
        accessToken,
    };
}

export default App;
