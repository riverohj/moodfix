from __future__ import annotations

from flask import Blueprint, jsonify

from ..motor.catalogo import cargar_peliculas_por_tmdb_ids
from .auth_model import (
    AuthError,
    RequestValidationError,
    obtener_usuario_autenticado_desde_request,
)
from .request_utils import obtener_payload_json
from .user_profile_model import (
    agregar_pelicula_a_lista,
    guardar_perfil,
    obtener_o_crear_perfil,
    quitar_pelicula_de_lista,
)


profile_api = Blueprint("profile_api", __name__)


def _normalizar_codigo_pais(value) -> str:
    if not isinstance(value, str) or len(value.strip()) != 2:
        return "ES"
    return value.strip().upper()


def _obtener_user_id_autenticado() -> int:
    usuario = obtener_usuario_autenticado_desde_request(required=True)
    return usuario["id"]


@profile_api.get("/profile")
def ver_perfil():
    try:
        user_id = _obtener_user_id_autenticado()
        perfil = obtener_o_crear_perfil(user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "item": perfil})


@profile_api.put("/profile")
def reemplazar_perfil():
    try:
        user_id = _obtener_user_id_autenticado()
        payload = obtener_payload_json()
        perfil = guardar_perfil(payload, user_id=user_id, merge=False)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": perfil})


@profile_api.patch("/profile")
def actualizar_parte_del_perfil():
    try:
        user_id = _obtener_user_id_autenticado()
        payload = obtener_payload_json()
        perfil = guardar_perfil(payload, user_id=user_id, merge=True)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": perfil})


def _obtener_tmdb_id_del_payload() -> int:
    payload = obtener_payload_json()
    tmdb_id = payload.get("tmdb_id")
    if isinstance(tmdb_id, bool):
        raise RequestValidationError("`tmdb_id` debe ser un entero positivo.")
    try:
        tmdb_id = int(tmdb_id)
    except (TypeError, ValueError) as error:
        raise RequestValidationError("`tmdb_id` debe ser un entero positivo.") from error
    if tmdb_id <= 0:
        raise RequestValidationError("`tmdb_id` debe ser un entero positivo.")
    return tmdb_id


def _listar_peliculas_del_perfil(*, user_id: int, campo: str) -> list[dict]:
    perfil = obtener_o_crear_perfil(user_id=user_id)
    country_code = _normalizar_codigo_pais(perfil.get("pais"))
    tmdb_ids: list[int] = []
    for item in perfil.get(campo) or []:
        if isinstance(item, bool):
            continue
        try:
            tmdb_id = int(item)
        except (TypeError, ValueError):
            continue
        if tmdb_id <= 0:
            continue
        tmdb_ids.append(tmdb_id)
    return cargar_peliculas_por_tmdb_ids(tmdb_ids, country_code=country_code)


@profile_api.get("/watchlist")
def ver_watchlist():
    try:
        user_id = _obtener_user_id_autenticado()
        items = _listar_peliculas_del_perfil(user_id=user_id, campo="ver_luego")
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "items": items})


@profile_api.get("/history")
def ver_historial():
    try:
        user_id = _obtener_user_id_autenticado()
        items = _listar_peliculas_del_perfil(user_id=user_id, campo="historial")
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "items": items})


@profile_api.post("/history")
def agregar_pelicula_vista():
    try:
        user_id = _obtener_user_id_autenticado()
        tmdb_id = _obtener_tmdb_id_del_payload()
        perfil = agregar_pelicula_a_lista(
            tmdb_id, "historial", user_id=user_id, campos_limpiar=("ver_luego",)
        )
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": perfil})


@profile_api.delete("/history")
def quitar_pelicula_vista():
    try:
        user_id = _obtener_user_id_autenticado()
        tmdb_id = _obtener_tmdb_id_del_payload()
        perfil = quitar_pelicula_de_lista(tmdb_id, "historial", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": perfil})


@profile_api.post("/watchlist")
def agregar_pelicula_a_watchlist():
    try:
        user_id = _obtener_user_id_autenticado()
        tmdb_id = _obtener_tmdb_id_del_payload()
        perfil = agregar_pelicula_a_lista(tmdb_id, "ver_luego", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": perfil})


@profile_api.delete("/watchlist")
def quitar_pelicula_de_watchlist():
    try:
        user_id = _obtener_user_id_autenticado()
        tmdb_id = _obtener_tmdb_id_del_payload()
        perfil = quitar_pelicula_de_lista(tmdb_id, "ver_luego", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": perfil})


@profile_api.post("/discard")
def descartar_pelicula():
    try:
        user_id = _obtener_user_id_autenticado()
        tmdb_id = _obtener_tmdb_id_del_payload()
        perfil = agregar_pelicula_a_lista(
            tmdb_id, "titulos_descartados", user_id=user_id, campos_limpiar=("ver_luego",)
        )
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": perfil})


@profile_api.post("/profile/skip")
def saltar_onboarding():
    try:
        user_id = _obtener_user_id_autenticado()
        payload = obtener_payload_json()
        payload["onboarding_skipped"] = True
        perfil = guardar_perfil(payload, user_id=user_id, merge=True)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": perfil})
