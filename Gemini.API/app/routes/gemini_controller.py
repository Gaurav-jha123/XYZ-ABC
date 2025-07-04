from flask import Blueprint, request, Response, jsonify
from pydantic import ValidationError
from app.models.chat_prompt import ChatPrompt
from app.services.gemini_service import generate_chat_response

gemini_bp = Blueprint('gemini_controller', __name__)

@gemini_bp.route('/gemini/generate', methods=['POST'])
def generate_api():
    try:
        data = request.json
        validated_data = ChatPrompt(**data)

        response = generate_chat_response(validated_data.model_dump())

        return Response(response, content_type='text/application-json', status=200)

    except ValidationError as ve:
        return jsonify({"error": "Invalid input", "details": ve.errors()}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
