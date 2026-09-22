import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function TimelinePage({ dossier }: { dossier: Dossier }) {
  const rows = dossier.timeline.length ? dossier.timeline : []
  return (
    <Sheet page="timeline" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="timeline" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={sheetTitle(
            dossier.titles,
            'timeline',
            `LINHA DO TEMPO — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'EMPREGO'}`,
          )}
          subtitle={`Hora-H ${dossier.mission.hHour || '—'} · ${dossier.header.timeZone || 'ZULU'}`}
        />
        <ol className="timeline">
          {rows.map((row) => (
            <li key={row.id}>
              <span className="timeline-mark">{row.mark || '—'}</span>
              <div>
                <strong>{row.what || '—'}</strong>
                {row.dtg ? <em>{row.dtg}</em> : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
