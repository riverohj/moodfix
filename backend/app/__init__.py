from flask import Flask
from flask_cors import CORS

from .db import init_db
from .routes import api
from .user import auth_api, profile_api


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    init_db()
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(profile_api, url_prefix="/api")
    return app
