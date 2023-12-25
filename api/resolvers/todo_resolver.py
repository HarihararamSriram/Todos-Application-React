from ariadne import convert_kwargs_to_snake_case
from api import db
from api.models import Todo, User
from datetime import datetime


def resolve_todos(obj, _):
    # Get all todos
    try:
        todos = Todo.query.all()
        payload = {
            "success": True,
            "todos": todos
        }
    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@convert_kwargs_to_snake_case
def resolve_todo(obj, _, todo_id):
    # Get a single todo
    try:
        todo = Todo.query.get(todo_id)
        if (todo is None):
            payload = {
                "success": False,
                "errors": f"Todo with id {todo_id}, doesn't exist"
            }
        else:
            payload = {
                "success": True,
                "todo": todo.to_dict()
            }

    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@convert_kwargs_to_snake_case
def resolve_create_todo(obj, _, title, due_time, user_name, description=None):
    # Add a todo
    try:
        # Converting the Javascript Datetime to Python datetime.datetime object for `due_time`
        due_time = datetime.strptime(
            '2022-01-08T19:00:00.123Z', '%Y-%m-%dT%H:%M:%S.%fZ')
        user = User.query.filter(User.user_name == user_name).first()
        todo = Todo(title=title, description=description, due_time=due_time)
        user.todos.append(todo)
        db.session.commit()
        db.session.refresh(todo)
        payload = {
            "success": True,
            "todo": todo.to_dict()
        }
    except Exception as e:  # date format errors
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@convert_kwargs_to_snake_case
def resolve_delete_todo(obj, _, todo_id):
    # Delete a todo
    try:
        todo = Todo.query.get(todo_id)
        if (todo is None):
            payload = {
                "success": False,
                "errors": f"Todo with id {todo_id}, doesn't exist"
            }
        else:
            db.session.delete(todo)
            db.session.commit()
            payload = {"success": True}
    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@convert_kwargs_to_snake_case
def resolve_mark_todo(obj, _, todo_id):
    # Marking todo compeltion
    try:
        todo = Todo.query.get(todo_id)
        if (todo is None):
            payload = {
                "success": False,
                "errors": f"Todo with id {todo_id}, doesn't exist"
            }
        else:
            # Marking todo done if not done and vice-versa
            todo.completed = not todo.completed
            db.session.commit()
            db.session.refresh(todo)
            payload = {
                "success": True,
                "todo": todo.to_dict()
            }
    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@convert_kwargs_to_snake_case
def resolve_update_todo(obj, _, todo_id, **attributes):
    # Marking todo compeltion
    try:
        todo = Todo.query.get(todo_id)
        if (todo is None):
            payload = {
                "success": False,
                "errors": f"Todo with id {todo_id}, doesn't exist"
            }
        else:
            for k, v in attributes.items():
                setattr(todo, k, v)
            db.session.commit()
            db.session.refresh(todo)
            payload = {
                "success": True,
                "todo": todo.to_dict()
            }
    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload
