import type { Dossier } from '../../types'
import { ClanSeal, UnitPatch } from './ClanSeal'

export function unitTitle(name: string, shortName: string, fallback = 'QUARTEL-GENERAL') {
  const title = name.trim() || fallback
  const tag = shortName.trim()
  return tag ? `${title} · ${tag}` : title
}

export function DocumentChrome({
  dossier,
  title,
  subtitle,
}: {
  dossier: Dossier
  title: string
  subtitle?: string
}) {
  return (
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
        <h1>{title}</h1>
        {subtitle ? <p className="op-subject">{subtitle}</p> : null}
      </div>
      <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
    </header>
  )
}

export function SignBlock({ dossier }: { dossier: Dossier }) {
  return (
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
  )
}
