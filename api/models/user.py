from api import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    user_name = db.Column(db.String(50), unique=True, nullable=False)

    # One user, many todos
    todos = db.relationship('Todo', backref='user', lazy=True)

    def to_dict(self):
        return {
            "user_name": self.user_name,
            'todos': [todo.to_dict() for todo in self.todos]
        }

    def __repr__(self):
        return f"<User(id={self.id})>"
