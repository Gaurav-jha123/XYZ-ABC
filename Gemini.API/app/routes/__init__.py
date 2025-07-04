from flask import send_file
from app.routes.gemini_controller import gemini_bp
from app.routes.path import path_bp
import os

def register_blueprints(app):
    @app.route("/")
    def index():
        file_path = os.path.abspath("web/index.html")
        return send_file(file_path)

    app.register_blueprint(path_bp)
    app.register_blueprint(gemini_bp, url_prefix='/api')