from flask import Flask
from config import Config
import google.generativeai as genai
from app.routes import register_blueprints

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    genai.configure(api_key = Config.GEMINI_API_KEY)

    register_blueprints(app)

    return app
