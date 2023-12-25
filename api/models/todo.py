from sqlalchemy.sql import func, false
from datetime import datetime
from api import db


class Todo(db.Model):
    __tablename__ = 'todos'

    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    due_time = db.Column(db.DateTime(timezone=True), nullable=False)
    completed = db.Column(db.Boolean(), server_default=false())
    time_stamp = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    # One Todo, many images
    images = db.relationship("Image", backref="todo", lazy=True)
    # One user, many todos
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "due_time": self.due_time,
            "completed": self.completed,
        }

    def __repr__(self):
        return f"<Todo(id={self.id}, title={self.title}, description={self.description}, user_id={self.user_id})>"
