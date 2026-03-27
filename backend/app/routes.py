from flask import Blueprint, jsonify


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

