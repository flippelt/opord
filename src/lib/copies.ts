/** Cópias 01 … N, com a mesma largura do número de exemplo. No máximo 30. */
export function copyNumbers(totalRaw: string, sample = '01'): string[] {
  const parsed = Number.parseInt(totalRaw, 10)
  const total = Math.min(30, Math.max(1, Number.isFinite(parsed) ? parsed : 1))
  const width = Math.max(2, sample.trim().length, String(total).length)
  return Array.from({ length: total }, (_, i) => String(i + 1).padStart(width, '0'))
}
