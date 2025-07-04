# 📌 GEMINI.API Endpoints

## 🌐 Base URL
The base URL of the API depends on the environment and port number:
- **Development:** `http://localhost:<PORT>/api`
- **Production:** `https://your-production-domain.com/api`

### Example:
For a local setup running on port 5000:
```sh
http://localhost:5000/api/gemini/generate
```
For a production setup:
```sh
https://api.yourdomain.com/api/gemini/generate
```

---

## 🔹 Endpoint: `gemini/generate`
**Method:** `POST`

### 📤 Request Body

#### 1️⃣ Text-only request (No multimedia):
```json
{
    "contents": [
        {
            "parts": [
                {
                    "text": "<<Prompt>>"
                }
            ]
        }
    ]
}
```

#### 2️⃣ Request with multimedia:
```json
{
    "contents": [
        {
            "parts": [
                {
                    "inline_data": {
                        "mime_type": "<<MIME_TYPE>>",
                        "data": "<<Prompt Multimedia Data>>"
                    }
                },
                {
                    "text": "<<Prompt>>"
                }
            ]
        }
    ]
}
```