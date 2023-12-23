from api import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    user_name = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(500), nullable=False)

    # One user, many todos
    todos = db.relationship('Todo', backref='user', lazy=True)

    def __repr__(self):
        return f"<User(id={self.id},user_name={self.user_name}, email={self.email})>"
