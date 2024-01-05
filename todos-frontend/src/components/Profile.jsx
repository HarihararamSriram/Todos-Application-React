const Profile = ({ keycloak}) => {
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
