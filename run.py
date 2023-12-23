from app import app
from api import db


if __name__ == "__main__":
    app.run()
    print(db.engine)