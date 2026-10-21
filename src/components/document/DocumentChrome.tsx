import { useContext } from 'react'
import type { Dossier } from '../../types'
import { findInsignia, insigniaUrl } from '../../lib/insignia'
import { signatureFont } from '../../lib/signature'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { SheetKey } from './Sheet'

export function unitTitle(name: string, shortName: string, fallback = 'QUARTEL-GENERAL') {
  const title = name.trim() || fallback
  const tag = shortName.trim()
  return tag ? `${title} · ${tag}` : title
}

export function DocumentChrome({
  dossier,
  title,
  subtitle,
  edit,
}: {
  dossier: Dossier
  title: string
  subtitle?: string
  /** Chave `data-edit` do título e do subtítulo. */
  edit?: string
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
        <p className="op-unit" data-edit="clan.name">{unitTitle(dossier.clan.name, dossier.clan.shortName)}</p>
        <p className="op-place" data-edit="header.place header.dtg">
          {dossier.header.place || '—'} · {dossier.header.dtg || '—'}
        </p>
        <h1 data-edit={edit}>{title}</h1>
        {subtitle ? <p className="op-subject" data-edit={edit}>{subtitle}</p> : null}
      </div>
      <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
    </header>
  )
}

/** O que vai ao lado da assinatura: insígnia, foto ou, no padrão, o logo do clã. */
function SignMark({ dossier, c, size }: { dossier: Dossier; c: Dossier['command']; size: number }) {
  const insignia = c.mark === 'insignia' ? findInsignia(c.insignia) : null
  if (insignia) {
    return (
      <img
        className="sign-insignia"
        data-edit="command.mark"
        src={insigniaUrl(insignia.rank)}
        alt={insignia.rank.label}
        style={{ height: size }}
      />
    )
  }
  if (c.mark === 'avatar' && c.avatarSrc) {
    return (
      <img
        className="sign-avatar"
        data-edit="command.mark"
        src={c.avatarSrc}
        alt={c.commander || 'Signatário'}
        width={size}
        height={size}
      />
    )
  }
  return (
    <ClanSeal
      src={dossier.clan.sealSrc}
      name={dossier.clan.name}
      shortName={dossier.clan.shortName}
      size={size}
      edit="command.mark clan.seal"
    />
  )
}

function Signature({ c }: { c: Dossier['command'] }) {
  if (c.signature === 'image' && c.signatureSrc) {
    return <img className="op-sign-signature-img" data-edit="command.signature" src={c.signatureSrc} alt="Assinatura" />
  }
  if (c.signature === 'font') {
    const font = signatureFont(c.signatureFont)
    const text = c.signatureText.trim() || c.commander.trim()
    if (!text) return null
    return (
      <p
        className="op-sign-signature"
        data-edit="command.signature"
        style={{ fontFamily: `${font.family}, cursive`, fontSize: `${Math.round(30 * font.scale)}px` }}
      >
        {text}
      </p>
    )
  }
  return null
}

/** Assinatura do pé das folhas: marca ao lado, assinatura sobre a linha, nome e função embaixo. */
export function SignBlock({ dossier, size = 64 }: { dossier: Dossier; size?: number }) {
  const key = useContext(SheetKey)
  const c = dossier.signatures?.[key] ?? dossier.command
  return (
    <footer className="op-sign">
      <SignMark dossier={dossier} c={c} size={size} />
      <div className="op-sign-block" data-edit="command">
        <Signature c={c} />
        <p className="op-sign-name">
          {c.rank} {c.commander}
        </p>
        <p>{c.billet}</p>
        <p>Indicativo: {c.callsign || '—'}</p>
      </div>
    </footer>
  )
}
