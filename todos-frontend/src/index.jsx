import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/checkout',
                element: <CheckoutPage />,
            },
        ],
    },
    {
        path: '/successful-payment',
        element: <SuccessPage />,
    },
]);

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
        <RouterProvider router={router} />
    </ReactKeycloakProvider>,
);
