import { Analysis } from '@domain/entities/analysis';
import { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

import { supabase } from '@data/sources/supabaseClient';

const TABLE = 'analyses';

export const AnalysisRepositorySupabase: AnalysisRepository = {
  /**
   * Crea un registro de análisis. Se asume que user_id viene validado
   * (por ejemplo, desde supabase.auth.getUser()) y que RLS está activo.
   */
  async create(input: Omit<Analysis, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from(TABLE).insert(input as any);
    if (error) throw error;
  },

  /**
   * Retorna una página de historial ordenada por created_at desc.
   */
  async listPaged(from: number, limit: number): Promise<Analysis[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) throw error;
    return (data ?? []) as Analysis[];
  },
};
