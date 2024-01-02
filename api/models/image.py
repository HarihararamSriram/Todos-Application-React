from api import db
from sqlalchemy.sql import func
from sqlalchemy.event import listens_for
from pathlib import Path


class Image(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    file_name = db.Column(db.String(1000), nullable=False)

    # One Todo, many images
    todo_id = db.Column(db.Integer, db.ForeignKey("todos.id"), nullable=False)

    def __repr__(self):
        return f"<Image(id={self.id}, file_name={self.file_name}, todo_id={self.todo_id})>"


# Delete image file after Database record deletion.
@listens_for(Image, "after_delete")
def delete_image_file(mapper, connection, target):
    image_path = Path("./api/static/uploads").joinpath(target.file_name)
    image_path.unlink(missing_ok=True)
