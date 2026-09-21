const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const

export function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

/** NATO Date-Time Group in Zulu, e.g. 211430ZSEP26 */
export function toDtg(date: Date, zone = 'Z'): string {
  const d = pad2(date.getUTCDate())
  const h = pad2(date.getUTCHours())
  const m = pad2(date.getUTCMinutes())
  const mon = MONTHS[date.getUTCMonth()]
  const y = date.getUTCFullYear().toString().slice(-2)
  return `${d}${h}${m}${zone}${mon}${y}`
}

export function nowDtg(): string {
  return toDtg(new Date())
}

export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase()
}

export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr]
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}
