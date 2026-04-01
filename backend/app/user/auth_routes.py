from __future__ import annotations

from flask import Blueprint, jsonify, request

from .auth_model import (
    AuthError,
    RequestValidationError,
    authenticate_user,
    create_auth_token,
    get_authenticated_user_from_request,
    get_token_from_request,
    register_user,
    revoke_token,
)


auth_api = Blueprint("auth_api", __name__)


def _get_json_payload() -> dict:
    payload = request.get_json(silent=True)
    if payload is None:
        return {}
    if not isinstance(payload, dict):
        raise RequestValidationError("El body JSON debe ser un objeto.")
    return payload


@auth_api.post("/auth/register")
def register():
    try:
        payload = _get_json_payload()
        user = register_user(payload.get("email"), payload.get("password"))
        token = create_auth_token(user["id"])
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "user": user, "auth": token}), 201


@auth_api.post("/auth/login")
def login():
    try:
        payload = _get_json_payload()
        user = authenticate_user(payload.get("email"), payload.get("password"))
        token = create_auth_token(user["id"])
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok", "user": user, "auth": token})


@auth_api.get("/auth/me")
def me():
    try:
        user = get_authenticated_user_from_request(required=True)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok", "user": user})


@auth_api.post("/auth/logout")
def logout():
    try:
        get_authenticated_user_from_request(required=True)
        token = get_token_from_request()
        if token is not None:
            revoke_token(token)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok"})
