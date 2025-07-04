import socket

import pytest
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get API base URL from .env, default to localhost if not set
local_ip = socket.gethostbyname(socket.gethostname())
BASE_URL = os.getenv("BASE_URL", f"http://{local_ip}:8000").strip()

# Ensure BASE_URL includes http and port
if not BASE_URL.startswith("http"):
    BASE_URL = f"http://{BASE_URL}:8000"


def test_process_endpoint():
    """Test the /process/ endpoint by sending an image file."""
    image_path = os.path.abspath(os.path.join("imgs", "amazon_snapshot.png"))
    assert os.path.exists(image_path), f"Test image not found!: {image_path}"

    with open(image_path, "rb") as img:
        files = {"image": img}
        data = {
            "prompt": "Can you please tell me how to login? Please use the below data to determine-",
            "box_threshold": 0.05,
            "iou_threshold": 0.1,
            "use_paddleocr": True,
            "imgsz": 640
        }
        response = requests.post(f"{BASE_URL}/process/", files=files, data=data)
    assert response.status_code == 200, f"❌ Expected 200, got {response.status_code} | Response: {response.text}"
    json_response = response.json()
    assert "gemini_response" in json_response, f"❌ Response missing 'gemini_response' field | Response: {json_response}"


API_URL = "http://localhost:5000/api/gemini/generate"


# The above test already checks the Gemini and Omniparser API and its integration working fine or not.
@pytest.mark.skip
def test_gemini_generate():
    """
    Test the Gemini API endpoint with different text inputs.
    """
    # Prepare request payload
    payload = {
        "message": "What are the products available?",
        "semantics": {}
    }
    headers = {"Content-Type": "application/json"}

    # Send POST request
    response = requests.post(API_URL, json=payload, headers=headers)

    # Assert the response status code
    assert response.status_code == 200, f"Unexpected status: {response.text}"


if __name__ == "__main__":
    pytest.main()
