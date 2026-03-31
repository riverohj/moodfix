from flask import Blueprint, jsonify

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
