import { classificationLine, docTypeOf, precedenceOf } from '../../lib/classification'
import { annexList } from '../../lib/annexes'
import { paper } from '../../lib/i18n'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal, UnitPatch } from './ClanSeal'
import { unitTitle, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function Block({ label, edit, sub, children }: { label: string; edit?: string; sub?: boolean; children: string }) {
  return (
    <div className={sub ? 'op-block op-block-sub' : 'op-block'} data-edit={edit}>
      <span className="op-label">{label}</span>
      <p>{children || '—'}</p>
    </div>
  )
}

function Field({ k, v, edit }: { k: string; v: string; edit?: string }) {
  return (
    <div className="op-field" data-edit={edit}>
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
        <p className="op-unit" data-edit="clan.name">{unitTitle(dossier.clan.name, dossier.clan.shortName)}</p>
        <p className="op-place" data-edit="header.place header.dtg">
          {dossier.header.place || '—'} · {dossier.header.dtg || '—'}
        </p>
        <h1 data-edit="header.orderNumber mission.name">
          {`${kind.short} ${dossier.header.orderNumber} — ${opName}`.replace(/\s+/g, ' ').trim()}
        </h1>
        <p className="op-subject" data-edit="mission.subject">{dossier.mission.subject || kind.label}</p>
      </div>
      <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
    </header>
  )
}

/** 5.c Sinais: visuais, reconhecimento e palavras-código. Só sai o que estiver preenchido. */
function Signals({ dossier }: { dossier: Dossier }) {
  const t = paper(dossier)
  const c = dossier.comms
  const words = c.codeWords.filter((w) => w.word.trim() || w.meaning.trim())
  if (!c.visualSignals && !c.recognition && !words.length) return null
  return (
    <div className="op-signals">
      <h3>{t.signals}</h3>
      {c.visualSignals ? (
        <p className="op-line" data-edit="comms.signals">
          <strong>{t.visual}:</strong> {c.visualSignals}
        </p>
      ) : null}
      {c.recognition ? (
        <p className="op-line" data-edit="comms.signals">
          <strong>{t.recognition}:</strong> {c.recognition}
        </p>
      ) : null}
      {words.length ? (
        <table className="op-nets op-codes" data-edit="comms.codeWords">
          <thead>
            <tr>
              <th>{t.codeWord}</th>
              <th>{t.meaning}</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <tr key={w.id}>
                <td>{w.word || '—'}</td>
                <td>{w.meaning || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

/** Depois da assinatura: anexos (das folhas do pacote) e distribuição. */
function Closing({ dossier }: { dossier: Dossier }) {
  const t = paper(dossier)
  const annexes = annexList(dossier)
  if (!annexes.length && !dossier.body.distribution) return null
  return (
    <div className="op-closing">
      {annexes.length ? (
        <p data-edit="body.annexes">
          <strong>{t.annexes}:</strong>{' '}
          {annexes.map((a) => `${a.letter} — ${a.label}`).join(' · ')}
        </p>
      ) : null}
      {dossier.body.distribution ? (
        <p data-edit="body.distribution">
          <strong>{t.distribution}:</strong> {dossier.body.distribution}
        </p>
      ) : null}
    </div>
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
          <Field k={t.origin} v={dossier.header.origin} edit="header.origin" />
          <Field k={t.destination} v={dossier.header.destination} edit="header.destination" />
          <Field k={t.info} v={dossier.header.info} edit="header.info" />
          <Field k={t.precedence} v={precLabel} edit="header.precedence" />
          <Field k={t.hhour} v={dossier.mission.hHour} edit="mission.hHour" />
          <Field k={t.zone} v={dossier.header.timeZone} edit="header.timeZone" />
          <Field k="AO" v={dossier.mission.ao} edit="mission.ao" />
          <Field k="Grid" v={dossier.mission.grid} edit="mission.grid" />
          <Field k={t.map} v={dossier.header.mapSheet} edit="header.mapSheet" />
          <Field k={t.terrain} v={dossier.mission.terrain} edit="mission.terrain" />
          <Field k={t.copy} v={`${dossier.document.copyNumber} ${t.of} ${dossier.document.copyTotal}`} edit="document.copy" />
          <Field k={t.control} v={dossier.document.controlNumber} edit="document.control" />
        </div>
        <ol className="op-smeac">
          <li>
            <h2>{t.situation}</h2>
            <Block label={t.enemy} edit="body.situationEnemy">{dossier.body.situationEnemy}</Block>
            {dossier.body.enemyCoa ? (
              <Block label={t.enemyCoa} edit="body.enemyCoa" sub>
                {dossier.body.enemyCoa}
              </Block>
            ) : null}
            <Block label={t.friendly} edit="body.situationFriendly">{dossier.body.situationFriendly}</Block>
            <Block label={t.attachments} edit="body.situationAttachments">{dossier.body.situationAttachments}</Block>
            <Block label={t.weather} edit="body.situationWeather">{dossier.body.situationWeather}</Block>
            <Block label={t.civil} edit="body.situationCivil">{dossier.body.situationCivil}</Block>
          </li>
          <li>
            <h2>{t.mission}</h2>
            <p className="op-mission" data-edit="body.mission">{dossier.body.mission || '—'}</p>
          </li>
          <li>
            <h2>{t.execution}</h2>
            <Block label={t.intent} edit="body.commanderIntent">{dossier.body.commanderIntent}</Block>
            <Block label={t.concept} edit="body.executionConcept">{dossier.body.executionConcept}</Block>
            <Block label={t.tasks} edit="body.executionTasks">{dossier.body.executionTasks}</Block>
            <Block label={t.coord} edit="body.executionCoord">{dossier.body.executionCoord}</Block>
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
            <p data-edit="body.sustainment">{dossier.body.sustainment || '—'}</p>
          </li>
          <li>
            <h2>{t.command}</h2>
            {dossier.comms.commandPost ? (
              <p className="op-line" data-edit="comms.commandPost">
                <strong>{t.commandPost}:</strong> {dossier.comms.commandPost}
              </p>
            ) : null}
            <p data-edit="body.commandSignal">{dossier.body.commandSignal || '—'}</p>
            <table className="op-nets" data-edit="comms.nets">
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
            <div className="op-auth" data-edit="comms.auth">
              <span>{t.challenge}: {dossier.comms.challenge || '—'}</span>
              <span>{t.password}: {dossier.comms.password || '—'}</span>
              {dossier.comms.runningPassword ? (
                <span>
                  {t.runningPassword}: {dossier.comms.runningPassword}
                </span>
              ) : null}
              <span>{t.succession}: {dossier.comms.succession || '—'}</span>
            </div>
            <Signals dossier={dossier} />
          </li>
        </ol>
        <section className="op-roe">
          <h2>{t.roe}</h2>
          <p data-edit="body.roe">{dossier.body.roe || '—'}</p>
        </section>
        {dossier.body.acknowledge ? (
          <p className="op-ack" data-edit="body.acknowledge">
            {t.acknowledge}
          </p>
        ) : null}
        <SignBlock dossier={dossier} size={72} />
        <Closing dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
