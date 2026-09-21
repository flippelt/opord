import { classificationLine } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function Para({ label, text }: { label: string; text: string }) {
  return (
    <section className="sitrep-para">
      <h2>{label}</h2>
      <p>{text || '—'}</p>
    </section>
  )
}

export function AarPage({ dossier }: { dossier: Dossier }) {
  const a = dossier.aar
  return (
    <Sheet page="aar" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="aar" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={`AAR — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'REVISÃO'}`}
          subtitle="After Action Review · lições para o próximo emprego"
        />
        <div className="notice-meta">
          <div className="notice-line">
            <span>DTG da revisão</span>
            <strong>{a.dtg || dossier.header.dtg || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>Local</span>
            <strong>{a.location || dossier.header.place || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>Baixas / ACE</span>
            <strong>{a.casualties || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>BDA</span>
            <strong>{a.bda || '—'}</strong>
          </div>
        </div>
        <Para label="1. O que aconteceu" text={a.summary} />
        <Para label="2. O que funcionou" text={a.wentWell} />
        <Para label="3. O que falhou" text={a.wentWrong} />
        <Para label="4. Lições identificadas" text={a.lessons} />
        <div className="aar-split">
          <Para label="Manter" text={a.sustain} />
          <Para label="Melhorar" text={a.improve} />
        </div>
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
