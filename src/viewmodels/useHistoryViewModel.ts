import { useCallback, useEffect, useMemo, useState } from 'react';

import { AnalysisRepositorySupabase } from '@data/repositories/AnalysisRepositorySupabase';
import { supabase } from '@data/sources/supabaseClient';

import type { Analysis } from '@domain/entities/analysis';
import type { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

function getHistory(repo: AnalysisRepository) {
  return async ({
    userId,
    page = 1,
    pageSize = 10,
  }: {
    userId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Analysis[]; hasMore: boolean }> => {
    const from = (page - 1) * pageSize;
    const rows = await repo.listPaged(userId, from, pageSize);
    const hasMore = rows.length === pageSize;
    return { items: rows, hasMore };
  };
}

type UIHistoryItem = {
  id: string;
  label: 'Mensaje posiblemente seguro' | 'Posible smishing';
  score: number;
  snippet: string;
  createdAt?: string;
};

type Deps = {
  repo?: AnalysisRepository;
  pageSize?: number;
  currentUser?: () => Promise<{ id: string } | null>;
  realtime?: boolean;
};

export function useHistoryViewModel(deps?: Deps) {
  const repo = deps?.repo ?? AnalysisRepositorySupabase;
  const pageSize = deps?.pageSize ?? 10;
  const getCurrentUser = deps?.currentUser ?? defaultGetCurrentUser;
  const enableRealtime = deps?.realtime ?? true;

  const historyUC = useMemo(() => getHistory(repo), [repo]);

  const [items, setItems] = useState<UIHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUserId(u?.id ?? null);
    })();
  }, [getCurrentUser]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !userId) return;
    setLoading(true);
    setError(undefined);
    try {
      const { items: rows, hasMore: nextHasMore } = await historyUC({ userId, page, pageSize });
      const mapped = rows.map(mapRowToUI);
      setItems((prev) => [...prev, ...mapped]);
      setHasMore(nextHasMore);
      if (nextHasMore) setPage((p) => p + 1);
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible cargar el historial');
    } finally {
      setLoading(false);
    }
  }, [historyUC, page, pageSize, hasMore, loading, userId]);

  const reload = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    setError(undefined);
    try {
      const { items: rows, hasMore: nextHasMore } = await historyUC({ userId, page: 1, pageSize });
      const mapped = rows.map(mapRowToUI);
      setItems(mapped);
      setPage(nextHasMore ? 2 : 1);
      setHasMore(nextHasMore);
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible recargar el historial');
    } finally {
      setRefreshing(false);
    }
  }, [historyUC, pageSize, userId]);

  useEffect(() => {
    if (userId && items.length === 0) {
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!enableRealtime || !userId) return;
    const channel = supabase
      .channel('analyses-inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analyses', filter: `user_id=eq.${userId}` },
        (payload) => {
          const row = payload.new as Analysis;
          // Evita duplicados si ya está en la lista
          setItems((prev) => {
            if (prev.some((i) => i.id === row.id)) return prev;
            return [mapRowToUI(row), ...prev];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime, userId]);

  return {
    history: items,
    hasMore,
    loading,
    refreshing,
    error,
    loadMore,
    reload,
    isEmpty: !loading && items.length === 0,
  };
}

function mapRowToUI(row: Analysis): UIHistoryItem {
  const label = row.label === 'smishing' ? 'Posible smishing' : 'Mensaje posiblemente seguro';
  const score = clamp01((row.risk_score ?? 0) / 100);
  const raw = (row.message_text || '').trim();
  const snippet = raw.length > 120 ? raw.slice(0, 120) + '…' : raw || '(sin texto)';
  return { id: row.id, label, score, snippet, createdAt: row.created_at };
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

async function defaultGetCurrentUser(): Promise<{ id: string } | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id };
}
