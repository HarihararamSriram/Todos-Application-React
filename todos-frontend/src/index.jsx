import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'myrealm',
    clientId: 'react_app',
});

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{ onLoad: 'login-required' }}
    >
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </ReactKeycloakProvider>,
);

export default client;
