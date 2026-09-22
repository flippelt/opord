import type { BlankPage, PageId, StackItem } from '../types'

export const STACK_ORDER: PageId[] = [
  'cover',
  'notice',
  'opord',
  'timeline',
  'radio',
  'roe',
  'roster',
  'sitrep',
  'aar',
  'orbat',
  'hvt',
  'casevac',
  'intel',
]

export function defaultStack(): StackItem[] {
  return STACK_ORDER.map((kind) => ({ kind }))
}

export function sheetTitle(
  titles: Partial<Record<PageId, string>> | undefined,
  id: PageId,
  fallback: string,
): string {
  const custom = titles?.[id]?.trim()
  return custom ? custom : fallback
}

function isPageId(value: string): value is PageId {
  return (STACK_ORDER as string[]).includes(value)
}

export function normalizeStack(raw: unknown, blanks: BlankPage[]): StackItem[] {
  const knownBlanks = new Set(blanks.map((b) => b.id))
  const seen = new Set<string>()
  const out: StackItem[] = []

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== 'object') continue
      const kind = String((item as StackItem).kind)
      if (kind === 'blank') {
        const id = String((item as StackItem).id ?? '')
        if (!id || !knownBlanks.has(id) || seen.has(`blank:${id}`)) continue
        out.push({ kind: 'blank', id })
        seen.add(`blank:${id}`)
      } else if (isPageId(kind) && !seen.has(kind)) {
        out.push({ kind })
        seen.add(kind)
      }
    }
  }

  if (!Array.isArray(raw)) {
    for (const kind of STACK_ORDER) out.push({ kind })
    for (const blank of blanks) out.push({ kind: 'blank', id: blank.id })
    return out
  }

  for (const kind of STACK_ORDER) {
    if (!seen.has(kind)) out.push({ kind })
  }
  for (const blank of blanks) {
    if (!seen.has(`blank:${blank.id}`)) out.push({ kind: 'blank', id: blank.id })
  }
  return out
}

export function insertBlankBeforeIntel(stack: StackItem[], id: string): StackItem[] {
  const next = stack.filter((item) => !(item.kind === 'blank' && item.id === id))
  const intel = next.findIndex((item) => item.kind === 'intel')
  const entry: StackItem = { kind: 'blank', id }
  if (intel >= 0) next.splice(intel, 0, entry)
  else next.push(entry)
  return next
}
