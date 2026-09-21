import { classificationLine } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function OrbatPage({ dossier }: { dossier: Dossier }) {
  const rows = dossier.orbat.length ? dossier.orbat : []
  return (
    <Sheet page="orbat" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="orbat" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={`ORBAT — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'TASK ORG'}`}
          subtitle="Organização de tarefa · efetivo para o emprego"
        />
        <table className="orbat-table">
          <thead>
            <tr>
              <th>Escalão</th>
              <th>Designação</th>
              <th>Indicativo</th>
              <th>Chefe</th>
              <th>Efetivo</th>
              <th>Tarefa</th>
            </tr>
          </thead>
          <tbody>
            {(rows.length ? rows : [{ id: 'empty', echelon: '', designation: '', callsign: '', lead: '', strength: '', task: '' }]).map(
              (row) => (
                <tr key={row.id}>
                  <td>{row.echelon || '—'}</td>
                  <td>{row.designation || '—'}</td>
                  <td>{row.callsign || '—'}</td>
                  <td>{row.lead || '—'}</td>
                  <td>{row.strength || '—'}</td>
                  <td>{row.task || '—'}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        <p className="intel-note">
          Sucessão: {dossier.comms.succession || '—'} · Desafio {dossier.comms.challenge || '—'} /{' '}
          {dossier.comms.password || '—'}
        </p>
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
