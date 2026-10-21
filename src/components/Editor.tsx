import { useEffect, useMemo, useRef } from 'react'
import { SETUP_KEY, sheetList, type SheetRef } from '../lib/sheets'
import { useDossier } from '../store'
import { AarExecutionPanel, AarPanel, CasevacPanel, NoticePanel, OpordBackPanel, OpordFrontPanel, SitrepPanel } from './editor/OrderPanels'
import { BlankPanel, IntelPanel, MapPanel } from './editor/AnnexPanels'
import { CoverPanel } from './editor/CoverPanel'
import { HvtPanel, OrbatPanel, RosterPanel, TimelinePanel } from './editor/ListPanels'
import { SetupPanel } from './editor/SetupPanel'

function Panel({ sheet }: { sheet: SheetRef }) {
  switch (sheet.kind) {
    case 'cover':
      return <CoverPanel />
    case 'notice':
      return <NoticePanel />
    case 'opord':
      return sheet.part === 1 ? <OpordFrontPanel /> : <OpordBackPanel />
    case 'timeline':
      return <TimelinePanel />
    case 'roster':
      return <RosterPanel />
    case 'sitrep':
      return <SitrepPanel />
    case 'aar':
      return sheet.part === 1 ? <AarPanel /> : <AarExecutionPanel />
    case 'orbat':
      return <OrbatPanel />
    case 'hvt':
      return <HvtPanel key={sheet.key} card={sheet.card} index={sheet.index} />
    case 'casevac':
      return <CasevacPanel />
    case 'map':
      return <MapPanel key={sheet.key} plate={sheet.plate} />
    case 'intel':
      return <IntelPanel key={sheet.key} photos={sheet.photos} startIndex={sheet.startIndex} />
    case 'blank':
      return <BlankPanel key={sheet.key} blank={sheet.blank} />
  }
}

export function Editor({ onCollapse }: { onCollapse: () => void }) {
  const dossier = useDossier((s) => s.dossier)
  const active = useDossier((s) => s.active)
  const setActive = useDossier((s) => s.setActive)
  const setFocus = useDossier((s) => s.setFocus)
  const sheets = useMemo(() => sheetList(dossier), [dossier])
  const steps = [SETUP_KEY, ...sheets.map((s) => s.key)]
  const at = Math.max(0, steps.indexOf(active))
  const sheet = sheets.find((s) => s.key === steps[at])
  const prev = at > 0 ? steps[at - 1] : null
  const next = at < steps.length - 1 ? steps[at + 1] : null
  const desk = useRef<HTMLElement>(null)

  useEffect(() => {
    desk.current?.scrollTo({ top: 0 })
  }, [active])

  const labelOf = (key: string) => (key === SETUP_KEY ? 'Documento' : sheets.find((s) => s.key === key)?.label ?? '')

  return (
    <aside
      ref={desk}
      className="desk"
      onFocus={(e) => {
        const key = (e.target as HTMLElement).closest<HTMLElement>('[data-edit]')?.dataset.edit ?? ''
        setFocus(key)
      }}
      onBlur={(e) => {
        const into = e.relatedTarget as HTMLElement | null
        if (!into?.closest('.desk [data-edit]')) setFocus('')
      }}
    >
      <header className="desk-brand">
        <div className="desk-brand-row">
          <div>
            <p className="desk-kicker">Estação de operações</p>
            <h1>OPORD</h1>
          </div>
          <button type="button" className="btn-ghost desk-collapse" onClick={onCollapse} title="Recolher o menu">
            ◂ Recolher
          </button>
        </div>
        <p>Briefing confidencial para milsim</p>
        <button
          type="button"
          className="btn-ghost desk-jump"
          onClick={() => document.querySelector('.workspace')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver dossiê
        </button>
      </header>

      <div className="desk-step">
        <p className="desk-kicker">
          Passo {at + 1} de {steps.length}
        </p>
        <h2>{sheet ? sheet.label : 'Documento'}</h2>
        <p className="field-hint">
          {sheet
            ? 'Só os campos desta folha. Clique num campo e o trecho dele acende no papel.'
            : 'O que vale para o pacote inteiro: modelo, classificação, papel, folhas e marcas.'}
        </p>
      </div>

      <div className="desk-panel" key={steps[at]}>
        {sheet ? <Panel sheet={sheet} /> : <SetupPanel />}
      </div>

      <nav className="desk-nav" aria-label="Passos">
        <button type="button" className="btn-ghost" disabled={!prev} onClick={() => prev && setActive(prev)}>
          ← {prev ? labelOf(prev) : 'Início'}
        </button>
        <button type="button" className="btn" disabled={!next} onClick={() => next && setActive(next)}>
          {next ? labelOf(next) : 'Fim'} →
        </button>
      </nav>
    </aside>
  )
}
