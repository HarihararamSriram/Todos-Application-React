import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
    SECRET_KEY = '4a80fc40f2a2aeb3903576ac7babbee144bcdda4c0de0da2278241ca19589801'
    # http://keycloakhost:keycloakport/realms/{realm}/.well-known/openid-configuration
    OIDC_REDIRECT_URI = "http://localhost:5000/redirect_uri"
    UPLOAD_FOLDER = os.path.join(basedir, './api/static/uploads')
