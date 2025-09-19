type ApiResponse = {
  label: 'safe' | 'smishing';
  risk_score: number;
  score?: number;
  signals?: string[];
  model_version?: string;
};

export async function analyzeViaApi(
  text: string,
  url?: string,
): Promise<{
  label: 'Mensaje seguro' | 'Posible smishing';
  score: number;
  signals: string[];
}> {
  const ANALYSIS_API_URL = process.env.EXPO_PUBLIC_ANALYSIS_API_URL;
  const ANALYSIS_API_KEY = process.env.EXPO_PUBLIC_ANALYSIS_API_KEY;

  try {
    const res = await fetch(`${ANALYSIS_API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ANALYSIS_API_KEY ? { 'x-api-key': ANALYSIS_API_KEY } : {}),
      },
      body: JSON.stringify({ text, url }),
    });
    if (!res.ok) throw new Error(await safeMsg(res));

    if (!res.ok) {
      const msg = await safeMsg(res);
      throw new Error(`Error API análisis. ${msg}`);
    }

    const data: ApiResponse = await res.json();
    return {
      label: data.label === 'smishing' ? 'Posible smishing' : 'Mensaje seguro',
      score: typeof data.score === 'number' ? data.score : data.risk_score / 100,
      signals: data.signals ?? [],
    };
  } catch (err: any) {
    console.log('fetch to', ANALYSIS_API_URL, 'failed:', err?.message);
    throw new Error('No se pudo contactar a la API de análisis.');
  }
}

async function safeMsg(res: Response) {
  try {
    const j = await res.json();
    return j.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
