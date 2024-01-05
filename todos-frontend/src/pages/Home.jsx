import Profile from '../components/Profile';
import StripeHeader from '../components/StripeHeader';
import TodoContainer from '../components/TodoContainer';
import { useOutletContext } from 'react-router-dom';

function Home() {
    const { keycloak, user} = useOutletContext();
    const { isPremium } = user;
    return (
        <>
            {!isPremium && <StripeHeader keycloak={keycloak} />}
            <h1 style={{ textAlign: 'center' }}>Todos</h1>
            <Profile keycloak={keycloak} />
                <TodoContainer />
        </>
    );
}

export default Home;
