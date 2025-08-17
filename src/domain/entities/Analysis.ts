export type Analysis = {
  id: string;
  label: "Mensaje seguro" | "Posible phishing";
  score: number;
  signals: string[];
  snippet: string;
  createdAt: string;
};
