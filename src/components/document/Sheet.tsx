import { createContext, useContext, type ReactNode } from 'react'
import type { PageId } from '../../types'
import { PaperGrain } from './Banners'

export const SheetOrient = createContext<'portrait' | 'landscape'>('portrait')

type Props = {
  page: PageId | 'blank'
  exportId?: string
  paper: string
  ink?: string
  children: ReactNode
}

export function Sheet({ page, exportId = page, paper, ink, children }: Props) {
  const orient = useContext(SheetOrient)
  return (
    <article
      className={`sheet sheet-${page}${orient === 'landscape' ? ' is-landscape' : ''}`}
      data-page={exportId}
      style={{ backgroundColor: paper, color: ink }}
    >
      <PaperGrain id={`grain-${exportId}`} />
      <div className="binding" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      {children}
    </article>
  )
}
