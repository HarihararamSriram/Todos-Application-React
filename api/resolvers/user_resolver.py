from api import db
from api.models.user import User


def resolve_user(obj, _, username):
    user = User.query.filter(User.user_name == username).first()
    if (user is None):
        raise Exception(f"User with 'username' {username}, doesn't exist")

    return user.to_dict()


def resolve_set_premium(obj, _, username):
    user = User.query.filter(User.user_name == username).first()
    if (user is None):
        raise Exception(f"User with 'username' {username}, doesn't exist")

    user.is_premium = True
    db.session.commit()
    db.session.refresh(user)

    return user.to_dict()
