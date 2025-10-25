import { useEffect, useMemo, useState } from 'react';

import { AnalysisRepositorySupabase } from '@data/repositories/AnalysisRepositorySupabase';
import { analyzeLocally } from '@data/services/analysisLocalHeuristics';
import { supabase } from '@data/sources/supabaseClient';

import { Analysis } from '@domain/entities/analysis';
import { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

type UIResult = {
  label: 'Mensaje posiblemente seguro' | 'Posible smishing';
  score: number; // 0–1
  signals: string[];
};

type UIHistoryItem = {
  id: string;
  label: 'Mensaje posiblemente seguro' | 'Posible smishing';
  score: number; // 0–1
  snippet: string;
  createdAt?: string;
};

type Deps = {
  repo?: AnalysisRepository;
  analyzer?: (
    text: string,
    url?: string,
  ) => Promise<{
    label: 'Mensaje posiblemente seguro' | 'Posible smishing';
    score: number;
    signals: string[];
  }>;
  currentUser?: () => Promise<{ id: string } | null>;
  pageSize?: number;
};

const DEFAULT_PAGE = 10;

function analyzeLocallyAsync(t: string) {
  const r = analyzeLocally(t);
  return Promise.resolve({
    label: r.label,
    score: r.score,
    signals: r.signals,
  });
}

/**
 * ViewModel para la pantalla de Análisis e Historial.
 * - Orquesta análisis local (o remoto si reemplazas analyzer)
 * - Persiste en Supabase vía repositorio
 * - Expone historial paginado para la UI
 */
export function useAnalysisViewModel(deps?: Deps) {
  const repo = deps?.repo ?? AnalysisRepositorySupabase;
  const analyzer = deps?.analyzer ?? analyzeLocallyAsync;
  const pageSize = deps?.pageSize ?? DEFAULT_PAGE;
  const getCurrentUser = deps?.currentUser ?? defaultGetCurrentUser;

  // Análisis
  const [text, setText] = useState('');
  const [result, setResult] = useState<UIResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Historial
  const [history, setHistory] = useState<UIHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [from, setFrom] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Errores compartidos
  const [error, setError] = useState<string | null>(null);

  // Carga inicial del historial
  useEffect(() => {
    if (history.length === 0) {
      // no await en useEffect top-level
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canScan = useMemo(() => text.trim().length > 0 && !loading, [text, loading]);

  async function scan() {
    if (!canScan) return;
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Sesión no válida');

      const url = extractUrl(text);
      const r = await analyzer(text, url);

      const toSave: Omit<Analysis, 'id' | 'created_at'> = {
        user_id: user.id,
        message_text: text,
        url,
        label: r.score >= 0.5 ? 'smishing' : 'safe',
        risk_score: Math.round(r.score * 100),
        signals: r.signals,
      };
      await repo.create(toSave);

      setResult(r);

      setHistory((prev) => [
        mapRowToUI({
          id: cryptoRandomId(),
          message_text: toSave.message_text,
          label: toSave.label,
          risk_score: toSave.risk_score,
          created_at: new Date().toISOString(),
        } as Analysis),
        ...prev,
      ]);
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible completar el análisis');
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (historyLoading || !hasMore) return;
    setHistoryLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Sesión no válida');

      const page = await repo.listPaged(user.id, from, pageSize);
      const mapped = page.map(mapRowToUI);

      setHistory((prev) => [...prev, ...mapped]);
      setFrom((p) => p + pageSize);
      if (page.length < pageSize) setHasMore(false);
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible cargar el historial');
    } finally {
      setHistoryLoading(false);
    }
  }

  return {
    // análisis
    text,
    setText,
    result,
    loading,
    canScan,
    scan,

    // historial
    history,
    hasMore,
    historyLoading,
    loadMore,

    // errores
    error,
  };
}

/* Helpers */

async function defaultGetCurrentUser(): Promise<{ id: string } | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id };
}

function extractUrl(t: string): string | undefined {
  if (!t) return undefined;
  const regex = /\b((?:https?:\/\/)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
  const match = t.match(regex);
  return match ? match[0] : undefined;
}

function mapRowToUI(row: Analysis): UIHistoryItem {
  const label = row.label === 'smishing' ? 'Posible smishing' : 'Mensaje posiblemente seguro';
  const score = clamp01((row.risk_score ?? 0) / 100);
  const raw = (row.message_text || '').trim();
  const snippet = raw.length > 120 ? raw.slice(0, 120) + '…' : raw || '(sin texto)';
  return {
    id: row.id,
    label,
    score,
    snippet,
    createdAt: row.created_at,
  };
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Fallback para generar un id si acabamos de “inyectar” el ítem localmente.
// En producción, prefiera devolver el id desde el insert con .select() o el trigger de Supabase.
function cryptoRandomId() {
  // Si existe global crypto
  // @ts-ignore
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return 'tmp-' + Math.random().toString(36).slice(2, 10);
}
