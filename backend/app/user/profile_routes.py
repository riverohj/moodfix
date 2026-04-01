from __future__ import annotations

from flask import Blueprint, jsonify

from .auth_model import AuthError, RequestValidationError, get_authenticated_user_from_request
from .request_utils import get_json_payload
from .user_profile_model import get_or_create_profile, save_profile


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
