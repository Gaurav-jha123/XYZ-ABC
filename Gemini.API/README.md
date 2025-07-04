# 🚀 GEMINI.API Application Setup Guide

This guide explains how to set up and run the GEMINI.API application in **both development and production environments** on **Windows and Linux**.

## 📌 Prerequisites

Before running the application, ensure you have the following installed:

- **Python 3.7+** (Check using `python --version` or `python3 --version`)
- **pip** (Python package manager)
- **Virtual environment support** (Comes with Python 3)

---

## 🔑 Environment Variables

The application requires the following environment variables, which are stored in the `.env` file:

```ini
GEMINI_MODEL="gemini-2.0-flash"
GEMINI_API_KEY="AIzaSyCMP7upEjEgwksEUdd25R4fK0JiHMCPz8"
```


---

## Set Up Environment Variables

You can set environment variables before running the setup script.

- **Development Mode (default)**
  ```sh
  export FLASK_ENV=development
  export PORT=5000
  ```
  On **Windows (CMD)**:
  ```cmd
  set FLASK_ENV=development
  set PORT=5000
  ```
- **Production Mode**
  ```sh
  export FLASK_ENV=production
  export PORT=80
  ```
  On **Windows (CMD)**:
  ```cmd
  set FLASK_ENV=production
  set PORT=80
  ```

---

## ▶️ Running the Application

Run the setup script, which will:
✅ Create a virtual environment
✅ Install dependencies
✅ Start the Flask app based on environment variables

```sh
python setup.py
```

### **Alternative Windows Command (PowerShell)**
```powershell
python setup.py
```

---

## 🛠️ How the Setup Works

- The script detects the **OS (Windows/Linux)**.
- It **creates and activates a virtual environment**.
- It **installs required dependencies** from `requirements.txt`.
- It **reads environment variables** (`FLASK_ENV`, `PORT`) and starts the app accordingly.
- The application runs in **development** mode by default but switches to **production** if `FLASK_ENV=production` is set.
