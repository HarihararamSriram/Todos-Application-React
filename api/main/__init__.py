from flask import Blueprint

bp = Blueprint('main', __name__, static_folder="./api/static/uploads/")

# Routes belonging to this blueprint
from api.main import routes