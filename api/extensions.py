import api.constants.keycloakconstants as kcl
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from keycloak import KeycloakOpenID, KeycloakOpenIDConnection, KeycloakAdmin

db = SQLAlchemy()
migrate = Migrate()


keycloak_client = KeycloakOpenID(
    server_url=kcl.KEYCLOAK_SERVER_URL,
    realm_name=kcl.KEYCLOAK_REALM_NAME,
    client_id=kcl.KEYCLOAK_CLIENT_ID,
    client_secret_key=kcl.KEYCLOAK_CLIENT_SECRET_KEY,
)
config_well_known = keycloak_client.well_known()

""" keycloak_connection = KeycloakOpenIDConnection(
    server_url=kcl.KEYCLOAK_URL,
    username='admin',
    password='admin',
    # The realm to which you want ADMIN access using admin account from `user_realm_name` realm
    realm_name="myrealm",
    # The realm to which 'admin' named user belongs
    user_realm_name="master",
    client_id="my_client",
    client_secret_key="client-secret",
    verify=True) """

keycloak_admin = KeycloakAdmin(
    server_url=kcl.KEYCLOAK_URL,
    username=kcl.KEYCLOAK_ADMIN_USERNAME,
    password=kcl.KEYCLOAK_ADMIN_PASSWORD,
    # The realm to which you want ADMIN access using admin account from `user_realm_name` realm
    realm_name="myrealm",
    # The realm to which 'admin' named user belongs
    user_realm_name="master",
    verify=True
)
