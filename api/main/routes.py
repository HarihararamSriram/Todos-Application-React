import token
from ariadne import graphql_sync
from flask import render_template, request, current_app, jsonify
import requests
from . import bp
from ariadne.explorer import ExplorerGraphiQL
from api.schemas import schema
from api.services.keycloakservices import KeycloakClientService
from keycloak.exceptions import KeycloakAuthenticationError
from api.extensions import keycloak_client
from api.constants.stripeconstants import STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY
import stripe
import json

explorer_html = ExplorerGraphiQL().html(None)


@bp.route("/")
def index():
    return render_template("index.html")

# ? ROUTE Not required anymore


@bp.route('/login', methods=["POST"])
def my_api():
    """
    `param`
        :body:
            username: String
            password: String
    `return`
        :body: access_token, expires_in, token_type
    """
    try:
        data = request.json
        print(">>", data)
        status = keycloak_client.introspect("")
        return status, 200

    except KeycloakAuthenticationError as e:
        return {"message": "Invalid credentials"}, 404

    except Exception as e:
        return {"message": str(e)}, 400

# ? ROUTE Not required anymore


@bp.route("/graphql", methods=["GET"])
def graphql_playground():
    print(*request.headers.keys())
    # print(request.headers["Authorization"])
    return explorer_html, 200


@bp.before_request
def auth_middleware():
    print(request.endpoint)
    if request.endpoint == "main.graphql_server":
        try:
            headers = dict(request.headers)
            auth_header = headers.get("Authorization", None)
            if (not auth_header):
                return {"error": "Access token not provided"}, 401
            access_token = auth_header.replace("Bearer ", "")
            # * Introspecting the access token we received from front-end
            token_info = keycloak_client.introspect(access_token)
            if (not token_info["active"]):
                return jsonify({"data": {"todos": None, "error": "Access Token is not active (or) the token is invalid.", "isTokenActive": False}})

            user_name = token_info["preferred_username"]
        except Exception as e:
            # On failure, UNAUTHORIZED ACCESS
            return jsonify({"data": {"error": str(e)}, "todos": None, "isTokenActive": None})


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


@bp.route("/stripe/create-payment-intent", methods=["POST"])
def create_payment():
    print("Hari")
    try:
        stripe_keys = {
            "secret_key": STRIPE_SECRET_KEY,
            "publishable_key": STRIPE_PUBLISHABLE_KEY
        }
        stripe.api_key = stripe_keys["secret_key"]
        data = json.loads(request.data)
        print(">>",data)
        intent = stripe.PaymentIntent.create(
            amount=500,
            currency='inr',
            payment_method="pm_card_us",
            # automatic_payment_methods={
            #     "enabled" : True
            # },
            metadata={
                'username': data['username']
            },
        )
        # stripe.PaymentIntent.confirm(intent=intent)

        return {
            'clientSecret': intent["client_secret"]
        }

    except Exception as e:
        return {'error' : str(e)}, 403

