# Todos Application

## Stack
React Flask/GraphQL Application with OIDC support from KeyCloak IDP; Payments through Stripe
Database used: SQLite

## To install the dependencies

Execute `install.bat`

Python dependencies can be found in `requirements.txt` and Frontend React App dependencies in `todos-frontend/package.json`

## To run the application

Execute the `run.bat` file that runs the following commands:

1) Keycloak IDP server
2) Python Flask GraphQL API
3) React Frontend

## Progress 📈

✅ Completed the backend authorized graphql endpoints

✅ `flask-sqlalchemy` ORM models have been used for creating database models on SQLite Databases, powered by Alembic schema migrations for schema updates.

✅ Completed the keycloak configuration and integration with both frontend and backend. An access token from front-end client is required as Bearer Token for accessing backend GraphQL endpoints.

✅ Completed the frontend Todos UI and client-side logic for CRUD operations on TODO and integration with backend graphql endpoints.

✅ Premium feature Stripe Payment and image upload functionality for paid users.

>Please checkout the **TEST** payment credentials and keycloak credentials in the file: `./keycloak_config/credentials.txt`

Completed on all the requirements.
