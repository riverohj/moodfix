import sqlite3

from flask import Blueprint, jsonify, request

from .db import get_db_path


api = Blueprint("api", __name__)


@api.get("/health")
def healthcheck():
    return jsonify(
        {
            "status": "ok",
            "service": "moodfix-backend",
            "message": "Flask API boilerplate ready",
        }
    )


@api.get("/db/status")
def db_status():
    db_path = get_db_path()
    return jsonify(
        {
            "status": "ok",
            "database_path": str(db_path),
            "database_exists": db_path.exists(),
        }
    )


@api.get("/movies")
def list_movies():
    db_path = get_db_path()
    page = max(request.args.get("page", default=1, type=int), 1)
    limit = request.args.get("limit", default=20, type=int)
    limit = min(max(limit, 1), 100)
    offset = (page - 1) * limit

    if not db_path.exists():
        return jsonify(
            {
                "status": "ok",
                "page": page,
                "limit": limit,
                "total": 0,
                "items": [],
            }
        )

    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        total = connection.execute("SELECT COUNT(*) AS total FROM movies").fetchone()["total"]
        rows = connection.execute(
            """
            SELECT
                id,
                tmdb_id,
                title,
                poster_path,
                runtime,
                release_year,
                original_language,
                popularity,
                vote_count
            FROM movies
            ORDER BY popularity DESC, vote_count DESC, id DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        ).fetchall()

    items = [dict(row) for row in rows]

    return jsonify(
        {
            "status": "ok",
            "page": page,
            "limit": limit,
            "total": total,
            "items": items,
        }
    )
