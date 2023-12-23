from flask import Blueprint

bp = Blueprint('main', __name__)

# Routes belonging to this blueprint
from api.main import routes