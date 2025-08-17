import { Analysis } from "../entities/Analysis";
import { Message } from "../entities/Message";

export interface AnalysisRepository {
  analyze(input: Message): Promise<Analysis>;
  history(page?: number): Promise<Analysis[]>;
}
