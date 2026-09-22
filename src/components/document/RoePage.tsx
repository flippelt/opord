import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function RoePage({ dossier }: { dossier: Dossier }) {
  const lines = (dossier.body.roe || '—')
    .split(/(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
  return (
    <Sheet page="roe" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="roe" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={sheetTitle(dossier.titles, 'roe', 'REGRAS DE ENGAJAMENTO')}
          subtitle={dossier.mission.name ? `OP. ${dossier.mission.name}` : 'ROE'}
        />
        <ol className="roe-card">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
