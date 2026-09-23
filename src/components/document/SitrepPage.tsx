import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { unitTitle } from './DocumentChrome'
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

export function SitrepPage({ dossier }: { dossier: Dossier }) {
  const s = dossier.sitrep
  return (
    <Sheet page="sitrep" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="sitrep" />
      <div className="notice-body">
        <header className="op-head">
          <ClanSeal
            src={dossier.clan.sealSrc}
            name={dossier.clan.name}
            shortName={dossier.clan.shortName}
            size={72}
          />
          <div className="op-head-mid">
            <p className="op-unit">{unitTitle(dossier.clan.name, dossier.clan.shortName)}</p>
            <p className="op-place">
              {dossier.header.place || '—'} · {dossier.header.dtg || '—'}
            </p>
            <h1>
              {sheetTitle(
                dossier.titles,
                'sitrep',
                `SITREP ${dossier.header.orderNumber} — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'SITUAÇÃO'}`,
              )}
            </h1>
            <p className="op-subject">{dossier.command.callsign || 'WATCHTOWER'} para cadeia de comando</p>
          </div>
          <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
        </header>

        <div className="notice-meta">
          <div className="notice-line">
            <span>Origem</span>
            <strong>{dossier.header.origin || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>Destino</span>
            <strong>{dossier.header.destination || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>DTG do relatório</span>
            <strong>{dossier.header.dtg || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>Período</span>
            <strong>{s.period || '—'}</strong>
          </div>
        </div>

        <Para label="1. Inimigo" text={s.enemy} />
        <Para label="2. Forças amigas" text={s.friendly} />
        <Para label="3. Situação própria (ACE)" text={s.own} />
        <Para label="4. Pendências / shortfalls" text={s.issues} />
        <Para label="5. Intenção / próximos passos" text={s.intent} />

        <footer className="op-sign">
          <ClanSeal
            src={dossier.clan.sealSrc}
            name={dossier.clan.name}
            shortName={dossier.clan.shortName}
            size={64}
          />
          <div className="op-sign-block">
            <p className="op-sign-name">
              {dossier.command.rank} {dossier.command.commander}
            </p>
            <p>{dossier.command.billet}</p>
            <p>Indicativo: {dossier.command.callsign || '—'}</p>
          </div>
        </footer>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
