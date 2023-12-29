import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';


const keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'myrealm',
    clientId: 'react_app',
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{ onLoad: 'login-required' }}
    >
        <App />
    </ReactKeycloakProvider>,
);
