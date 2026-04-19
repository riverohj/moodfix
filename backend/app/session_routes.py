from __future__ import annotations

from flask import Blueprint, jsonify

from .motor import normalizar_contexto_perfil, normalizar_payload_sesion, recomendar_peliculas
from .motor.ia import elegir_con_ia
from .recommendation_sets_model import get_recent_tmdb_ids, save_recommendation_set
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
    usuario = None
    try:
        payload = obtener_payload_json()
        payload_sesion = normalizar_payload_sesion(payload)
        usuario = obtener_usuario_autenticado_desde_request(required=False)
        contexto_perfil = _obtener_contexto_perfil_de_la_peticion()
        if usuario is not None:
            contexto_perfil["peliculas_mostradas_recientemente"] = get_recent_tmdb_ids(usuario["id"])
        resultado = recomendar_peliculas(contexto_perfil, payload_sesion)
        lista_corta = resultado["lista_corta"]
        seleccion_motor = resultado["seleccion_final"]

        # IA elige el #1 de la lista corta; el motor completa con los siguientes
        elegida = elegir_con_ia(lista_corta, contexto_perfil, payload_sesion)
        if elegida is not None:
            resto = [m for m in seleccion_motor if m["tmdb_id"] != elegida["tmdb_id"]]
            items = [elegida] + resto[:2]
        else:
            items = seleccion_motor
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    if items and usuario is not None:
        tmdb_ids = [item["tmdb_id"] for item in items if item.get("tmdb_id")]
        save_recommendation_set(
            user_id=usuario["id"],
            mode=payload_sesion["modo_entrada"],
            tmdb_ids=tmdb_ids,
        )

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
