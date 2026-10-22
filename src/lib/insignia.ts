import type { Dossier, RankPin } from '../types'

export type InsigniaGroup = 'enlisted' | 'warrant' | 'officer'

export type Force = 'army' | 'navy' | 'air'

export const FORCES: { id: Force; label: string }[] = [
  { id: 'army', label: 'Exército' },
  { id: 'navy', label: 'Marinha' },
  { id: 'air', label: 'Força Aérea' },
]

export type InsigniaRank = {
  /** Código OTAN (STANAG 2116): OR-1…OR-9, WO-1…WO-5, OF-D, OF-1…OF-10. */
  code: string
  group: InsigniaGroup
  /** Nome em português e em inglês, por força. */
  names: Record<Force, [string, string]>
}

const CODES = [
  ...Array.from({ length: 9 }, (_, i) => `OR-${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `WO-${i + 1}`),
  'OF-D',
  ...Array.from({ length: 10 }, (_, i) => `OF-${i + 1}`),
]

const WARRANT: [string, string][] = Array.from({ length: 5 }, (_, i) => [
  `Oficial técnico ${i + 1}`,
  i ? `Chief Warrant Officer ${i + 1}` : 'Warrant Officer 1',
])

/** Na ordem de `CODES`. */
const NAMES: Record<Force, [string, string][]> = {
  army: [
    ['Recruta', 'Recruit'],
    ['Soldado', 'Private'],
    ['Soldado de 1ª classe', 'Private First Class'],
    ['Cabo', 'Corporal'],
    ['Terceiro-Sargento', 'Sergeant'],
    ['Segundo-Sargento', 'Staff Sergeant'],
    ['Primeiro-Sargento', 'Sergeant First Class'],
    ['Sargento-Ajudante', 'Master Sergeant'],
    ['Subtenente', 'Sergeant Major'],
    ...WARRANT,
    ['Aspirante a Oficial', 'Officer Cadet'],
    ['Tenente', 'Lieutenant'],
    ['Capitão', 'Captain'],
    ['Major', 'Major'],
    ['Tenente-Coronel', 'Lieutenant Colonel'],
    ['Coronel', 'Colonel'],
    ['General de Brigada', 'Brigadier General'],
    ['General de Divisão', 'Major General'],
    ['Tenente-General', 'Lieutenant General'],
    ['General', 'General'],
    ['Marechal', 'Field Marshal'],
  ],
  navy: [
    ['Recruta', 'Seaman Recruit'],
    ['Marinheiro', 'Seaman Apprentice'],
    ['Marinheiro de 1ª classe', 'Seaman'],
    ['Cabo', 'Petty Officer Third Class'],
    ['Terceiro-Sargento', 'Petty Officer Second Class'],
    ['Segundo-Sargento', 'Petty Officer First Class'],
    ['Primeiro-Sargento', 'Chief Petty Officer'],
    ['Sargento-Chefe', 'Senior Chief Petty Officer'],
    ['Suboficial', 'Master Chief Petty Officer'],
    ...WARRANT,
    ['Guarda-Marinha', 'Midshipman'],
    ['Tenente', 'Lieutenant (Junior Grade)'],
    ['Capitão-Tenente', 'Lieutenant'],
    ['Capitão de Corveta', 'Lieutenant Commander'],
    ['Capitão de Fragata', 'Commander'],
    ['Capitão de Mar e Guerra', 'Captain'],
    ['Comodoro', 'Commodore'],
    ['Contra-Almirante', 'Rear Admiral'],
    ['Vice-Almirante', 'Vice Admiral'],
    ['Almirante de Esquadra', 'Admiral'],
    ['Almirante', 'Admiral of the Fleet'],
  ],
  air: [
    ['Recruta', 'Airman Basic'],
    ['Soldado', 'Airman'],
    ['Soldado de 1ª classe', 'Airman First Class'],
    ['Cabo', 'Senior Airman'],
    ['Terceiro-Sargento', 'Staff Sergeant'],
    ['Segundo-Sargento', 'Technical Sergeant'],
    ['Primeiro-Sargento', 'Master Sergeant'],
    ['Sargento-Ajudante', 'Senior Master Sergeant'],
    ['Suboficial', 'Chief Master Sergeant'],
    ...WARRANT,
    ['Aspirante a Oficial', 'Officer Cadet'],
    ['Tenente', 'Lieutenant'],
    ['Capitão', 'Captain'],
    ['Major', 'Major'],
    ['Tenente-Coronel', 'Lieutenant Colonel'],
    ['Coronel', 'Colonel'],
    ['Brigadeiro', 'Brigadier General'],
    ['Major-Brigadeiro', 'Major General'],
    ['Tenente-Brigadeiro', 'Lieutenant General'],
    ['General do Ar', 'General'],
    ['Marechal do Ar', 'Marshal of the Air Force'],
  ],
}

/**
 * Patentes pelo código OTAN. O desenho é um pin de gola genérico, do próprio projeto, e não
 * copia o de nenhum país: praças levam divisas, oficiais técnicos uma barra, oficiais
 * estrelas de quatro pontas (com barra embaixo nos superiores) e generais estrelas de cinco.
 * As três forças usam o mesmo pin para o mesmo código; muda só o nome.
 */
export const NATO_RANKS: InsigniaRank[] = CODES.map((code, i) => ({
  code,
  group: code.startsWith('OR') ? 'enlisted' : code.startsWith('WO') ? 'warrant' : 'officer',
  names: { army: NAMES.army[i], navy: NAMES.navy[i], air: NAMES.air[i] },
}))

export function rankName(rank: InsigniaRank, force: Force, language: Dossier['document']['language'] = 'pt'): string {
  return rank.names[force][language === 'en' ? 1 : 0]
}

const GOLD = '#d4b04c'
const EDGE = '#5e4a14'
const HOLE = '#2a2418'

/** Traço de metal: borda escura por baixo, dourado por cima. */
const metal = (d: string) =>
  `<path d="${d}" fill="none" stroke="${EDGE}" stroke-width="7.5" stroke-linejoin="miter"/>` +
  `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linejoin="miter"/>`

/** Divisa centrada em `cy`. */
const chevron = (cy: number) => metal(`M34 ${cy + 7} L60 ${cy - 7} L86 ${cy + 7}`)
const rocker = (y: number) => metal(`M34 ${y} Q60 ${y + 16} 86 ${y}`)
const plate = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="${GOLD}" stroke="${EDGE}" stroke-width="1.4"/>`

function star(cx: number, cy: number, r: number, points: number, filled = true): string {
  const inner = points === 4 ? r * 0.38 : r * 0.42
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const a = (Math.PI / points) * i - Math.PI / 2
    const rr = i % 2 ? inner : r
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`)
  }
  const shape = `points="${pts.join(' ')}" stroke-linejoin="miter"`
  return filled
    ? `<polygon ${shape} fill="${GOLD}" stroke="${EDGE}" stroke-width="1.4"/>`
    : `<polygon ${shape} fill="none" stroke="${EDGE}" stroke-width="5.5"/><polygon ${shape} fill="none" stroke="${GOLD}" stroke-width="3"/>`
}

/** `n` posições a `step` uma da outra, centradas em `center`. */
function stack(n: number, center: number, step: number): number[] {
  return Array.from({ length: n }, (_, i) => center + (i - (n - 1) / 2) * step)
}

function devices(code: string): string {
  const [kind, raw] = code.split('-')
  const n = Number(raw)
  if (kind === 'OR') {
    if (n === 1) return plate(40, 42, 40, 8)
    if (n <= 4) return stack(n - 1, 46, 11).map(chevron).join('')
    const rockers = Math.min(n - 4, 3)
    if (n <= 7) return [14, 25, 36].map(chevron).join('') + [52, 62, 72].slice(0, rockers).map(rocker).join('')
    const device =
      n === 8 ? `<polygon points="60,37 68,45 60,53 52,45" fill="${GOLD}" stroke="${EDGE}" stroke-width="1.4"/>` : star(60, 46, 9, 5)
    return [8, 18.5, 29].map(chevron).join('') + device + [56, 66, 76].map(rocker).join('')
  }
  if (kind === 'WO') {
    const squares = stack(n, 60, 12)
      .map((x) => `<rect x="${(x - 3).toFixed(2)}" y="41" width="6" height="10" fill="${HOLE}"/>`)
      .join('')
    return plate(26, 36, 68, 20) + squares
  }
  if (raw === 'D') return star(60, 46, 14, 4, false)
  if (n <= 2) return stack(n, 60, 36).map((x) => star(x, 46, 17, 4)).join('')
  if (n <= 5) {
    const pips = n - 2
    const width = pips * 30 + 26
    return stack(pips, 60, 30).map((x) => star(x, 37, 13, 4)).join('') + plate(60 - width / 2, 60, width, 7)
  }
  const stars = n - 5
  const step = stars === 5 ? 23 : stars === 4 ? 27 : 30
  const r = stars === 5 ? 11 : stars === 4 ? 12.5 : 13.5
  return stack(stars, 60, step).map((x) => star(x, 47, r, 5)).join('')
}

/** Pin de gola do código, em metal dourado e sem fundo. */
export function natoInsigniaSvg(code: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 92" width="120" height="92">${devices(code)}</svg>`
}

export function natoInsigniaUrl(code: string): string {
  return `data:image/svg+xml,${encodeURIComponent(natoInsigniaSvg(code))}`
}

export type ResolvedInsignia = { src: string; label: string; code?: string; force?: Force }

const isForce = (id: string): id is Force => FORCES.some((f) => f.id === id)

/**
 * `ref` é `<força>/<código>` (como `navy/OF-2`) ou `clan/<id>`, um pin que o clã enviou.
 * O pin sem imagem, apagado ou de código desconhecido volta `null`, e a folha usa o logo.
 */
export function findInsignia(
  ref: string,
  pins: RankPin[],
  language: Dossier['document']['language'] = 'pt',
): ResolvedInsignia | null {
  const [kind, id] = ref.split('/')
  if (isForce(kind)) {
    const rank = NATO_RANKS.find((r) => r.code === id)
    if (!rank) return null
    return { src: natoInsigniaUrl(rank.code), label: rankName(rank, kind, language), code: rank.code, force: kind }
  }
  if (kind === 'clan') {
    const pin = pins.find((p) => p.id === id)
    return pin?.src ? { src: pin.src, label: pin.label } : null
  }
  return null
}

/**
 * Os catálogos antigos (Brasil e EUA, por força) usavam o código OTAN no id do posto,
 * às vezes com um sufixo (`OF-1-2ten`, `OR-9-sgm`). Leva a escolha para `<força>/<código>`.
 */
export function migrateInsigniaRef(ref: string): string {
  const [kind, rank = ''] = ref.split('/')
  if (!ref || kind === 'clan' || isForce(kind)) return ref
  const force = /-(army|navy|air)$/.exec(kind)?.[1]
  const code = /^(OR|WO|OF)-(10|\d|D)/.exec(rank)?.[0]
  return force && code && NATO_RANKS.some((r) => r.code === code) ? `${force}/${code}` : ''
}
