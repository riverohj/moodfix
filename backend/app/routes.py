import sqlite3

from flask import Blueprint, jsonify, request

from .db import get_db_path


api = Blueprint("api", __name__)


def _leer_paginacion() -> tuple[int, int, int]:
    pagina = max(request.args.get("page", default=1, type=int), 1)
    limite = request.args.get("limit", default=20, type=int)
    limite = min(max(limite, 1), 100)
    offset = (pagina - 1) * limite
    return pagina, limite, offset


def _respuesta_peliculas_vacia(pagina: int, limite: int) -> dict:
    return {
        "status": "ok",
        "page": pagina,
        "limit": limite,
        "total": 0,
        "items": [],
    }


def _leer_peliculas(db_path, limite: int, offset: int) -> tuple[int, list[dict]]:
    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        total = connection.execute("SELECT COUNT(*) AS total FROM movies").fetchone()["total"]
        filas = connection.execute(
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
            (limite, offset),
        ).fetchall()
    return total, [dict(fila) for fila in filas]


@api.get("/health")
def revisar_salud():
    return jsonify(
        {
            "status": "ok",
            "service": "moodfix-backend",
            "message": "Flask API boilerplate ready",
        }
    )


@api.get("/db/status")
def revisar_estado_bd():
    db_path = get_db_path()
    return jsonify(
        {
            "status": "ok",
            "database_path": str(db_path),
            "database_exists": db_path.exists(),
        }
    )


@api.get("/movies")
def listar_peliculas():
    db_path = get_db_path()
    pagina, limite, offset = _leer_paginacion()

    if not db_path.exists():
        return jsonify(_respuesta_peliculas_vacia(pagina, limite))

    total, items = _leer_peliculas(db_path, limite, offset)

    return jsonify(
        {
            "status": "ok",
            "page": pagina,
            "limit": limite,
            "total": total,
            "items": items,
        }
    )
