from __future__ import annotations

from flask import Blueprint, jsonify

from .motor import normalizar_contexto_perfil, normalizar_payload_sesion, recomendar_peliculas
from .user.auth_model import (
    AuthError,
    RequestValidationError,
    obtener_usuario_autenticado_desde_request,
)
from .user.request_utils import obtener_payload_json
from .user.user_profile_model import obtener_o_crear_perfil


session_api = Blueprint("session_api", __name__)


def _obtener_contexto_perfil_de_la_peticion() -> dict:
    usuario = obtener_usuario_autenticado_desde_request(required=False)
    if usuario is None:
        return normalizar_contexto_perfil(None)

    perfil = obtener_o_crear_perfil(user_id=usuario["id"])
    return normalizar_contexto_perfil(perfil)


@session_api.post("/session/recommend")
def recomendar_sesion():
    try:
        payload = obtener_payload_json()
        payload_sesion = normalizar_payload_sesion(payload)
        contexto_perfil = _obtener_contexto_perfil_de_la_peticion()
        resultado = recomendar_peliculas(contexto_perfil, payload_sesion)
        items = resultado["seleccion_final"]
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    message = ""
    if not items:
        message = "No hemos encontrado recomendaciones con el catálogo local actual para ese perfil."

    return jsonify(
        {
            "status": "ok",
            "mode": payload_sesion["modo_entrada"],
            "message": message,
            "items": items,
        }
    )
