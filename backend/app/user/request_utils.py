from __future__ import annotations

from flask import request

from .auth_model import RequestValidationError


def get_json_payload() -> dict:
    payload = request.get_json(silent=True)
    if payload is None:
        return {}
    if not isinstance(payload, dict):
        raise RequestValidationError("El body JSON debe ser un objeto.")
    return payload
