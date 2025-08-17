import { Analysis } from "@domain//entities/Analysis";
import { analyzeMessage } from "@domain//usecases/AnalyzeMessage";
import { getHistory } from "@domain//usecases/GetHistory";
import { analysisRepositoryHttp } from "@services//analysisRepositoryHttp";
import { useEffect, useState } from "react";

export function useAnalysisViewModel(repo = analysisRepositoryHttp) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scan() {
    setLoading(true);
    setError(null);
    try {
      const out = await analyzeMessage(repo)({ text });
      setResult(out);
      setHistory((h) => [out, ...h]);
    } catch (e: any) {
      setError(e.message ?? "Fallo al analizar");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    try {
      const next = page + 1;
      const list = await getHistory(repo)(next);
      setHistory((h) => [...h, ...list]);
      setPage(next);
    } catch {
      /* opcional manejo de error */
    }
  }

  useEffect(() => {
    getHistory(repo)(1)
      .then(setHistory)
      .catch(() => {});
  }, [repo]);

  return { text, setText, result, history, loading, error, scan, loadMore };
}
