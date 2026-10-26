import type { CSSProperties } from 'react'
import { classificationLine, docTypeOf, isNoticeType } from '../../lib/classification'
import { inkOn } from '../../lib/clanColors'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { unitTitle, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function Line({ k, v, edit }: { k: string; v: string; edit?: string }) {
  if (!v) return null
  return (
    <div className="notice-line" data-edit={edit}>
      <span>{k}</span>
      <strong>{v}</strong>
    </div>
  )
}

function noticeTitle(dossier: Dossier) {
  const n = dossier.notice
  return dossier.document.type === 'boletim'
    ? `BOLETIM Nº ${n.number || '—'}`
    : dossier.document.type === 'convocacao'
      ? `CONVOCAÇÃO Nº ${n.number || '—'}`
      : `COMUNICADO Nº ${n.number || '—'}`
}

function isCallup(dossier: Dossier) {
  const n = dossier.notice
  return dossier.document.type === 'convocacao' || Boolean(n.eventDtg || n.server || n.rally)
}

function EventGrid({ dossier }: { dossier: Dossier }) {
  const n = dossier.notice
  return (
    <section className="notice-event">
      <h2>Dados do emprego</h2>
      <div className="notice-event-grid">
        <Line k="Apresentação / DTG" v={n.eventDtg} edit="notice.eventDtg" />
        <Line k="Comparecimento" v={n.attendance} edit="notice.attendance" />
        <Line k="Servidor" v={n.server} edit="notice.server" />
        <Line k="Ponto de reunião" v={n.rally} edit="notice.rally" />
        <Line k="Mods / mapa" v={n.mods} edit="notice.mods" />
        <Line k="Slotting" v={n.slotting} edit="notice.slotting" />
        <Line k="Uniforme / loadout" v={n.uniform} edit="notice.uniform" />
      </div>
    </section>
  )
}

/** Folha do clã: nas cores do clã, sem faixas, grau de sigilo nem carimbos. */
function ClanNotice({ dossier }: { dossier: Dossier }) {
  const n = dossier.notice
  const c = dossier.clan
  const vars = { '--clan': c.accent, '--clan-ink': inkOn(c.accent) } as CSSProperties
  return (
    <Sheet page="notice" paper={c.base} ink={inkOn(c.base)}>
      <div className="clan-sheet" style={vars}>
        <header className="clan-sheet-bar" data-edit="clan.name">
          <span>{c.name || 'QUARTEL-GENERAL'}</span>
          {c.shortName ? <span className="clan-sheet-tag">{c.shortName}</span> : null}
        </header>
        <div className="clan-sheet-body">
          <div className="clan-sheet-hero">
            <ClanSeal src={c.sealSrc} name={c.name} shortName={c.shortName} size={180} />
            <p className="clan-sheet-kicker" data-edit="notice.number">{noticeTitle(dossier)}</p>
            <h1 data-edit="notice.subject">{n.subject || docTypeOf(dossier.document.type).label}</h1>
            <p className="clan-sheet-place" data-edit="header.place header.dtg">
              {[dossier.header.place, dossier.header.dtg].filter(Boolean).join(' · ')}
            </p>
          </div>

          <div className="clan-sheet-meta">
            <Line k="De" v={dossier.header.origin} edit="header.origin" />
            <Line k="Para" v={n.audience || dossier.header.destination} edit="notice.audience header.destination" />
          </div>

          {isCallup(dossier) ? <EventGrid dossier={dossier} /> : null}

          <p className="clan-sheet-text notice-pre" data-edit="notice.body">{n.body || '—'}</p>

          {n.orders ? (
            <section className="clan-sheet-orders">
              <h2>Determinações</h2>
              <p className="notice-pre" data-edit="notice.orders">{n.orders}</p>
            </section>
          ) : null}

          {n.validFrom || n.validUntil || n.distribution ? (
            <div className="clan-sheet-meta" data-edit="notice.validity">
              <Line k="Vigência de" v={n.validFrom} />
              <Line k="Até" v={n.validUntil} />
              <Line k="Distribuição" v={n.distribution} />
            </div>
          ) : null}

          <SignBlock dossier={dossier} />
        </div>
        <footer className="clan-sheet-foot" data-edit="clan.motto">
          {c.motto ? <span>{c.motto}</span> : null}
        </footer>
      </div>
    </Sheet>
  )
}

export function NoticePage({ dossier }: { dossier: Dossier }) {
  if (dossier.notice.look === 'clan') return <ClanNotice dossier={dossier} />
  const kind = isNoticeType(dossier.document.type)
    ? docTypeOf(dossier.document.type)
    : docTypeOf('comunicado')
  const n = dossier.notice
  const title = noticeTitle(dossier)

  return (
    <Sheet page="notice" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="notice" />
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
            <h1 data-edit="notice.number">{title}</h1>
            <p className="op-subject">{kind.label}</p>
          </div>
          <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
        </header>

        <div className="notice-meta">
          <Line k="De / FROM" v={dossier.header.origin} edit="header.origin" />
          <Line k="Para / TO" v={n.audience || dossier.header.destination} edit="notice.audience header.destination" />
          <Line k="DTG" v={dossier.header.dtg} edit="header.dtg" />
          <Line k="Nº controle" v={dossier.document.controlNumber} edit="document.control" />
          <Line k="Assunto" v={n.subject} edit="notice.subject" />
          <Line k="Referência" v={dossier.mission.name ? `OP. ${dossier.mission.name}` : ''} edit="mission.name" />
        </div>

        {isCallup(dossier) ? <EventGrid dossier={dossier} /> : null}

        <section className="notice-text">
          <h2>{dossier.document.type === 'boletim' ? 'Itens' : 'Texto'}</h2>
          <p className="notice-pre" data-edit="notice.body">{n.body || '—'}</p>
        </section>

        {n.orders ? (
          <section className="notice-orders">
            <h2>Determinações</h2>
            <p className="notice-pre" data-edit="notice.orders">{n.orders}</p>
          </section>
        ) : null}

        <div className="notice-validity" data-edit="notice.validity">
          <Line k="Vigência de" v={n.validFrom} />
          <Line k="Até" v={n.validUntil} />
          <Line k="Distribuição" v={n.distribution} />
        </div>

        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
