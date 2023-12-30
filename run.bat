docker-compose -f docker-compose-keycloak22.yml up -d
cd todos-frontend
start cmd.exe /k npm start
cd ..
python run.py