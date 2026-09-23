import { classificationLine, docTypeOf, isNoticeType } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { unitTitle } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function Line({ k, v }: { k: string; v: string }) {
  if (!v) return null
  return (
    <div className="notice-line">
      <span>{k}</span>
      <strong>{v}</strong>
    </div>
  )
}

export function NoticePage({ dossier }: { dossier: Dossier }) {
  const kind = isNoticeType(dossier.document.type)
    ? docTypeOf(dossier.document.type)
    : docTypeOf('comunicado')
  const n = dossier.notice
  const isCallup = dossier.document.type === 'convocacao' || Boolean(n.eventDtg || n.server || n.rally)
  const title =
    dossier.document.type === 'boletim'
      ? `BOLETIM Nº ${n.number || '—'}`
      : dossier.document.type === 'convocacao'
        ? `CONVOCAÇÃO Nº ${n.number || '—'}`
        : `COMUNICADO Nº ${n.number || '—'}`

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
            <p className="op-unit">{unitTitle(dossier.clan.name, dossier.clan.shortName)}</p>
            <p className="op-place">
              {dossier.header.place || '—'} · {dossier.header.dtg || '—'}
            </p>
            <h1>{sheetTitle(dossier.titles, 'notice', title)}</h1>
            <p className="op-subject">{kind.label}</p>
          </div>
          <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
        </header>

        <div className="notice-meta">
          <Line k="De / FROM" v={dossier.header.origin} />
          <Line k="Para / TO" v={n.audience || dossier.header.destination} />
          <Line k="DTG" v={dossier.header.dtg} />
          <Line k="Nº controle" v={dossier.document.controlNumber} />
          <Line k="Assunto" v={n.subject} />
          <Line k="Referência" v={dossier.mission.name ? `OP. ${dossier.mission.name}` : ''} />
        </div>

        {isCallup ? (
          <section className="notice-event">
            <h2>Dados do emprego</h2>
            <div className="notice-event-grid">
              <Line k="Apresentação / DTG" v={n.eventDtg} />
              <Line k="Comparecimento" v={n.attendance} />
              <Line k="Servidor" v={n.server} />
              <Line k="Ponto de reunião" v={n.rally} />
              <Line k="Mods / mapa" v={n.mods} />
              <Line k="Slotting" v={n.slotting} />
              <Line k="Uniforme / loadout" v={n.uniform} />
            </div>
          </section>
        ) : null}

        <section className="notice-text">
          <h2>{dossier.document.type === 'boletim' ? 'Itens' : 'Texto'}</h2>
          <p className="notice-pre">{n.body || '—'}</p>
        </section>

        {n.orders ? (
          <section className="notice-orders">
            <h2>Determinações</h2>
            <p className="notice-pre">{n.orders}</p>
          </section>
        ) : null}

        <div className="notice-validity">
          <Line k="Vigência de" v={n.validFrom} />
          <Line k="Até" v={n.validUntil} />
          <Line k="Distribuição" v={n.distribution} />
        </div>

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
