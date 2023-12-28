import os
KEYCLOAK_SERVER_URL = os.getenv(
    "KEYCLOAK_SERVER_URL", "http://localhost:8080/auth"
)
KEYCLOAK_REALM_NAME = os.getenv("KEYCLOAK_REALM_NAME", "myrealm")
# client
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "flask_app")
KEYCLOAK_INTROSPECTION_URL = os.getenv("KEYCLOAK_INTROSPECTION_URL", "http://localhost:8080/realms/myrealm/protocol/openid-connect/token/introspect")
KEYCLOAK_CLIENT_SECRET_KEY = os.getenv(
    "KEYCLOAK_CLIENT_SECRET_KEY", "Du6yh2Ipbgd7vQFKiVCh20TiIYL3nufK"
)
