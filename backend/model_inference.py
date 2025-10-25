import os
import re
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from url_reputation import phishtank_check, gsb_check

MODEL_PATH = os.getenv("MODEL_NAME_OR_PATH", "./artifacts/model")
THRESHOLD = float(os.getenv("THRESHOLD", "0.5"))
MAX_LENGTH = int(os.getenv("MAX_LENGTH", "256"))
MODEL_VERSION = os.getenv("MODEL_VERSION", "hf-1.0")

# "max" | "noisy_or" | "weighted"
COMBINE_MODE = os.getenv("COMBINE_MODE", "max").lower()
URL_WEIGHT = float(os.getenv("URL_WEIGHT", "0.5"))

_tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
_model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
_model.eval()

_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_model.to(_device)

id2label = getattr(_model.config, "id2label", None) or {0: "safe", 1: "phishing"}
id2label = {int(k): str(v).lower() for k, v in id2label.items()}
label2id = {v: k for k, v in id2label.items()}
phish_id = label2id.get("phishing", 1)

def _softmax(logits):
    return torch.nn.functional.softmax(logits, dim=-1)

def _combine(p_text: float, p_url: float) -> float:
    if COMBINE_MODE == "noisy_or":
        return 1.0 - (1.0 - p_text) * (1.0 - p_url)
    if COMBINE_MODE == "weighted":
        a = max(0.0, min(1.0, URL_WEIGHT))
        return a * p_url + (1.0 - a) * p_text
    return max(p_text, p_url)

def analyze_text(text: str, url: str | None = None) -> dict:
    raw_text = text or ""
    signals: list[str] = []

    # Modelo
    with torch.no_grad():
        enc = _tokenizer(
            raw_text[:4000],
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LENGTH,
        )
        enc = {k: v.to(_device) for k, v in enc.items()}
        out = _model(**enc)
        probs = _softmax(out.logits).detach().cpu().numpy()[0].tolist()

    p_model = float(probs[phish_id])
    signals.append(f"Probabilidad de smishing: {p_model:.2f}")

    if url and not str(url).startswith("https://"):
        signals.append("URL sin https")
    if re.search(r"(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|shorturl\.at|v1\.mk)", raw_text, flags=re.I):
        signals.append("Acortador de enlaces detectado")

    p_url = 0.0
    if url:
        s1, r1 = phishtank_check(url)
        s2, r2 = gsb_check(url)
        p_url = max(s1, s2)
        signals.extend([r1, r2])

    p_final = _combine(p_model, p_url)
    label = "smishing" if p_final >= THRESHOLD else "safe"

    return {
        "label": label,
        "score": p_final,
        "risk_score": int(round(p_final * 100)),
        "signals": signals,
        "model_version": MODEL_VERSION,
        "components": {"p_text": p_model, "p_url": p_url, "mode": COMBINE_MODE},
    }
