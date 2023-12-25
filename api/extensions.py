from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from keycloak import KeycloakOpenID


db = SQLAlchemy()
migrate = Migrate()

import api.constants.keycloakconstants as kcl
keycloak_client = KeycloakOpenID(
    server_url=kcl.KEYCLOAK_SERVER_URL,
    realm_name=kcl.KEYCLOAK_REALM_NAME,
    client_id=kcl.KEYCLOAK_CLIENT_ID,
    client_secret_key=kcl.KEYCLOAK_CLIENT_SECRET_KEY,
)
config_well_known = keycloak_client.well_known()
