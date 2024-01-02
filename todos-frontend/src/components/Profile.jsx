const Profile = ({ keycloak, initialized }) => {
    if (!initialized) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>
                Welcome,{' '}
                {keycloak.authenticated ? keycloak.tokenParsed.name : 'Guest'}
                {/* {' @'}
                {keycloak.authenticated
                    ? keycloak.tokenParsed.preferred_username
                    : ''} */}
            </h2>
        </div>
    );
};
export default Profile;
