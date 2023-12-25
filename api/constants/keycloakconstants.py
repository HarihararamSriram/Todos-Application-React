import os
KEYCLOAK_SERVER_URL = os.getenv(
    "KEYCLOAK_SERVER_URL", "http://localhost:8080/auth"
)
KEYCLOAK_REALM_NAME = os.getenv("KEYCLOAK_REALM_NAME", "myrealm")
# client
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "flask_app")
KEYCLOAK_CLIENT_SECRET_KEY = os.getenv(
    "KEYCLOAK_CLIENT_SECRET_KEY", "i0oNPLGOqMmqk7uCKgmuWVvou6bs6uTA"
)
