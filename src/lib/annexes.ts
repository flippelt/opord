import type { Dossier } from '../types'
import { sheetList, type SheetRef } from './sheets'

/** Folhas que são documentos à parte, e não anexos da ordem. */
const NOT_ANNEX = new Set<SheetRef['kind']>(['cover', 'notice', 'opord', 'sitrep', 'aar'])

const LABELS: Record<string, { pt: string; en: string }> = {
  timeline: { pt: 'Linha do tempo', en: 'Timeline' },
  roster: { pt: 'Escalação', en: 'Roster' },
  orbat: { pt: 'Organização de tarefa (ORBAT)', en: 'Task organization (ORBAT)' },
  hvt: { pt: 'Cartões de HVT', en: 'HVT cards' },
  casevac: { pt: 'Pedido CASEVAC (9 linhas)', en: 'CASEVAC request (9-line)' },
  map: { pt: 'Mapas', en: 'Maps' },
  intel: { pt: 'Inteligência — fotos', en: 'Intelligence — imagery' },
}

export type Annex = { letter: string; label: string; kind: SheetRef['kind'] }

/** Título da página em branco sem o "ANEXO C —" que a pessoa já tenha escrito. */
function blankLabel(title: string) {
  return title.replace(/^ANEXO\s+[A-Z0-9]+\s*[—–-]\s*/i, '').trim() || title
}

/** Anexos da ordem, na ordem do pacote, com letras A, B, C… Mapas e HVT viram um anexo só. */
export function annexList(dossier: Dossier): Annex[] {
  const en = dossier.document.language === 'en'
  const out: Annex[] = []
  const seen = new Set<string>()
  for (const sheet of sheetList(dossier)) {
    if (NOT_ANNEX.has(sheet.kind)) continue
    const key = sheet.kind === 'blank' ? sheet.key : sheet.kind
    if (seen.has(key)) continue
    seen.add(key)
    const label =
      sheet.kind === 'blank' ? blankLabel(sheet.blank.title || 'Anexo') : en ? LABELS[sheet.kind].en : LABELS[sheet.kind].pt
    out.push({ letter: String.fromCharCode(65 + out.length), label, kind: sheet.kind })
  }
  return out
}

export function annexLetter(dossier: Dossier, kind: SheetRef['kind']): string | null {
  return annexList(dossier).find((a) => a.kind === kind)?.letter ?? null
}
