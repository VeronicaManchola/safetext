import { AnalysisRepository } from '@domain/repositories/AnalysisRepository';

export type AnalyzeInput = {
  user_id: string;
  message_text?: string;
  url?: string | null;
  label: 'safe' | 'phishing';
  risk_score: number;
  signals: string[];
};

export function AnalyzeMessage(repo: AnalysisRepository) {
  return {
    async exec(input: AnalyzeInput) {
      await repo.create({
        id: crypto.randomUUID(),
        user_id: input.user_id,
        message_text: input.message_text ?? null,
        url: input.url ?? null,
        label: input.label,
        risk_score: input.risk_score,
        signals: input.signals,
        created_at: new Date().toISOString(),
      } as any);
    },
  };
}
