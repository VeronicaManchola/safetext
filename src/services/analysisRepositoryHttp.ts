import { http } from "@api//client";
import { Analysis } from "@domain//entities/Analysis";
import { Message } from "@domain//entities/Message";
import { AnalysisRepository } from "@domain//repositories/AnalysisRepository";

export const analysisRepositoryHttp: AnalysisRepository = {
  async analyze(input: Message): Promise<Analysis> {
    // endpoint ejemplo POST /analyze
    return http<Analysis>("/analyze", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async history(page = 1): Promise<Analysis[]> {
    return http<Analysis[]>(`/history?page=${page}`);
  },
};
