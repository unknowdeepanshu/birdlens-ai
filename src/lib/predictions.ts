export interface Prediction { label: string; score: number }
export function rankLogits(logits: ArrayLike<number>, labels: string[]): Prediction[] {
  if (logits.length !== labels.length || !Array.from(logits).every(Number.isFinite)) throw new Error('Unexpected model output');
  const max = Math.max(...Array.from(logits));
  const exp = Array.from(logits, v => Math.exp(v - max));
  const total = exp.reduce((a, b) => a + b, 0);
  return labels.map((label, i) => ({ label, score: exp[i] / total })).sort((a, b) => b.score - a.score).slice(0, 5);
}
export function isConfident(predictions: Prediction[]): boolean {
  return predictions.length > 1 && predictions[0].score >= 0.7 && predictions[0].score - predictions[1].score >= 0.2;
}
