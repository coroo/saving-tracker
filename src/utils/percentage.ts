export function calculatePercentage(saved: number, target: number): number {
  if (target <= 0) return 0;
  const value = (saved / target) * 100;
  return Math.min(100, Math.round(value * 10) / 10);
}
