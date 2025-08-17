import { AnalysisRepository } from "../repositories/AnalysisRepository";
export const getHistory =
  (repo: AnalysisRepository) =>
  async (page = 1) =>
    repo.history(page);
