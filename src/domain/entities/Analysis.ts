export type AnalysisLabel = 'safe' | 'smishing';

export type Analysis = {
  id: string;
  user_id: string;
  message_text?: string | null;
  url?: string | null;
  label: AnalysisLabel;
  risk_score: number;
  signals: string[];
  created_at: string;
};
