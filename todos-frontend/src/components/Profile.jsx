import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const { keycloak, initialized } = useKeycloak();

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const res = await axios.post('http://localhost:5000/login', {
    //                 access_token: keycloak.token,
    //                 username: 'Hari',
    //             });
    //             console.log(res);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     })();
    // }, []);
    if (!initialized) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>
                Welcome,{' '}
                {keycloak.authenticated ? keycloak.tokenParsed.name : 'Guest'}
            </h1>
        </div>
    );
};
export default Profile;
