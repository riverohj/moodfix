from __future__ import annotations

from flask import Blueprint, jsonify, request

from .auth_model import get_authenticated_user_from_request
from .user_profile_model import DEFAULT_PROFILE_KEY, get_or_create_profile, save_profile


profile_api = Blueprint("profile_api", __name__)


def _get_profile_scope() -> tuple[str, int | None]:
    user = get_authenticated_user_from_request(required=False)
    if user is None:
        return DEFAULT_PROFILE_KEY, None
    return f"user:{user['id']}", user["id"]


@profile_api.get("/profile")
def get_profile():
    try:
        profile_key, user_id = _get_profile_scope()
        profile = get_or_create_profile(profile_key=profile_key, user_id=user_id)
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 401
    return jsonify({"status": "ok", "item": profile})


@profile_api.put("/profile")
def put_profile():
    payload = request.get_json(silent=True) or {}

    try:
        profile_key, user_id = _get_profile_scope()
        profile = save_profile(payload, profile_key=profile_key, user_id=user_id)
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": profile})


@profile_api.patch("/profile")
def patch_profile():
    payload = request.get_json(silent=True) or {}

    try:
        profile_key, user_id = _get_profile_scope()
        profile = save_profile(payload, profile_key=profile_key, user_id=user_id)
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": profile})


@profile_api.post("/profile/skip")
def skip_profile():
    payload = request.get_json(silent=True) or {}
    payload["onboarding_skipped"] = True

    try:
        profile_key, user_id = _get_profile_scope()
        profile = save_profile(payload, profile_key=profile_key, user_id=user_id)
    except ValueError as error:
        return jsonify({"status": "error", "message": str(error)}), 400

    return jsonify({"status": "ok", "item": profile})
