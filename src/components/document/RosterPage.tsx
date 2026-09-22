import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function RosterPage({ dossier }: { dossier: Dossier }) {
  const rows = dossier.roster.length ? dossier.roster : []
  return (
    <Sheet page="roster" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="roster" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={sheetTitle(
            dossier.titles,
            'roster',
            `ESCALAÇÃO — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'EFETIVO'}`,
          )}
          subtitle="Quem ocupa cada vaga"
        />
        <table className="orbat-table">
          <thead>
            <tr>
              <th>Elemento</th>
              <th>Vaga</th>
              <th>Indicativo</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.element || '—'}</td>
                <td>{row.billet || '—'}</td>
                <td>{row.callsign || '—'}</td>
                <td>{row.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
