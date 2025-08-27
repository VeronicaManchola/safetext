import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from model_inference import analyze_text

load_dotenv()

API_KEY = os.getenv("API_KEY", "")
ALLOWED = os.getenv("CORS_ORIGINS", "*")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ALLOWED}})

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/api/analyze")
def analyze():
    if API_KEY and request.headers.get("x-api-key") != API_KEY:
        return jsonify({"error": "unauthorized"}), 401

    payload = request.get_json(silent=True) or {}
    text = (payload.get("text") or "").strip()
    url = payload.get("url")

    if not text:
        return jsonify({"error": "text requerido"}), 400

    result = analyze_text(text, url)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)