from __future__ import annotations

import json
import sqlite3
from typing import Any

from .auth_model import get_user_by_id
from ..db import get_db_path


DEFAULT_PROFILE_KEY = "local"
LIST_FIELDS = (
    "plataformas",
    "idiomas_comodos",
    "no_rotundos",
    "historial",
    "ver_luego",
    "titulos_descartados",
)
ALLOWED_FIELDS = {
    "pais",
    "plataformas",
    "idiomas_comodos",
    "tolerancia_subtitulos",
    "no_rotundos",
    "historial",
    "ver_luego",
    "titulos_descartados",
    "onboarding_completed",
    "onboarding_skipped",
}


def _serialize_list(value: Any) -> str:
    if value is None:
        return "[]"
    if not isinstance(value, list):
        raise ValueError("Los campos de lista deben enviarse como arrays.")
    return json.dumps(value)


def _serialize_flag(value: Any) -> int:
    return 1 if bool(value) else 0


def normalize_profile_payload(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("El payload del perfil debe ser un objeto JSON.")

    unknown_fields = sorted(set(payload) - ALLOWED_FIELDS)
    if unknown_fields:
        raise ValueError(f"Campos no soportados en perfil: {', '.join(unknown_fields)}.")

    normalized: dict[str, Any] = {}

    for field in LIST_FIELDS:
        if field in payload:
            normalized[field] = _serialize_list(payload[field])

    if "pais" in payload:
        normalized["pais"] = payload["pais"] or None

    if "tolerancia_subtitulos" in payload:
        value = payload["tolerancia_subtitulos"]
        if value not in (None, "si", "no"):
            raise ValueError("`tolerancia_subtitulos` solo permite `si`, `no` o null.")
        normalized["tolerancia_subtitulos"] = value

    for flag in ("onboarding_completed", "onboarding_skipped"):
        if flag in payload:
            normalized[flag] = _serialize_flag(payload[flag])

    return normalized


def _decode_row(row: sqlite3.Row | None) -> dict[str, Any] | None:
    if row is None:
        return None

    profile = dict(row)
    for field in LIST_FIELDS:
        profile[field] = json.loads(profile[field] or "[]")

    profile["onboarding_completed"] = bool(profile["onboarding_completed"])
    profile["onboarding_skipped"] = bool(profile["onboarding_skipped"])
    return profile


def _get_profile_row(
    connection: sqlite3.Connection,
    profile_key: str = DEFAULT_PROFILE_KEY,
    user_id: int | None = None,
) -> sqlite3.Row | None:
    if user_id is not None:
        return connection.execute(
            "SELECT * FROM user_profiles WHERE user_id = ?",
            (user_id,),
        ).fetchone()

    return connection.execute(
        "SELECT * FROM user_profiles WHERE profile_key = ?",
        (profile_key,),
    ).fetchone()


def get_or_create_profile(
    profile_key: str = DEFAULT_PROFILE_KEY,
    user_id: int | None = None,
) -> dict[str, Any]:
    if user_id is not None and get_user_by_id(user_id) is None:
        raise ValueError("Usuario no encontrado para crear su perfil.")

    db_path = get_db_path()

    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        row = _get_profile_row(connection, profile_key=profile_key, user_id=user_id)

        if row is None:
            if user_id is not None:
                connection.execute(
                    "INSERT INTO user_profiles (profile_key, user_id) VALUES (?, ?)",
                    (f"user:{user_id}", user_id),
                )
            else:
                connection.execute(
                    "INSERT INTO user_profiles (profile_key) VALUES (?)",
                    (profile_key,),
                )
            connection.commit()
            row = _get_profile_row(connection, profile_key=profile_key, user_id=user_id)

    return _decode_row(row)


def save_profile(
    payload: dict[str, Any],
    profile_key: str = DEFAULT_PROFILE_KEY,
    user_id: int | None = None,
) -> dict[str, Any]:
    normalized = normalize_profile_payload(payload)
    existing = get_or_create_profile(profile_key=profile_key, user_id=user_id)

    merged: dict[str, Any] = {
        field: existing.get(field)
        for field in ALLOWED_FIELDS
        if field in existing
    }
    merged.update(payload)
    normalized = normalize_profile_payload(merged)

    assignments = ", ".join(f"{field} = ?" for field in normalized)
    values = [normalized[field] for field in normalized]

    db_path = get_db_path()
    with sqlite3.connect(db_path) as connection:
        connection.execute(
            f"""
            UPDATE user_profiles
            SET {assignments},
                updated_at = CURRENT_TIMESTAMP
            WHERE {"user_id = ?" if user_id is not None else "profile_key = ?"}
            """,
            (*values, user_id if user_id is not None else profile_key),
        )
        connection.commit()

    return get_or_create_profile(profile_key=profile_key, user_id=user_id)
