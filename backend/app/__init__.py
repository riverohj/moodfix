from flask import Flask, jsonify
from flask_cors import CORS

from .db import init_db
from .routes import api
from .session_routes import session_api
from .user import auth_api, profile_api


def crear_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    init_db()

    @app.get("/")
    def raiz():
        return jsonify(
            {
                "ok": True,
                "service": "moodfix-backend",
            }
        )

    @app.get("/health")
    def healthcheck_publico():
        return jsonify({"ok": True})

    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(session_api, url_prefix="/api")
    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(profile_api, url_prefix="/api")
    return app
