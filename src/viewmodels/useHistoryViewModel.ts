import { useCallback, useEffect, useMemo, useState } from 'react';

import { AnalysisRepositorySupabase } from '@data/repositories/AnalysisRepositorySupabase';

import type { Analysis } from '@domain/entities/analysis';
import type { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

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
  score: number;
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

  const [items, setItems] = useState<UIHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const historyUC = useMemo(() => getHistory(repo), [repo]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(undefined);
    try {
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

  useEffect(() => {
    if (items.length === 0) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    history: items,
    hasMore,
    loading,
    error,

    loadMore,

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
