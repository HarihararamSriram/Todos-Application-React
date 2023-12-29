from ariadne import convert_kwargs_to_snake_case
from api import db
from api.models import Todo, User
from datetime import datetime


def resolve_todos(obj, _):
    # Get all todos
    todos = Todo.query.all()

    return {
        "data": todos
    }


@convert_kwargs_to_snake_case
def resolve_todo(obj, _, todo_id):
    # Get a single todo
    todo = Todo.query.get(todo_id)
    if (todo is None):
        raise Exception(f"Todo with id {todo_id}, doesn't exist")
    else:
        return {
            "data": todo.to_dict()
        }


@convert_kwargs_to_snake_case
def resolve_create_todo(obj, _, title, due_time, user_name, description=None):
    # Add a todo
    
    # Converting the Javascript Datetime to Python datetime.datetime object for `due_time`
    due_time = datetime.strptime(due_time, '%Y-%m-%dT%H:%M')
    user = User.query.filter(User.user_name == user_name).first()
    if(user is None):
        # Create a new user when user doesn't exist.
        user = User(user_name=user_name)
        db.session.add(user)
        
    todo = Todo(title=title, description=description, due_time=due_time)
    user.todos.append(todo)
    db.session.commit()
    db.session.refresh(todo)
    return {
        "data": todo.to_dict()
    }


@convert_kwargs_to_snake_case
def resolve_delete_todo(obj, _, todo_id, remove_index=None):
    # Delete a todo

    print(remove_index)
    todo = Todo.query.get(todo_id)
    if (todo is None):
        raise Exception(f"Todo with id {todo_id}, doesn't exist")
    else:
        db.session.delete(todo)
        db.session.commit()
        if(remove_index is not None):
            return {"success": True, "remove_index" : remove_index}
            
        return {"success": True}



@convert_kwargs_to_snake_case
def resolve_mark_todo(obj, _, todo_id, edit_index=None):
    # Marking todo compeltion
    todo = Todo.query.get(todo_id)
    if (todo is None):
        raise Exception(f"Todo with id {todo_id}, doesn't exist")
    else:
        # Marking todo done if not done and vice-versa
        todo.completed = not todo.completed
        db.session.commit()
        db.session.refresh(todo)
        if(edit_index is not None):
            return {
                "data": todo.to_dict(), "index": edit_index
            }
        return {
            "data": todo.to_dict()
        }


@convert_kwargs_to_snake_case
def resolve_update_todo(obj, _, todo_id, edit_index=None, **attributes):
    # Marking todo compeltion
    todo = Todo.query.get(todo_id)
    if (todo is None):
        raise Exception(f"Todo with id {todo_id}, doesn't exist")
    else:
        for k, v in attributes.items():
            if(k == "due_time"):
                v = datetime.strptime(v, "%Y-%m-%d %H:%M:%S")
            setattr(todo, k, v)
        db.session.commit()
        db.session.refresh(todo)
        if(edit_index is not None):
            return {
                "data": todo.to_dict(),
                "index": edit_index
            }
        return {
            "data": todo.to_dict()
        }
