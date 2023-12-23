from api import db
from sqlalchemy.sql import func


class Image(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    file_name = db.Column(db.String(1000), nullable=False)
    time_stamp = db.Column(db.DateTime(timezone=True), server_default=func.now())

    # One Todo, many images
    todo_id = db.Column(db.Integer, db.ForeignKey("todos.id"), nullable=False)

    def __repr__(self):
        return f"<Image(id={self.id}, file_name={self.file_name}, time_stamp={self.time_stamp}, todo_id={self.todo_id})>"
