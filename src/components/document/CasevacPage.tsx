import { CASEVAC_LINES, classificationLine } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function CasevacPage({ dossier }: { dossier: Dossier }) {
  const c = dossier.casevac
  return (
    <Sheet page="casevac" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="casevac" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title="PEDIDO CASEVAC — 9 LINHAS"
          subtitle={`${dossier.comms.nets.find((n) => n.name.toUpperCase().includes('CASEVAC'))?.callsign || 'DUSTOFF'} · MEDEVAC request`}
        />
        <p className="nine-kicker">Transmitir na rede CASEVAC. Ler o número da linha, depois o conteúdo.</p>
        <ol className="nine-line">
          {CASEVAC_LINES.map((line) => (
            <li key={line.key}>
              <span className="nine-n">{line.n}</span>
              <div>
                <span className="nine-label">{line.label}</span>
                <strong>{c[line.key] || '—'}</strong>
                <em>{line.hint}</em>
              </div>
            </li>
          ))}
        </ol>
        {c.remarks ? (
          <section className="sitrep-para">
            <h2>Observações</h2>
            <p>{c.remarks}</p>
          </section>
        ) : null}
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
