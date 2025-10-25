import os
import requests

PT_ENDPOINT = "https://checkurl.phishtank.com/checkurl/"
GSB_API_KEY = os.getenv("GSB_API_KEY", "")
TIMEOUT = int(os.getenv("URL_REPUTATION_TIMEOUT_MS", "2500")) / 1000.0
UA = "safetext/0.1 (tesis-unab)"

def phishtank_check(url: str):
    data = {"url": url, "format": "json"}
    headers = {"User-Agent": UA}
    try:
        r = requests.post(PT_ENDPOINT, data=data, headers=headers, timeout=TIMEOUT)
        if r.status_code in (403, 429):
            return 0.0, f"PhishTank: no disponible"
        r.raise_for_status()
        j = r.json().get("results", {})
        in_db = bool(j.get("in_database"))
        verified = str(j.get("verified", "")).lower() in ("y", "yes", "true", "1")
        valid = str(j.get("valid", "")).lower() in ("y", "yes", "true", "1")

        if in_db and verified and valid:
            return 1.0, "PhishTank: listado, verificado y vigente"
        if in_db and verified and not valid:
            return 0.3, "PhishTank: listado, pero no vigente"
        if in_db and not verified:
            return 0.2, "PhishTank: listado, sin verificación"
        return 0.0, "PhishTank: no listado"
    except Exception as e:
        return 0.0, f"PhishTank: error transitorio"

def gsb_check(url: str):
    if not GSB_API_KEY:
        return 0.0, "Safe Browsing: sin API key"

    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GSB_API_KEY}"
    payload = {
        "client": {"clientId": "safetext", "clientVersion": "0.1"},
        "threatInfo": {
            "threatTypes": [
                "SOCIAL_ENGINEERING", "MALWARE", "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    try:
        r = requests.post(endpoint, json=payload, timeout=TIMEOUT)
        r.raise_for_status()
        j = r.json()
        matches = j.get("matches", [])
        if not matches:
            return 0.0, "Safe Browsing: sin coincidencias"
        tt = sorted({m.get("threatType", "UNKNOWN") for m in matches})
        return 1.0, f"Safe Browsing: amenazas {', '.join(tt)}"
    except Exception:
        return 0.0, "Safe Browsing: error transitorio"
