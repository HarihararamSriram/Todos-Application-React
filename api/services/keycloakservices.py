from api.extensions import keycloak_client


class KeycloakClientService:
    @classmethod
    def login_user(cls, data):
        token = keycloak_client.token(
            username=data.get("username"),
            password=data.get("password"),
        )
        return token
