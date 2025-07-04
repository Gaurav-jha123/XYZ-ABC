import requests
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import base64
from typing import Optional
import torch
import uvicorn
import os
import traceback

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from util.utils import check_ocr_box, get_yolo_model, get_caption_model_processor, get_som_labeled_img

app = FastAPI()
GEMINI_API_URL = "http://localhost:5000/api/gemini/generate"

# Load models
yolo_model = get_yolo_model(model_path='weights/icon_detect/model.pt')
caption_model_processor = get_caption_model_processor(model_name="florence2",
                                                      model_name_or_path="weights/icon_caption_florence")

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


# 🚀 Middleware to Limit Request Size
class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_size: int):
        super().__init__(app)
        self.max_size = max_size  # Max upload size in bytes

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_size:
            return Response("Request entity too large", status_code=413)

        return await call_next(request)


# ✅ Add middleware for upload limit (100MB)
app.add_middleware(LimitUploadSizeMiddleware, max_size=100 * 1024 * 1024)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# 🚀 Function to Process Image
def process(image_input, box_threshold, iou_threshold, use_paddleocr, imgsz) -> Optional[tuple]:
    image_save_path = 'imgs/saved_image_demo.png'
    image_input.save(image_save_path)
    image = Image.open(image_save_path)

    box_overlay_ratio = image.size[0] / 3200
    draw_bbox_config = {
        'text_scale': 0.8 * box_overlay_ratio,
        'text_thickness': max(int(2 * box_overlay_ratio), 1),
        'text_padding': max(int(3 * box_overlay_ratio), 1),
        'thickness': max(int(3 * box_overlay_ratio), 1),
    }

    ocr_bbox_rslt, is_goal_filtered = check_ocr_box(
        image_save_path, display_img=False, output_bb_format='xyxy', goal_filtering=None,
        easyocr_args={'paragraph': False, 'text_threshold': 0.9}, use_paddleocr=use_paddleocr
    )
    text, ocr_bbox = ocr_bbox_rslt

    dino_labeled_img, label_coordinates, parsed_content_list = get_som_labeled_img(
        image_save_path, yolo_model, BOX_TRESHOLD=box_threshold, output_coord_in_ratio=True,
        ocr_bbox=ocr_bbox, draw_bbox_config=draw_bbox_config, caption_model_processor=caption_model_processor,
        ocr_text=text, iou_threshold=iou_threshold, imgsz=imgsz
    )

    parsed_content_list = '\n'.join([f'icon {i}: {v}' for i, v in enumerate(parsed_content_list)])

    return dino_labeled_img, parsed_content_list


# 🚀 Function to Decode Base64 in Chunks
def decode_base64_in_chunks(base64_str, chunk_size=4 * 1024 * 1024):  # 4MB chunks
    decoded_data = bytearray()
    for i in range(0, len(base64_str), chunk_size):
        chunk = base64_str[i:i + chunk_size]
        decoded_data.extend(base64.b64decode(chunk))
    return bytes(decoded_data)


# 🚀 Process Image API (File or Base64)
@app.post("/process/")
async def process_image(
        image: Optional[UploadFile] = File(None),
        image_base64: Optional[str] = Form(None),
        prompt: str = Form(None),
        box_threshold: float = Form(0.05),
        iou_threshold: float = Form(0.1),
        use_paddleocr: bool = Form(True),
        imgsz: int = Form(640)
):
    try:
        # Ensure at least one input is provided
        if not image and not image_base64:
            raise HTTPException(status_code=400, detail="Either 'image' or 'image_base64' must be provided.")

        if image:
            image_bytes = await image.read()
            image_pil = Image.open(io.BytesIO(image_bytes))
        else:
            try:
                image_data = decode_base64_in_chunks(image_base64)
                image_pil = Image.open(io.BytesIO(image_data))
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid base64 image format.")

        # Process image
        processed_image, parsed_text = process(image_pil, box_threshold, iou_threshold, use_paddleocr, imgsz)

        # Prepare Gemini API request
        gemini_payload = {
            "message": prompt,
            "semantics": parsed_text
        }
        gemini_headers = {"Content-Type": "application/json"}
        gemini_response = requests.post(GEMINI_API_URL, json=gemini_payload, headers=gemini_headers)

        # If successful, get the Gemini response
        if gemini_response.status_code == 200:
            print(gemini_response.text)
        else:
            return JSONResponse(
                content={"error": "Failed to get response from Gemini API", "details": gemini_response.text},
                status_code=gemini_response.status_code
            )

        print("User Prompt:", prompt)
        print("OmniParser Response:", parsed_text)
        print("Gemini Response:", gemini_response.text)

        return JSONResponse(content={
            "gemini_response": gemini_response.text
        })

    except Exception as e:
        error_details = traceback.format_exc()
        print(f"❌ Error in FastAPI processing:\n{error_details}")  # Debugging log
        return JSONResponse(content={"error": str(e), "details": error_details}, status_code=500)


# 🚀 Run Uvicorn Server with Increased Upload Limit
if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8000))  # Allow dynamic port assignment

    # Use a configuration object to set HTTP body limit
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=PORT,
        log_level="info",
        forwarded_allow_ips="*",  # (Optional) Allow proxy forwarding
        limit_max_requests=None  # No limit on requests
    )

    # Increase request size limit using environment variable
    import os

    os.environ["UVICORN_HTTP_BODY_LIMIT"] = "100000000"  # 100MB limit

    # Run Uvicorn server with the custom configuration
    server = uvicorn.Server(config)
    server.run()