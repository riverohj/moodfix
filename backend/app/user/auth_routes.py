from __future__ import annotations

from flask import Blueprint, jsonify

from .auth_model import (
    AuthError,
    RequestValidationError,
    autenticar_usuario,
    crear_token_auth,
    obtener_token_del_request,
    obtener_usuario_autenticado_desde_request,
    registrar_usuario,
    revocar_token,
)
from .request_utils import obtener_payload_json


auth_api = Blueprint("auth_api", __name__)


@auth_api.post("/auth/register")
def registrar():
    try:
        payload = obtener_payload_json()
        user = registrar_usuario(payload.get("email"), payload.get("password"))
        token = crear_token_auth(user["id"])
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "user": user, "auth": token}), 201


@auth_api.post("/auth/login")
def iniciar_sesion():
    try:
        payload = obtener_payload_json()
        user = autenticar_usuario(payload.get("email"), payload.get("password"))
        token = crear_token_auth(user["id"])
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok", "user": user, "auth": token})


@auth_api.get("/auth/me")
def ver_mi_usuario():
    try:
        user = obtener_usuario_autenticado_desde_request(required=True)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok", "user": user})


@auth_api.post("/auth/logout")
def cerrar_sesion():
    try:
        obtener_usuario_autenticado_desde_request(required=True)
        token = obtener_token_del_request()
        if token is not None:
            revocar_token(token)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    return jsonify({"status": "ok"})
