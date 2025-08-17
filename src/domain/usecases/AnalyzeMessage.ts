import { Message } from "../entities/Message";
import { AnalysisRepository } from "../repositories/AnalysisRepository";

export const analyzeMessage =
  (repo: AnalysisRepository) => async (input: Message) =>
    repo.analyze(input);
