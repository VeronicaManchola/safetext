
import re

SUS_PHRASES = [
    "verifica tu cuenta", "urgente", "tu cuenta será bloqueada",
    "haz clic aquí", "ganaste", "premio", "confirmar contraseña"
]

def analyze_text(text: str, url: str | None = None) -> dict:
    txt = (text or "").lower()
    signals = []

    for p in SUS_PHRASES:
        if p in txt:
            signals.append(f"Frase sospechosa: {p}")

    if url and not url.startswith("https://"):
        signals.append("URL sin https")

    if re.search(r"(bit\.ly|tinyurl\.com|t\.co)", txt):
        signals.append("Acortador de enlaces")

    base = 0.15 if signals else 0.05
    score = min(1.0, base + 0.1 * len(signals))
    label = "phishing" if score >= 0.5 else "safe"

    return {
        "label": label,
        "score": score,
        "risk_score": int(round(score * 100)),
        "signals": signals,
        "model_version": "heuristics-0.1.0"
    }