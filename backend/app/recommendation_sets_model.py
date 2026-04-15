from __future__ import annotations

import json
import sqlite3
from typing import Any

from .db import get_db_path

# Cuántas sesiones recientes se consultan para evitar repeticiones en el motor
RECENT_SETS_LIMIT = 5


def save_recommendation_set(*, user_id: int, mode: str, tmdb_ids: list[int]) -> None:
    db_path = get_db_path()
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO recommendation_sets (user_id, mode, tmdb_ids)
            VALUES (?, ?, ?)
            """,
            (user_id, mode, json.dumps(tmdb_ids)),
        )


def get_recent_tmdb_ids(user_id: int, limit: int = RECENT_SETS_LIMIT) -> list[int]:
    """Devuelve los tmdb_ids mostrados en las últimas `limit` sesiones del usuario."""
    db_path = get_db_path()
    with sqlite3.connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT tmdb_ids FROM recommendation_sets
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            """,
            (user_id, limit),
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
    db_path = get_db_path()
    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
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
