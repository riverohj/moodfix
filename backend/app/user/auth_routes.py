from __future__ import annotations

from flask import Blueprint, jsonify, request

from .auth_model import (
    authenticate_user,
    create_auth_token,
    get_authenticated_user_from_request,
    get_token_from_request,
    register_user,
    revoke_token,
)


auth_api = Blueprint("auth_api", __name__)


@auth_api.post("/auth/register")
def register():
    payload = request.get_json(silent=True) or {}

    try:
        user = register_user(payload.get("email"), payload.get("password"))
        token = create_auth_token(user["id"])
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "user": user, "auth": token}), 201


@auth_api.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}

    try:
        user = authenticate_user(payload.get("email"), payload.get("password"))
        token = create_auth_token(user["id"])
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok", "user": user, "auth": token})


@auth_api.get("/auth/me")
def me():
    try:
        user = get_authenticated_user_from_request(required=True)
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok", "user": user})


@auth_api.post("/auth/logout")
def logout():
    try:
        get_authenticated_user_from_request(required=True)
        token = get_token_from_request()
        if token is not None:
            revoke_token(token)
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok"})
