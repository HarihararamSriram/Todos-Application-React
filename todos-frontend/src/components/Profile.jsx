const Profile = ({ keycloak, initialized }) => {
    if (!initialized) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>
                Welcome,{' '}
                {keycloak.authenticated ? keycloak.tokenParsed.name : 'Guest'}
                {/* {' @'}
                {keycloak.authenticated
                    ? keycloak.tokenParsed.preferred_username
                    : ''} */}
            </h1>
        </div>
    );
};
export default Profile;
