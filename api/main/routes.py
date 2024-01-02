import json
import os

import stripe
from ariadne import graphql_sync
from ariadne.explorer import ExplorerGraphiQL
from flask import current_app, jsonify, render_template, request

from api import db
from api.constants.stripeconstants import (STRIPE_PUBLISHABLE_KEY,
                                           STRIPE_SECRET_KEY)
from api.extensions import keycloak_client
from api.models import Image, Todo
from api.schemas import schema

from . import bp

explorer_html = ExplorerGraphiQL().html(None)


@bp.route("/")
def index():
    return render_template("index.html")


# ? ROUTE Not required anymore


@bp.route("/graphql", methods=["GET"])
def graphql_playground():
    print(*request.headers.keys())
    # print(request.headers["Authorization"])
    return explorer_html, 200


# @bp.before_request
# def auth_middleware():
#     if request.endpoint == "main.graphql_server":
#         try:
#             headers = dict(request.headers)
#             auth_header = headers.get("Authorization", None)
#             if (not auth_header):
#                 return {"error": "Access token not provided"}, 401
#             access_token = auth_header.replace("Bearer ", "")
#             # * Introspecting the access token we received from front-end
#             token_info = keycloak_client.introspect(access_token)
#             if (not token_info["active"]):
#                 return jsonify({"data": {"todos": None, "error": "Access Token is not active (or) the token is invalid.", "isTokenActive": False}})

#             user_name = token_info["preferred_username"]
#         except Exception as e:
#             # On failure, UNAUTHORIZED ACCESS
#             return jsonify({"data": {"error": str(e)}, "todos": None, "isTokenActive": None})


@bp.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=current_app.debug,
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code


def allowed_file(filename):
    ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS


@bp.route("/image-upload", methods=["POST"])
def image_upload_route():
    file = request.files.get("todo_img", None)
    todo_id = request.form.get("todo_id", None)
    print(">>", todo_id)
    if todo_id is None:
        return "'todo_id' field not present in the request", 400
    if file is None:
        return "Required image file 'todo_img' field not present in request", 400
    if file.filename == "":
        return "No file selected", 400
    if not allowed_file(file.filename):
        return "File should be an image file and of types ('jpg', 'jpeg', 'png')", 415

    file_extn = os.path.splitext(file.filename)[1]
    save_filename = f"{todo_id}{file_extn}"

    upld_file_path = os.path.join(
        current_app.config['UPLOAD_FOLDER'], save_filename)
    try:
        file.save(upld_file_path)
        image_upld = Image(file_name=save_filename)
        todo = Todo.query.get(todo_id)
        if (todo is None):
            os.remove(upld_file_path)
            return "Todo with 'todo_id' not found", 404
        todo.images.append(image_upld)
        db.session.commit()
        db.session.refresh(image_upld)

        return {"message":"Successfully uplaoded the file", "path": f"/static/uploads/{save_filename}"}, 201
    except Exception as e:
        os.remove(upld_file_path)
        return f"Couldn't save the file, error {str(e)}", 500


@bp.route("/stripe/create-payment-intent", methods=["POST"])
def create_payment():
    try:
        stripe_keys = {
            "secret_key": STRIPE_SECRET_KEY,
            "publishable_key": STRIPE_PUBLISHABLE_KEY
        }
        stripe.api_key = stripe_keys["secret_key"]
        data = json.loads(request.data)
        print(">>", data)
        intent = stripe.PaymentIntent.create(
            amount=500,
            currency='inr',
            automatic_payment_methods={
                "enabled" : True
            },
            metadata={
                'username': data['username']
            },
        )
        # stripe.PaymentIntent.confirm(intent=intent)

        return {
            'clientSecret': intent["client_secret"]
        }

    except Exception as e:
        return {'error': str(e)}, 403

# ? ROUTE Not required anymore


# @bp.route('/login', methods=["POST"])
# def my_api():
#     """
#     `param`
#         :body:
#             username: String
#             password: String
#     `return`
#         :body: access_token, expires_in, token_type
#     """
#     try:
#         data = request.json
#         print(">>", data)
#         status = keycloak_client.introspect("")
#         return status, 200

#     except KeycloakAuthenticationError as e:
#         return {"message": "Invalid credentials"}, 404

#     except Exception as e:
#         return {"message": str(e)}, 400
