import manifest from '../data/insignia.json'

export type InsigniaRank = {
  id: string
  label: string
  abbr: string
  group: 'enlisted' | 'officer'
  order: number
  file: string
  source: string
  author: string
  license: string
  licenseUrl: string
}

export type InsigniaSet = {
  id: string
  country: string
  force: string
  label: string
  ranks: InsigniaRank[]
}

/** Insígnias livres (domínio público ou CC) do Wikimedia Commons, em public/insignia. */
export const INSIGNIA_SETS = (manifest as { sets: InsigniaSet[] }).sets

/** `ref` é `<conjunto>/<posto>`, como `br-army/OF-2`. */
export function findInsignia(ref: string): { set: InsigniaSet; rank: InsigniaRank } | null {
  const [setId, rankId] = ref.split('/')
  const set = INSIGNIA_SETS.find((s) => s.id === setId)
  const rank = set?.ranks.find((r) => r.id === rankId)
  return set && rank ? { set, rank } : null
}

export function insigniaUrl(rank: InsigniaRank): string {
  return `${import.meta.env.BASE_URL}insignia/${rank.file}`
}
