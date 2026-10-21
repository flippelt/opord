import { useEffect, useRef } from 'react'
import { SETUP_KEY, type SheetRef } from '../lib/sheets'
import { useDossier } from '../store'

/** Seletor de páginas: volta a qualquer folha do pacote para editar. */
export function PageTabs({ sheets }: { sheets: SheetRef[] }) {
  const active = useDossier((s) => s.active)
  const setActive = useDossier((s) => s.setActive)
  const current = active === SETUP_KEY || sheets.some((s) => s.key === active) ? active : SETUP_KEY
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const tab = nav.current?.querySelector<HTMLElement>('[aria-current="page"]')
    const bar = nav.current
    if (!tab || !bar) return
    const left = tab.offsetLeft - bar.offsetLeft
    if (left < bar.scrollLeft || left + tab.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollTo({ left: left - 24, behavior: 'smooth' })
    }
  }, [current])

  return (
    <nav className="page-tabs" aria-label="Páginas do dossiê" ref={nav}>
      <button
        type="button"
        className={current === SETUP_KEY ? 'page-tab on' : 'page-tab'}
        aria-current={current === SETUP_KEY ? 'page' : undefined}
        onClick={() => setActive(SETUP_KEY)}
      >
        <span className="page-tab-n">⚙</span>
        Geral
      </button>
      {sheets.map((sheet, i) => (
        <button
          key={sheet.key}
          type="button"
          className={current === sheet.key ? 'page-tab on' : 'page-tab'}
          aria-current={current === sheet.key ? 'page' : undefined}
          onClick={() => setActive(sheet.key)}
        >
          <span className="page-tab-n">{i + 1}</span>
          {sheet.label}
        </button>
      ))}
    </nav>
  )
}
