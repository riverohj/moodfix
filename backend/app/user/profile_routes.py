from __future__ import annotations

from flask import Blueprint, jsonify

from ..motor.catalogo import cargar_peliculas_por_tmdb_ids
from .auth_model import AuthError, RequestValidationError, get_authenticated_user_from_request
from .request_utils import get_json_payload
from .user_profile_model import (
    agregar_pelicula_a_lista,
    get_or_create_profile,
    quitar_pelicula_de_lista,
    save_profile,
)


profile_api = Blueprint("profile_api", __name__)


def _normalizar_codigo_pais(value) -> str:
    if not isinstance(value, str) or len(value.strip()) != 2:
        return "ES"
    return value.strip().upper()


def _get_authenticated_profile_user_id() -> int:
    user = get_authenticated_user_from_request(required=True)
    return user["id"]


def _get_tmdb_id_from_payload() -> int:
    payload = get_json_payload()
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
    profile = get_or_create_profile(user_id=user_id)
    country_code = _normalizar_codigo_pais(profile.get("pais"))
    tmdb_ids = [item for item in (profile.get(campo) or []) if isinstance(item, int)]
    return cargar_peliculas_por_tmdb_ids(tmdb_ids, country_code=country_code)


@profile_api.get("/profile")
def get_profile():
    try:
        user_id = _get_authenticated_profile_user_id()
        profile = get_or_create_profile(user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "item": profile})


@profile_api.get("/watchlist")
def get_watchlist_movies():
    try:
        user_id = _get_authenticated_profile_user_id()
        items = _listar_peliculas_del_perfil(user_id=user_id, campo="ver_luego")
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "items": items})


@profile_api.get("/history")
def get_history_movies():
    try:
        user_id = _get_authenticated_profile_user_id()
        items = _listar_peliculas_del_perfil(user_id=user_id, campo="historial")
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "items": items})


@profile_api.put("/profile")
def put_profile():
    try:
        user_id = _get_authenticated_profile_user_id()
        payload = get_json_payload()
        profile = save_profile(payload, user_id=user_id, merge=False)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": profile})


@profile_api.patch("/profile")
def patch_profile():
    try:
        user_id = _get_authenticated_profile_user_id()
        payload = get_json_payload()
        profile = save_profile(payload, user_id=user_id, merge=True)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": profile})


@profile_api.post("/profile/skip")
def skip_profile():
    try:
        user_id = _get_authenticated_profile_user_id()
        payload = get_json_payload()
        payload["onboarding_skipped"] = True
        profile = save_profile(payload, user_id=user_id, merge=True)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": profile})


@profile_api.post("/history")
def add_movie_seen():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = agregar_pelicula_a_lista(tmdb_id, "historial", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": profile})


@profile_api.delete("/history")
def remove_movie_seen():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = quitar_pelicula_de_lista(tmdb_id, "historial", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": profile})


@profile_api.post("/watchlist")
def add_movie_save():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = agregar_pelicula_a_lista(tmdb_id, "ver_luego", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": profile})


@profile_api.delete("/watchlist")
def remove_movie_save():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = quitar_pelicula_de_lista(tmdb_id, "ver_luego", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": profile})


@profile_api.post("/discard")
def add_movie_discard():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = agregar_pelicula_a_lista(tmdb_id, "titulos_descartados", user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    except (RequestValidationError, ValueError) as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    return jsonify({"status": "ok", "item": profile})
