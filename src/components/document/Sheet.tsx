import { createContext, useContext, type ReactNode } from 'react'
import type { PageId } from '../../types'
import { PaperGrain } from './Banners'

export const SheetOrient = createContext<'portrait' | 'landscape'>('portrait')
export const SheetHoles = createContext(true)

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
  const showHoles = holes ?? holesFromDoc
  return (
    <article
      className={`sheet sheet-${page}${orient === 'landscape' ? ' is-landscape' : ''}${showHoles ? '' : ' no-binding'}`}
      data-page={exportId}
      style={{ backgroundColor: paper, color: ink }}
    >
      <PaperGrain id={`grain-${exportId}`} />
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
