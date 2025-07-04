import json
import google.generativeai as genai
from config import Config
from app.models.chat_response import ChatResponse
from app.models.chat_prompt import ChatPrompt

model = genai.GenerativeModel(
    model_name=Config.GEMINI_MODEL,
    generation_config={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain"
    }
)

MASTER_PROMPT = {
    "role": "user",
    "parts": [
        {
            "text": (
                "You are a helpful AI assistant for the Ustora shopping application.\n\n"
                "Your role is to assist users by providing guidance on navigation, explanation and resolving their queries about the application based on the prompt provided and the current screen semantics.\n\n"
                "You will receive:\n"
                "- A user prompt containing their request.\n"
                "- Semantics extracted from current screenshot of the web application.\n\n"
                "**Rules:**\n"
                "1. You must strictly respond only to queries related to the Ustora shopping application.\n"
                "2. Do not provide responses on any other topics.\n"
                "3. Ensure that your answers are accurate, concise, and relevant to the user's request.\n"
                "4. Your response **must be a valid JSON object** that can be parsed without errors.\n"
                "5. Do not cache the previous responses, but you can use that context and give response for current user question or prompt.\n"
                "**Response Format:**\n"
                "Your response must be a **well-formed JSON object** following this schema:\n"
                "{\n"
                '  "explanation": "string",  // Add entire response to the user in this property value\n'
                '  "targetControlId": "string",  // Control details extracted from given screen semantics\n'
                '  "actionInstruction": "string"   // Action instruction for the user/application\n'
                "}\n\n"
                
                "**Important:**\n"
                "- **DO NOT** wrap the entire JSON object inside another string.\n"
                "- **DO NOT** include backslashes (`\\`) or improperly escaped characters.\n"
                "- **Ensure** that the response is **pure JSON** without additional explanations.\n"
                "Use only single quote to highlight any text and do not use double quotes.\n"
            )
        }
    ]
}

def generate_chat_response(chat_prompt: ChatPrompt) -> ChatResponse:
    try:
        chat_session = model.start_chat(history=MASTER_PROMPT)
        response = chat_session.send_message({
            "role": "user",
            "parts": [
                {
                    "text": json.dumps(chat_prompt)
                }
            ]
        }, stream=False)

        try:
            json_data = json.loads(response.text)
            chat_response = ChatResponse(**json_data)
            print(chat_response) 
            return chat_response.model_dump_json()

        except json.JSONDecodeError:
            return ChatResponse(
                text=response.text,
                error="Failed to generate valid response."
            ).model_dump_json()

        except Exception as e:
            return ChatResponse(
                text=response.text,
                error=f"An unexpected error occurred: {str(e)}"
            ).model_dump_json()

    except ValueError as ve:
        return ChatResponse(error=str(ve), text="").model_dump_json()
    except Exception as e:
        return ChatResponse(error=f"An unexpected error occurred: {str(e)}", text="").model_dump_json()