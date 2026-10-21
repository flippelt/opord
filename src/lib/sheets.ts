import { emptyHvtSlots, emptyIntelSlots, emptyMapPlate } from '../defaults'
import type { BlankPage, Dossier, HvtCard, IntelPhoto, MapPlate, PageId } from '../types'
import { hasAarExecution } from './aar'
import { PAGE_LABELS } from './classification'
import { chunk } from './dtg'

/** Uma folha do pacote, na ordem em que sai. `key` é o mesmo `data-page` da exportação. */
export type SheetRef =
  | { key: string; kind: 'cover' | 'notice' | 'timeline' | 'roster' | 'sitrep' | 'orbat' | 'casevac'; label: string }
  | { key: 'opord-1' | 'opord-2'; kind: 'opord'; part: 1 | 2; label: string }
  | { key: 'aar' | 'aar-execucao'; kind: 'aar'; part: 1 | 2; label: string }
  | { key: string; kind: 'hvt'; card: HvtCard; index: number; label: string }
  | { key: string; kind: 'map'; plate: MapPlate; label: string }
  | { key: string; kind: 'intel'; photos: IntelPhoto[]; startIndex: number; label: string }
  | { key: string; kind: 'blank'; blank: BlankPage; label: string }

/** O passo de configuração não é folha: no palco ele mostra a capa. */
export const SETUP_KEY = 'setup'

const SIMPLE = ['cover', 'notice', 'timeline', 'roster', 'sitrep', 'orbat', 'casevac'] as const

function isSimple(kind: PageId): kind is (typeof SIMPLE)[number] {
  return (SIMPLE as readonly string[]).includes(kind)
}

export function sheetList(dossier: Dossier): SheetRef[] {
  const out: SheetRef[] = []
  for (const item of dossier.stack) {
    if (item.kind === 'blank') {
      const blank = dossier.blanks.find((b) => b.id === item.id)
      if (blank) out.push({ key: `blank-${blank.id}`, kind: 'blank', blank, label: blank.title || 'Página em branco' })
      continue
    }
    if (!dossier.document.pages[item.kind]) continue
    const kind = item.kind
    if (isSimple(kind)) {
      out.push({ key: kind, kind, label: PAGE_LABELS[kind] })
    } else if (kind === 'opord') {
      out.push({ key: 'opord-1', kind, part: 1, label: 'OPORD 1/2' })
      out.push({ key: 'opord-2', kind, part: 2, label: 'OPORD 2/2' })
    } else if (kind === 'aar') {
      out.push({ key: 'aar', kind, part: 1, label: 'AAR' })
      if (hasAarExecution(dossier)) out.push({ key: 'aar-execucao', kind, part: 2, label: 'AAR — execução' })
    } else if (kind === 'hvt') {
      const cards = dossier.hvts.length ? dossier.hvts : emptyHvtSlots()
      cards.forEach((card, index) =>
        out.push({ key: `hvt-${index + 1}`, kind, card, index, label: `HVT ${index + 1}` }),
      )
    } else if (kind === 'map') {
      const plates = dossier.maps.length ? dossier.maps : [{ ...emptyMapPlate(), id: 'map-empty' }]
      plates.forEach((plate) =>
        out.push({ key: `map-${plate.id}`, kind, plate, label: plate.title.trim() || 'Mapa' }),
      )
    } else if (kind === 'intel') {
      const groups = chunk(dossier.intel.length ? dossier.intel : emptyIntelSlots(), 4)
      groups.forEach((photos, i) =>
        out.push({
          key: `intel-${i + 1}`,
          kind,
          photos,
          startIndex: i * 4,
          label: groups.length > 1 ? `Intel ${i + 1}` : 'Intel',
        }),
      )
    }
  }
  return out
}

/** A folha que o palco mostra para um passo; o passo de configuração mostra a primeira. */
export function stageKey(sheets: SheetRef[], active: string): string | null {
  if (sheets.some((s) => s.key === active)) return active
  return sheets[0]?.key ?? null
}
