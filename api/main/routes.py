from ariadne import graphql_sync
from flask import render_template, request, current_app, jsonify
from . import bp
from ariadne.explorer import ExplorerGraphiQL
from api.schemas import schema
from api.services.keycloakservices import KeycloakClientService
from keycloak.exceptions import KeycloakAuthenticationError
from api.extensions import keycloak_client

explorer_html = ExplorerGraphiQL().html(None)


@bp.route("/")
def index():
    return render_template("index.html")


@bp.route('/login', methods=["GET"])
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
        token_info = KeycloakClientService.login_user(data)
        # print(">>", keycloak_client.exchange_token(token_info["access_token"], "flask_app", "react_app", "hasriram"))
        return token_info, 200

    except KeycloakAuthenticationError as e:
        return {"message": "Invalid credentials"}, 404

    except Exception as e:
        return {"message": str(e)}, 400


@bp.route("/graphql", methods=["GET"])
def graphql_playground():
    print(*request.headers.keys())
    print(request.headers["Authorization"])
    return explorer_html, 200


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
