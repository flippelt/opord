import { insertBlankBeforeIntel } from '../lib/stack'
import { sheetList } from '../lib/sheets'
import { PAGE_LABELS } from '../lib/classification'
import { useDossier } from '../store'
import type { BlankPage, PageId, StackItem } from '../types'

function visible(item: StackItem, pages: Record<PageId, boolean>, blanks: BlankPage[]) {
  if (item.kind === 'blank') return blanks.some((b) => b.id === item.id)
  return pages[item.kind]
}

function labelOf(item: StackItem, blanks: BlankPage[]) {
  if (item.kind === 'blank') {
    return blanks.find((b) => b.id === item.id)?.title || 'Página em branco'
  }
  return PAGE_LABELS[item.kind]
}

/** Ordem das folhas no pacote. Clicar no nome abre a folha para editar. */
export function SheetOrder() {
  const dossier = useDossier((s) => s.dossier)
  const patch = useDossier((s) => s.patch)
  const setActive = useDossier((s) => s.setActive)
  const shown = dossier.stack
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => visible(item, dossier.document.pages, dossier.blanks))

  function move(from: number, to: number) {
    if (to < 0 || to >= shown.length) return
    patch((d) => {
      const a = shown[from].index
      const b = shown[to].index
      const current = d.stack[a]
      d.stack[a] = d.stack[b]
      d.stack[b] = current
    })
  }

  function open(item: StackItem) {
    const sheet = sheetList(dossier).find((s) =>
      item.kind === 'blank' ? s.kind === 'blank' && s.blank.id === item.id : s.kind === item.kind,
    )
    if (sheet) setActive(sheet.key)
  }

  return (
    <ol className="sheet-order">
      {shown.map(({ item }, position) => (
        <li key={item.kind === 'blank' ? item.id : item.kind} className="sheet-order-bar">
          <button type="button" className="sheet-order-name" onClick={() => open(item)}>
            {position + 1}. {labelOf(item, dossier.blanks)}
          </button>
          <span className="sheet-order-moves">
            <button
              type="button"
              className="btn-ghost"
              aria-label="Subir"
              disabled={position === 0}
              onClick={() => move(position, position - 1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="btn-ghost"
              aria-label="Descer"
              disabled={position === shown.length - 1}
              onClick={() => move(position, position + 1)}
            >
              ↓
            </button>
          </span>
        </li>
      ))}
      <li>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            const id = `blank-${crypto.randomUUID()}`
            patch((d) => {
              d.blanks.push({ id, title: 'ANEXO', heading: '', body: '', lined: true })
              d.stack = insertBlankBeforeIntel(d.stack, id)
            })
            setActive(`blank-${id}`)
          }}
        >
          + Página em branco
        </button>
      </li>
    </ol>
  )
}
