import { Analysis } from '@domain/entities/analysis';
import { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

import { supabase } from '@data/sources/supabaseClient';

const TABLE = 'analyses';

export const AnalysisRepositorySupabase: AnalysisRepository = {
  async create(input) {
    const { error } = await supabase.from(TABLE).insert(input as any);
    if (error) throw error;
  },
  async listPaged(from, limit) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) throw error;
    return (data ?? []) as Analysis[];
  },
};
