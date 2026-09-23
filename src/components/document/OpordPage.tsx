import { classificationLine, docTypeOf, precedenceOf } from '../../lib/classification'
import { paper } from '../../lib/i18n'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { unitTitle } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div className="op-block">
      <span className="op-label">{label}</span>
      <p>{children || '—'}</p>
    </div>
  )
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="op-field">
      <span>{k}</span>
      <strong>{v || '—'}</strong>
    </div>
  )
}

function OpordChrome({ dossier }: { dossier: Dossier }) {
  const kind = docTypeOf(dossier.document.type)
  const opName = dossier.mission.name ? `OP. ${dossier.mission.name}` : kind.short
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
        <h1>
          {sheetTitle(
            dossier.titles,
            'opord',
            `${kind.short} ${dossier.header.orderNumber} — ${opName}`.replace(/\s+/g, ' ').trim(),
          )}
        </h1>
        <p className="op-subject">{dossier.mission.subject || kind.label}</p>
      </div>
      <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
    </header>
  )
}

export function OpordFront({ dossier }: { dossier: Dossier }) {
  const t = paper(dossier)
  const prec = precedenceOf(dossier.header.precedence)
  const precLabel = dossier.document.language === 'en' ? prec.nato : `${prec.label} (${prec.nato})`
  return (
    <Sheet page="opord" exportId="opord-1" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="opord" />
      <div className="op-body">
        <OpordChrome dossier={dossier} />
        <div className="op-id-grid">
          <Field k={t.origin} v={dossier.header.origin} />
          <Field k={t.destination} v={dossier.header.destination} />
          <Field k={t.info} v={dossier.header.info} />
          <Field k={t.precedence} v={precLabel} />
          <Field k={t.hhour} v={dossier.mission.hHour} />
          <Field k={t.zone} v={dossier.header.timeZone} />
          <Field k="AO" v={dossier.mission.ao} />
          <Field k="Grid" v={dossier.mission.grid} />
          <Field k={t.map} v={dossier.header.mapSheet} />
          <Field k={t.terrain} v={dossier.mission.terrain} />
          <Field k={t.copy} v={`${dossier.document.copyNumber} ${t.of} ${dossier.document.copyTotal}`} />
          <Field k={t.control} v={dossier.document.controlNumber} />
        </div>
        <ol className="op-smeac">
          <li>
            <h2>{t.situation}</h2>
            <Block label={t.enemy}>{dossier.body.situationEnemy}</Block>
            <Block label={t.friendly}>{dossier.body.situationFriendly}</Block>
            <Block label={t.attachments}>{dossier.body.situationAttachments}</Block>
            <Block label={t.weather}>{dossier.body.situationWeather}</Block>
          </li>
          <li>
            <h2>{t.mission}</h2>
            <p className="op-mission">{dossier.body.mission || '—'}</p>
          </li>
          <li>
            <h2>{t.execution}</h2>
            <Block label={t.concept}>{dossier.body.executionConcept}</Block>
            <Block label={t.tasks}>{dossier.body.executionTasks}</Block>
            <Block label={t.coord}>{dossier.body.executionCoord}</Block>
          </li>
        </ol>
        <p className="op-cont">{paper(dossier).continues}</p>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}

export function OpordBack({ dossier }: { dossier: Dossier }) {
  const t = paper(dossier)
  return (
    <Sheet page="opord" exportId="opord-2" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="opord" />
      <div className="op-body">
        <OpordChrome dossier={dossier} />
        <p className="op-cont op-cont-top">{t.continued}</p>
        <ol className="op-smeac" start={4}>
          <li>
            <h2>{t.sustainment}</h2>
            <p>{dossier.body.sustainment || '—'}</p>
          </li>
          <li>
            <h2>{t.command}</h2>
            <p>{dossier.body.commandSignal || '—'}</p>
            <table className="op-nets">
              <thead>
                <tr>
                  <th>{t.net}</th>
                  <th>{t.freq}</th>
                  <th>{t.callsign}</th>
                </tr>
              </thead>
              <tbody>
                {dossier.comms.nets.map((n) => (
                  <tr key={n.id}>
                    <td>{n.name || '—'}</td>
                    <td>{n.freq || '—'}</td>
                    <td>{n.callsign || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="op-auth">
              <span>{t.challenge}: {dossier.comms.challenge || '—'}</span>
              <span>{t.password}: {dossier.comms.password || '—'}</span>
              <span>{t.succession}: {dossier.comms.succession || '—'}</span>
            </div>
          </li>
        </ol>
        <section className="op-roe">
          <h2>{t.roe}</h2>
          <p>{dossier.body.roe || '—'}</p>
        </section>
        <footer className="op-sign">
          <div className="op-sign-seal">
            <ClanSeal
              src={dossier.clan.sealSrc}
              name={dossier.clan.name}
              shortName={dossier.clan.shortName}
              size={72}
            />
          </div>
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
