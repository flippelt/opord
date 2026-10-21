import { classificationLine } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { MetaLine, Para } from './Para'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { unitTitle, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

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
            <p className="op-unit" data-edit="clan.name">{unitTitle(dossier.clan.name, dossier.clan.shortName)}</p>
            <p className="op-place" data-edit="header.place header.dtg">
              {dossier.header.place || '—'} · {dossier.header.dtg || '—'}
            </p>
            <h1>
              {`SITREP ${dossier.header.orderNumber} — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'SITUAÇÃO'}`}
            </h1>
            <p className="op-subject">{dossier.command.callsign || 'WATCHTOWER'} para cadeia de comando</p>
          </div>
          <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
        </header>

        <div className="notice-meta">
          <MetaLine label="Origem" value={dossier.header.origin} edit="header.origin" />
          <MetaLine label="Destino" value={dossier.header.destination} edit="header.destination" />
          <MetaLine label="DTG do relatório" value={dossier.header.dtg} edit="header.dtg" />
          <MetaLine label="Período" value={s.period} edit="sitrep.period" />
        </div>

        <Para label="1. Inimigo" text={s.enemy} edit="sitrep.enemy" />
        <Para label="2. Forças amigas" text={s.friendly} edit="sitrep.friendly" />
        <Para label="3. Situação própria (ACE)" text={s.own} edit="sitrep.own" />
        <Para label="4. Pendências / shortfalls" text={s.issues} edit="sitrep.issues" />
        <Para label="5. Intenção / próximos passos" text={s.intent} edit="sitrep.intent" />

        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
