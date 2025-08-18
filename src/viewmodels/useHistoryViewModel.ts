import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Analysis } from '@domain/entities/analysis';
import type { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

import { AnalysisRepositorySupabase } from '@data/repositories/AnalysisRepositorySupabase';

function getHistory(repo: AnalysisRepository) {
  return async ({
    page = 1,
    pageSize = 10,
  }: {
    page?: number;
    pageSize?: number;
  }): Promise<{
    items: Analysis[];
    hasMore: boolean;
  }> => {
    const from = (page - 1) * pageSize;
    const rows = await repo.listPaged(from, pageSize);
    const hasMore = rows.length === pageSize;

    return { items: rows, hasMore };
  };
}

type UIHistoryItem = {
  id: string;
  label: 'Mensaje seguro' | 'Posible phishing';
  score: number; // 0–1
  snippet: string;
  createdAt?: string;
};

type Deps = {
  repo?: AnalysisRepository;
  pageSize?: number;
};

export function useHistoryViewModel(deps?: Deps) {
  const repo = deps?.repo ?? AnalysisRepositorySupabase;
  const pageSize = deps?.pageSize ?? 10;

  // Estado UI
  const [items, setItems] = useState<UIHistoryItem[]>([]);
  const [page, setPage] = useState(1); // 1-based
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Caso de uso instanciado con el repo elegido
  const historyUC = useMemo(() => getHistory(repo), [repo]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(undefined);
    try {
      // Aquí está el uso exacto que mencionaste:
      const { items: rows, hasMore: nextHasMore } = await historyUC({ page, pageSize: pageSize });

      // Mapeo a DTO de UI
      const mapped = rows.map(mapRowToUI);

      setItems((prev) => [...prev, ...mapped]);
      setHasMore(nextHasMore);
      if (nextHasMore) setPage((p) => p + 1);
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible cargar el historial');
    } finally {
      setLoading(false);
    }
  }, [historyUC, page, pageSize, hasMore, loading]);

  // Carga inicial
  useEffect(() => {
    if (items.length === 0) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // datos
    history: items,
    hasMore,
    loading,
    error,

    // acciones
    loadMore,

    // helpers para la vista (opcional)
    isEmpty: !loading && items.length === 0,
  };
}

/* Helpers */

function mapRowToUI(row: Analysis): UIHistoryItem {
  const label = row.label === 'phishing' ? 'Posible phishing' : 'Mensaje seguro';
  const score = clamp01((row.risk_score ?? 0) / 100);
  const raw = (row.message_text || '').trim();
  const snippet = raw.length > 120 ? raw.slice(0, 120) + '…' : raw || '(sin texto)';
  return { id: row.id, label, score, snippet, createdAt: row.created_at };
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
