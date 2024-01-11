from ariadne import convert_camel_case_to_snake
from api import db
from api.models.user import User
from api.extensions import keycloak_client, keycloak_admin as ka


def resolve_user(obj, _, username):
    user = User.query.filter(User.user_name == username).first()
    if (user is None):
        #? A keycloak user with this `user_name` has logged-in, so we CREATE a NEW user for this KeyCloak user in this 'flask_app' client's database (backend).
        user = User(user_name = username)
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)
        return user.to_dict()
        # raise Exception(f"User with 'username' {username}, doesn't exist")

    return user.to_dict()

# @convert_camel_case_to_snake
def resolve_set_premium(obj, _, username):
    uid = ka.get_user_id(username)
    # Checking whether user exists.
    if(uid is None):
        raise Exception(f"User with 'username' {username}, doesn't exist")
    premium_role = ka.get_realm_roles(search_text="premium")
    try:
        ka.assign_realm_roles(user_id=uid, roles=premium_role)
    except:
        raise Exception("Couldn't assign premium role to the user, try again!")
        
    user = User.query.filter(User.user_name == username).first()

    user.is_premium = True
    db.session.commit()
    db.session.refresh(user)

    return user.to_dict()
