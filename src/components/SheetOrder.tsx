import { PAGE_LABELS } from '../lib/classification'
import { insertBlankBeforeIntel } from '../lib/stack'
import { useDossier } from '../store'
import type { BlankPage, PageId, StackItem } from '../types'
import { Field } from './ImageField'

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

export function SheetOrder() {
  const dossier = useDossier((s) => s.dossier)
  const patch = useDossier((s) => s.patch)
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

  return (
    <div className="sheet-order">
      {shown.map(({ item }, position) => {
        const blank = item.kind === 'blank' ? dossier.blanks.find((b) => b.id === item.id) : undefined
        return (
          <div key={item.kind === 'blank' ? item.id : item.kind} className="intel-edit">
            <div className="sheet-order-bar">
              <p className="intel-edit-title">{labelOf(item, dossier.blanks)}</p>
              <span className="sheet-order-moves">
                <button type="button" className="btn-ghost" onClick={() => move(position, position - 1)}>
                  Subir
                </button>
                <button type="button" className="btn-ghost" onClick={() => move(position, position + 1)}>
                  Descer
                </button>
              </span>
            </div>
            {item.kind !== 'blank' ? (
              <Field
                label="Título nesta folha"
                hint="Vazio usa o título de sempre."
                value={dossier.titles[item.kind] ?? ''}
                placeholder={PAGE_LABELS[item.kind]}
                onChange={(value) =>
                  patch((d) => {
                    d.titles[item.kind as PageId] = value
                  })
                }
              />
            ) : blank ? (
              <>
                <Field
                  label="Título"
                  value={blank.title}
                  onChange={(title) =>
                    patch((d) => {
                      const page = d.blanks.find((b) => b.id === blank.id)
                      if (page) page.title = title
                    })
                  }
                />
                <Field
                  label="Linha menor"
                  value={blank.heading}
                  onChange={(heading) =>
                    patch((d) => {
                      const page = d.blanks.find((b) => b.id === blank.id)
                      if (page) page.heading = heading
                    })
                  }
                />
                <Field
                  label="Texto"
                  hint="Pode ficar vazio. A folha continua no pacote."
                  value={blank.body}
                  multiline
                  rows={3}
                  onChange={(body) =>
                    patch((d) => {
                      const page = d.blanks.find((b) => b.id === blank.id)
                      if (page) page.body = body
                    })
                  }
                />
                <label className={blank.lined ? 'chip on' : 'chip'}>
                  <input
                    type="checkbox"
                    checked={blank.lined}
                    onChange={() =>
                      patch((d) => {
                        const page = d.blanks.find((b) => b.id === blank.id)
                        if (page) page.lined = !page.lined
                      })
                    }
                  />
                  Pautada
                </label>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    patch((d) => {
                      d.blanks = d.blanks.filter((b) => b.id !== blank.id)
                      d.stack = d.stack.filter((s) => !(s.kind === 'blank' && s.id === blank.id))
                    })
                  }
                >
                  Remover página
                </button>
              </>
            ) : null}
          </div>
        )
      })}
      <button
        type="button"
        className="btn-ghost"
        onClick={() =>
          patch((d) => {
            const id = `blank-${crypto.randomUUID()}`
            d.blanks.push({
              id,
              title: 'ANEXO',
              heading: '',
              body: '',
              lined: true,
            })
            d.stack = insertBlankBeforeIntel(d.stack, id)
          })
        }
      >
        + Página em branco
      </button>
    </div>
  )
}
