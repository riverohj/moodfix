from flask import Flask
from flask_cors import CORS

from .db import init_db
from .routes import api


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    init_db()
    app.register_blueprint(api, url_prefix="/api")
    return app
