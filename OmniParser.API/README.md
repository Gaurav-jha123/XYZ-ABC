# 📸 OmniParser API Application Setup Guide

🚀 A FastAPI-based application for processing images, detecting objects using YOLO, and performing OCR.

## 📖 Table of Contents
- [✨ Features](#-features)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Running the Application](#-running-the-application)
- [🧪 How the Setup Works](#-setup-steps)
- [📡 API Endpoints](#-api-endpoints)
- [🐞 Troubleshooting](#-troubleshooting)

---

## ✨ Features
✅ API with OmniParser Image Processing Model

---
## ⚙️ Prerequisites

Before installing and running the application, ensure that you have the following:

### 1️⃣ **Install Miniconda (Recommended)**
- **Windows:** Download & install from [here](https://docs.conda.io/en/latest/miniconda.html)  
- **Linux/macOS:** Install using:
  ```sh
  wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
  bash Miniconda3-latest-Linux-x86_64.sh

## ▶️ Running the Application

Run the setup script, which will:
✅ Create a virtual environment
✅ Install dependencies
✅ Start the Flask app based on environment variables

```sh
python setup.py
```

## 🛠️ How the Setup Works

- The script checks whether the **conda** is installed or not.
- It **creates and activates a virtual environment**.
- It **installs required dependencies** from `requirements.txt`.
- The **application is starting** by running `api.py`
- Using **pytest** in `test.py` checks whether the ***API is working or not***.

## 📡 API Endpoints
- URL: POST `/process/`
- Description: Uploads an image for processing
Request:
```sh
curl -X 'POST' 'http://localhost:8000/process/' \
  -F 'image=@test_images/sample.jpg' \
  -F 'box_threshold=0.05' \
  -F 'iou_threshold=0.1' \
  -F 'use_paddleocr=true' \
  -F 'imgsz=640'
```



