import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function RadioPage({ dossier }: { dossier: Dossier }) {
  return (
    <Sheet page="radio" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="radio" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={sheetTitle(dossier.titles, 'radio', 'CARTÃO DE RÁDIO')}
          subtitle={dossier.mission.name ? `OP. ${dossier.mission.name}` : 'SOI'}
        />
        <table className="radio-table">
          <thead>
            <tr>
              <th>Rede</th>
              <th>Freq.</th>
              <th>Indicativo</th>
            </tr>
          </thead>
          <tbody>
            {dossier.comms.nets.map((net) => (
              <tr key={net.id}>
                <td>{net.name || '—'}</td>
                <td className="radio-freq">{net.freq || '—'}</td>
                <td>{net.callsign || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="radio-words">
          <div>
            <span>Desafio</span>
            <strong>{dossier.comms.challenge || '—'}</strong>
          </div>
          <div>
            <span>Senha</span>
            <strong>{dossier.comms.password || '—'}</strong>
          </div>
        </div>
        <p className="radio-succession">Sucessão: {dossier.comms.succession || '—'}</p>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
