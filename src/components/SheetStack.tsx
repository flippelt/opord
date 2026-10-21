import { forwardRef } from 'react'
import type { SheetRef } from '../lib/sheets'
import type { Dossier } from '../types'
import { AarExecutionPage, AarPage } from './document/AarPage'
import { BlankSheet } from './document/BlankPage'
import { CasevacPage } from './document/CasevacPage'
import { CoverPage } from './document/CoverPage'
import { HvtPage } from './document/HvtPage'
import { IntelPage } from './document/IntelPage'
import { MapPage } from './document/MapPage'
import { NoticePage } from './document/NoticePage'
import { OpordBack, OpordFront } from './document/OpordPage'
import { OrbatPage } from './document/OrbatPage'
import { RosterPage } from './document/RosterPage'
import { ActiveSheet, SheetHoles, SheetOrient, SheetScope } from './document/Sheet'
import { SitrepPage } from './document/SitrepPage'
import { TimelinePage } from './document/TimelinePage'

export function renderSheet(sheet: SheetRef, dossier: Dossier) {
  switch (sheet.kind) {
    case 'cover':
      return <CoverPage key={sheet.key} dossier={dossier} />
    case 'notice':
      return <NoticePage key={sheet.key} dossier={dossier} />
    case 'opord':
      return sheet.part === 1 ? (
        <OpordFront key={sheet.key} dossier={dossier} />
      ) : (
        <OpordBack key={sheet.key} dossier={dossier} />
      )
    case 'timeline':
      return <TimelinePage key={sheet.key} dossier={dossier} />
    case 'roster':
      return <RosterPage key={sheet.key} dossier={dossier} />
    case 'sitrep':
      return <SitrepPage key={sheet.key} dossier={dossier} />
    case 'aar':
      return sheet.part === 1 ? (
        <AarPage key={sheet.key} dossier={dossier} />
      ) : (
        <AarExecutionPage key={sheet.key} dossier={dossier} />
      )
    case 'orbat':
      return <OrbatPage key={sheet.key} dossier={dossier} />
    case 'hvt':
      return <HvtPage key={sheet.key} dossier={dossier} card={sheet.card} index={sheet.index} />
    case 'casevac':
      return <CasevacPage key={sheet.key} dossier={dossier} />
    case 'map':
      return <MapPage key={sheet.key} dossier={dossier} plate={sheet.plate} />
    case 'intel':
      return <IntelPage key={sheet.key} dossier={dossier} photos={sheet.photos} startIndex={sheet.startIndex} />
    case 'blank':
      return <BlankSheet key={sheet.key} dossier={dossier} blank={sheet.blank} />
  }
}

type Props = {
  dossier: Dossier
  sheets: SheetRef[]
  /** Chave da folha que fica na tela; null mostra todas. */
  active: string | null
  scope?: string
  className?: string
  style?: React.CSSProperties
}

export const SheetStack = forwardRef<HTMLDivElement, Props>(function SheetStack(
  { dossier, sheets, active, scope = '', className = 'stage-inner', style },
  ref,
) {
  const orientation = dossier.document.orientation === 'landscape' ? 'landscape' : 'portrait'
  return (
    <SheetScope.Provider value={scope}>
      <ActiveSheet.Provider value={active}>
        <SheetHoles.Provider value={dossier.document.binding}>
          <SheetOrient.Provider value={orientation}>
            <div className={className} ref={ref} data-orient={orientation} style={style}>
              {sheets.map((sheet) => renderSheet(sheet, dossier))}
            </div>
          </SheetOrient.Provider>
        </SheetHoles.Provider>
      </ActiveSheet.Provider>
    </SheetScope.Provider>
  )
})
