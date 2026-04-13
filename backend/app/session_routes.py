from __future__ import annotations

from flask import Blueprint, jsonify

from .motor import normalizar_contexto_perfil, normalizar_payload_sesion, recomendar_peliculas
from .user.auth_model import AuthError, RequestValidationError, get_authenticated_user_from_request
from .user.request_utils import get_json_payload
from .user.user_profile_model import get_or_create_profile


session_api = Blueprint("session_api", __name__)


def _contexto_perfil_para_peticion() -> dict:
    user = get_authenticated_user_from_request(required=False)
    if user is None:
        return normalizar_contexto_perfil(None)

    profile = get_or_create_profile(user_id=user["id"])
    return normalizar_contexto_perfil(profile)


@session_api.post("/session/recommend")
def recommend_session():
    try:
        payload = get_json_payload()
        session_payload = normalizar_payload_sesion(payload)
        profile_context = _contexto_perfil_para_peticion()
        result = recomendar_peliculas(profile_context, session_payload)
        items = result["seleccion_final"]
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
            "mode": session_payload["modo_entrada"],
            "message": message,
            "items": items,
        }
    )
