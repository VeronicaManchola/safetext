type ApiResponse = {
  label: 'safe' | 'phishing';
  risk_score: number;
  score?: number;
  signals?: string[];
  model_version?: string;
};

export async function analyzeViaApi(
  text: string,
  url?: string,
): Promise<{
  label: 'Mensaje seguro' | 'Posible phishing';
  score: number;
  signals: string[];
}> {
  const ANALYSIS_API_URL = process.env.EXPO_PUBLIC_ANALYSIS_API_URL;
  const ANALYSIS_API_KEY = process.env.EXPO_PUBLIC_ANALYSIS_API_KEY;
  console.log('ANALYSIS_API_URL', ANALYSIS_API_URL);

  const res = await fetch(`${ANALYSIS_API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(ANALYSIS_API_KEY ? { 'x-api-key': ANALYSIS_API_KEY } : {}),
    },
    body: JSON.stringify({ text, url }),
  });

  console.log('analyzeViaApi res', res.status, res.statusText);

  if (!res.ok) {
    const msg = await safeMsg(res);
    throw new Error(`Error API análisis. ${msg}`);
  }

  const data: ApiResponse = await res.json();
  return {
    label: data.label === 'phishing' ? 'Posible phishing' : 'Mensaje seguro',
    score: typeof data.score === 'number' ? data.score : data.risk_score / 100,
    signals: data.signals ?? [],
  };
}

async function safeMsg(res: Response) {
  try {
    const j = await res.json();
    return j.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
