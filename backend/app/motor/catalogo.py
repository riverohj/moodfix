from __future__ import annotations

import json
import sqlite3
from typing import Any

from ..db import get_db_path


def _decode_genre_ids(value: Any) -> list[int]:
    if not value:
        return []

    try:
        raw_items = json.loads(value) if isinstance(value, str) else value
    except json.JSONDecodeError:
        return []

    if not isinstance(raw_items, list):
        return []

    genre_ids: list[int] = []
    seen: set[int] = set()
    for item in raw_items:
        if isinstance(item, bool):
            continue
        try:
            genre_id = int(item)
        except (TypeError, ValueError):
            continue
        if genre_id in seen:
            continue
        seen.add(genre_id)
        genre_ids.append(genre_id)
    return genre_ids


def cargar_catalogo_por_pais(country_code: str) -> list[dict[str, Any]]:
    db_path = get_db_path()
    if not db_path.exists():
        return []

    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT
                movies.id,
                movies.tmdb_id,
                movies.title,
                movies.poster_path,
                movies.runtime,
                movies.release_year,
                movies.original_language,
                movies.overview,
                movies.popularity,
                movies.vote_count,
                movies.genre_ids,
                movie_providers.provider_id,
                movie_providers.provider_name,
                movie_providers.provider_type
            FROM movies
            LEFT JOIN movie_providers
                ON movie_providers.movie_id = movies.id
                AND movie_providers.country_code = ?
            ORDER BY movies.popularity DESC, movies.vote_count DESC, movies.id DESC
            """,
            (country_code,),
        ).fetchall()

    movies: dict[int, dict[str, Any]] = {}
    for row in rows:
        movie_id = row["id"]
        movie = movies.get(movie_id)
        if movie is None:
            movie = {
                "id": row["id"],
                "tmdb_id": row["tmdb_id"],
                "title": row["title"],
                "poster_path": row["poster_path"],
                "runtime": row["runtime"],
                "release_year": row["release_year"],
                "original_language": row["original_language"],
                "overview": row["overview"],
                "popularity": row["popularity"] or 0,
                "vote_count": row["vote_count"] or 0,
                "genre_ids": _decode_genre_ids(row["genre_ids"]),
                "providers": [],
            }
            movies[movie_id] = movie

        if row["provider_id"] is not None:
            movie["providers"].append(
                {
                    "provider_id": row["provider_id"],
                    "provider_name": row["provider_name"],
                    "provider_type": row["provider_type"],
                }
            )

    return list(movies.values())
