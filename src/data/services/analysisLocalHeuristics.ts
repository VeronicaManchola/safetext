export type LocalAnalysis = {
  label: 'Mensaje seguro' | 'Posible smishing';
  score: number;
  signals: string[];
};

export function analyzeLocally(text: string): LocalAnalysis {
  const t = (text || '').toLowerCase();

  const signals: string[] = [];

  // Señales básicas
  if (/\burgente\b|\bapúrate\b|\búltima oportunidad\b|\b2 horas\b|\binmediatamente\b/.test(t)) {
    signals.push('Urgencia inusual');
  }
  if (/https?:\/\/(bit\.ly|tinyurl\.com|t\.co|ow\.ly|is\.gd|buff\.ly)/.test(t)) {
    signals.push('URL acortada');
  }
  if (/\b(verifica|actualiza|confirma)\b.*\b(datos|cuenta|pago)\b/.test(t)) {
    signals.push('Solicita datos sensibles');
  }
  if (/[a-z0-9-]+\.(co|cn|ru|top|biz)(\/|$)/.test(t)) {
    signals.push('Dominio sospechoso');
  }
  if (
    /(banc[o0]|cuent[a4]|paypal|amazon|apple|microsoft).*\b(soporte|seguridad|bloqueo)\b/.test(t)
  ) {
    signals.push('Menciona entidad conocida');
  }

  // Puntuación simple según recuento de señales
  const base = signals.length / 5; // normaliza a 0–1
  const score = Math.max(0, Math.min(1, base));

  const label: LocalAnalysis['label'] = score >= 0.5 ? 'Posible smishing' : 'Mensaje seguro';

  return { label, score, signals };
}
