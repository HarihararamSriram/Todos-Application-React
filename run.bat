docker-compose -f docker-compose-keycloak22.yml up -d
python run.py
cd todos-frontend && npm start