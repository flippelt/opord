import { createContext, useContext, type ReactNode } from 'react'
import type { PageId } from '../../types'
import { PaperGrain } from './Banners'

export const SheetOrient = createContext<'portrait' | 'landscape'>('portrait')
export const SheetHoles = createContext(true)
/** Folha em edição. Com uma chave, as outras somem da tela (continuam na impressão). */
export const ActiveSheet = createContext<string | null>(null)
/** Prefixo dos ids de SVG, para a pré-visualização não reusar o filtro de uma folha escondida. */
export const SheetScope = createContext('')

type Props = {
  page: PageId | 'blank'
  exportId?: string
  paper: string
  ink?: string
  holes?: boolean
  children: ReactNode
}

export function Sheet({ page, exportId = page, paper, ink, holes, children }: Props) {
  const orient = useContext(SheetOrient)
  const holesFromDoc = useContext(SheetHoles)
  const active = useContext(ActiveSheet)
  const scope = useContext(SheetScope)
  const showHoles = holes ?? holesFromDoc
  const off = active !== null && active !== exportId
  return (
    <article
      className={`sheet sheet-${page}${orient === 'landscape' ? ' is-landscape' : ''}${showHoles ? '' : ' no-binding'}${off ? ' is-off' : ''}`}
      data-page={exportId}
      style={{ backgroundColor: paper, color: ink }}
    >
      <PaperGrain id={`${scope}grain-${exportId}`} />
      {showHoles ? (
        <div className="binding" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      ) : null}
      {children}
    </article>
  )
}
