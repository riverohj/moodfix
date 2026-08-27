from __future__ import annotations

import json
import sqlite3
from typing import Any

from .db import apply_row_factory, get_user_connection

def save_recommendation_set(*, user_id: int, mode: str, tmdb_ids: list[int]) -> None:
    with get_user_connection() as conn:
        conn.execute(
            """
            INSERT INTO recommendation_sets (user_id, mode, tmdb_ids)
            VALUES (?, ?, ?)
            """,
            (user_id, mode, json.dumps(tmdb_ids)),
        )


def get_recent_tmdb_ids(user_id: int) -> list[int]:
    """Devuelve todos los tmdb_ids mostrados en sesiones anteriores del usuario."""
    with get_user_connection() as conn:
        rows = conn.execute(
            """
            SELECT tmdb_ids FROM recommendation_sets
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()

    seen: set[int] = set()
    result: list[int] = []
    for (raw,) in rows:
        try:
            ids = json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            continue
        for tmdb_id in ids:
            if isinstance(tmdb_id, int) and tmdb_id not in seen:
                seen.add(tmdb_id)
                result.append(tmdb_id)
    return result


def get_recommendation_history(user_id: int) -> list[dict[str, Any]]:
    """Devuelve el historial completo de sets de recomendación del usuario."""
    with get_user_connection() as conn:
        apply_row_factory(conn)
        rows = conn.execute(
            """
            SELECT id, mode, tmdb_ids, created_at
            FROM recommendation_sets
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()

    result = []
    for row in rows:
        try:
            tmdb_ids = json.loads(row["tmdb_ids"])
        except (json.JSONDecodeError, TypeError):
            tmdb_ids = []
        result.append({
            "id": row["id"],
            "mode": row["mode"],
            "tmdb_ids": tmdb_ids,
            "created_at": row["created_at"],
        })
    return result
