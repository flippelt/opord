import type { ReactNode } from 'react'
import type { PageId } from '../../types'
import { PaperGrain } from './Banners'

type Props = {
  page: PageId | 'blank'
  exportId?: string
  paper: string
  ink?: string
  children: ReactNode
}

export function Sheet({ page, exportId = page, paper, ink, children }: Props) {
  return (
    <article
      className={`sheet sheet-${page}`}
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
