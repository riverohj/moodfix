from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from typing import Any

from flask import request

from ..db import get_db_path


TOKEN_TTL_HOURS = 2
PBKDF2_ITERATIONS = 120_000


class RequestValidationError(ValueError):
    pass


class AuthError(ValueError):
    pass


def _get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(get_db_path())
    connection.row_factory = sqlite3.Row
    return connection


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _serialize_datetime(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat()


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _hash_password(password: str, salt: bytes) -> str:
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )
    return base64.b64encode(digest).decode("ascii")


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _encode_salt(salt: bytes) -> str:
    return base64.b64encode(salt).decode("ascii")


def _decode_salt(salt: str) -> bytes:
    return base64.b64decode(salt.encode("ascii"))


def _clean_email(email: Any) -> str:
    if not isinstance(email, str) or not email.strip():
        raise RequestValidationError("`email` es obligatorio.")
    return email.strip().lower()


def _validate_password(password: Any) -> str:
    if not isinstance(password, str) or len(password) < 8:
        raise RequestValidationError("`password` debe tener al menos 8 caracteres.")
    return password


def _decode_user(row: sqlite3.Row | None) -> dict[str, Any] | None:
    if row is None:
        return None
    return {
        "id": row["id"],
        "email": row["email"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def obtener_usuario_por_id(user_id: int) -> dict[str, Any] | None:
    with _get_connection() as connection:
        row = connection.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return _decode_user(row)


def registrar_usuario(email: Any, password: Any) -> dict[str, Any]:
    email_limpio = _clean_email(email)
    password_valida = _validate_password(password)
    salt = secrets.token_bytes(16)
    hash_password = _hash_password(password_valida, salt)

    with _get_connection() as connection:
        usuario_existente = connection.execute(
            "SELECT id FROM users WHERE email = ?",
            (email_limpio,),
        ).fetchone()
        if usuario_existente is not None:
            raise RequestValidationError("Ya existe una cuenta con ese email.")

        cursor = connection.execute(
            """
            INSERT INTO users (email, password_hash, password_salt)
            VALUES (?, ?, ?)
            """,
            (email_limpio, hash_password, _encode_salt(salt)),
        )
        connection.commit()
        return obtener_usuario_por_id(cursor.lastrowid)


def autenticar_usuario(email: Any, password: Any) -> dict[str, Any]:
    email_limpio = _clean_email(email)
    password_valida = _validate_password(password)

    with _get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM users WHERE email = ?",
            (email_limpio,),
        ).fetchone()

    if row is None:
        raise AuthError("Credenciales no validas.")

    hash_esperado = row["password_hash"]
    hash_recibido = _hash_password(password_valida, _decode_salt(row["password_salt"]))
    if not hmac.compare_digest(hash_esperado, hash_recibido):
        raise AuthError("Credenciales no validas.")

    return _decode_user(row)


def crear_token_auth(user_id: int) -> dict[str, Any]:
    token = secrets.token_urlsafe(32)
    hash_token = _hash_token(token)
    vencimiento = _utc_now() + timedelta(hours=TOKEN_TTL_HOURS)

    with _get_connection() as connection:
        connection.execute(
            """
            INSERT INTO auth_tokens (user_id, token_hash, expires_at)
            VALUES (?, ?, ?)
            """,
            (user_id, hash_token, _serialize_datetime(vencimiento)),
        )
        connection.commit()

    return {
        "access_token": token,
        "token_type": "Bearer",
        "expires_at": _serialize_datetime(vencimiento),
        "expires_in_seconds": TOKEN_TTL_HOURS * 60 * 60,
    }


def revocar_token(token_crudo: str) -> None:
    ahora = _serialize_datetime(_utc_now())
    with _get_connection() as connection:
        connection.execute(
            """
            UPDATE auth_tokens
            SET revoked_at = ?, expires_at = ?
            WHERE token_hash = ? AND revoked_at IS NULL
            """,
            (ahora, ahora, _hash_token(token_crudo)),
        )
        connection.commit()


def obtener_token_del_request() -> str | None:
    autorizacion = request.headers.get("Authorization", "")
    if not autorizacion.startswith("Bearer "):
        return None
    token = autorizacion.removeprefix("Bearer ").strip()
    return token or None


def obtener_usuario_autenticado_desde_request(required: bool = True) -> dict[str, Any] | None:
    token = obtener_token_del_request()
    if token is None:
        if required:
            raise AuthError("Falta un token Bearer valido.")
        return None

    hash_token = _hash_token(token)
    with _get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                users.id,
                users.email,
                users.created_at,
                users.updated_at,
                auth_tokens.expires_at,
                auth_tokens.revoked_at
            FROM auth_tokens
            INNER JOIN users ON users.id = auth_tokens.user_id
            WHERE auth_tokens.token_hash = ?
            """,
            (hash_token,),
        ).fetchone()

    if row is None:
        raise AuthError("Token no valido.")
    if row["revoked_at"] is not None:
        raise AuthError("Token revocado.")
    if _parse_datetime(row["expires_at"]) <= _utc_now():
        raise AuthError("Token expirado.")

    return _decode_user(row)
