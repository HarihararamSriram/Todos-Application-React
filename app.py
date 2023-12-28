from api import create_app, db
import api.models
from flask_cors import CORS


app = create_app()
CORS(app)