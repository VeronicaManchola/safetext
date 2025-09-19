import type { Analysis } from '@domain/entities/analysis';

export interface AnalysisRepository {
  create(input: Omit<Analysis, 'id' | 'created_at'>): Promise<void>;
  listPaged(userId: string, from: number, limit: number): Promise<Analysis[]>;
}
