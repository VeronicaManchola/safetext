import type { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

type Params = {
  page?: number;
  pageSize?: number;
};

export const getHistory =
  (repo: AnalysisRepository) =>
  async ({ page = 1, pageSize = 10 }: Params = {}) => {
    const from = (page - 1) * pageSize;
    const limit = pageSize;
    const rows = await repo.listPaged(from, limit);
    const hasMore = rows.length === pageSize;
    return { items: rows, hasMore };
  };
