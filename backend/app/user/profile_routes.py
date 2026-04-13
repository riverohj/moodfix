from __future__ import annotations

from flask import Blueprint, jsonify

from .auth_model import AuthError, RequestValidationError, get_authenticated_user_from_request
from .request_utils import get_json_payload
from .user_profile_model import agregar_pelicula_a_lista, get_or_create_profile, save_profile


profile_api = Blueprint("profile_api", __name__)


def _get_authenticated_profile_user_id() -> int:
    user = get_authenticated_user_from_request(required=True)
    return user["id"]


@profile_api.get("/profile")
def get_profile():
    try:
        user_id = _get_authenticated_profile_user_id()
        profile = get_or_create_profile(user_id=user_id)
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "item": profile})


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


def _get_tmdb_id_from_payload() -> int:
    payload = get_json_payload()
    if not isinstance(payload, dict):
        raise RequestValidationError("El body JSON debe ser un objeto.")
    tmdb_id = payload.get("tmdb_id")
    if isinstance(tmdb_id, bool) or not isinstance(tmdb_id, int):
        raise RequestValidationError("`tmdb_id` es obligatorio y debe ser un entero.")
    return tmdb_id


@profile_api.post("/history")
def add_movie_seen():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = agregar_pelicula_a_lista(
            tmdb_id, "historial", user_id=user_id, campos_limpiar=("ver_luego",)
        )
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


@profile_api.post("/discard")
def add_movie_discard():
    try:
        user_id = _get_authenticated_profile_user_id()
        tmdb_id = _get_tmdb_id_from_payload()
        profile = agregar_pelicula_a_lista(
            tmdb_id, "titulos_descartados", user_id=user_id, campos_limpiar=("ver_luego",)
        )
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
