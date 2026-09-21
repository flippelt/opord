import { classificationLine, docTypeOf, precedenceOf } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal, UnitPatch } from './ClanSeal'
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
        <p className="op-unit">{dossier.clan.name || 'QUARTEL-GENERAL'}</p>
        <p className="op-place">
          {dossier.header.place || '—'} · {dossier.header.dtg || '—'}
        </p>
        <h1>
          {kind.short} {dossier.header.orderNumber} — {opName}
        </h1>
        <p className="op-subject">{dossier.mission.subject || kind.label}</p>
      </div>
      <UnitPatch src={dossier.clan.patchSrc} shortName={dossier.clan.shortName} size={64} />
    </header>
  )
}

export function OpordFront({ dossier }: { dossier: Dossier }) {
  const prec = precedenceOf(dossier.header.precedence)
  return (
    <Sheet page="opord" exportId="opord-1" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="opord" />
      <div className="op-body">
        <OpordChrome dossier={dossier} />
        <div className="op-id-grid">
          <Field k="Origem / FROM" v={dossier.header.origin} />
          <Field k="Destino / TO" v={dossier.header.destination} />
          <Field k="Info / CC" v={dossier.header.info} />
          <Field k="Precedência" v={`${prec.label} (${prec.nato})`} />
          <Field k="Hora-H / H-HOUR" v={dossier.mission.hHour} />
          <Field k="Fuso" v={dossier.header.timeZone} />
          <Field k="AO" v={dossier.mission.ao} />
          <Field k="Grid" v={dossier.mission.grid} />
          <Field k="Carta / MAP" v={dossier.header.mapSheet} />
          <Field k="Terreno" v={dossier.mission.terrain} />
          <Field k="Cópia" v={`${dossier.document.copyNumber} de ${dossier.document.copyTotal}`} />
          <Field k="Controle" v={dossier.document.controlNumber} />
        </div>
        <ol className="op-smeac">
          <li>
            <h2>Situação</h2>
            <Block label="a. Forças inimigas">{dossier.body.situationEnemy}</Block>
            <Block label="b. Forças amigas">{dossier.body.situationFriendly}</Block>
            <Block label="c. Meios destacados / destacáveis">{dossier.body.situationAttachments}</Block>
            <Block label="d. Condições meteorológicas e de terreno">{dossier.body.situationWeather}</Block>
          </li>
          <li>
            <h2>Missão</h2>
            <p className="op-mission">{dossier.body.mission || '—'}</p>
          </li>
          <li>
            <h2>Execução</h2>
            <Block label="a. Conceito da operação">{dossier.body.executionConcept}</Block>
            <Block label="b. Tarefas às subunidades">{dossier.body.executionTasks}</Block>
            <Block label="c. Instruções de coordenação">{dossier.body.executionCoord}</Block>
          </li>
        </ol>
        <p className="op-cont">CONTINUA NA PÁGINA SEGUINTE</p>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}

export function OpordBack({ dossier }: { dossier: Dossier }) {
  return (
    <Sheet page="opord" exportId="opord-2" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="opord" />
      <div className="op-body">
        <OpordChrome dossier={dossier} />
        <p className="op-cont op-cont-top">CONTINUAÇÃO</p>
        <ol className="op-smeac" start={4}>
          <li>
            <h2>Logística e administração</h2>
            <p>{dossier.body.sustainment || '—'}</p>
          </li>
          <li>
            <h2>Comando e comunicações</h2>
            <p>{dossier.body.commandSignal || '—'}</p>
            <table className="op-nets">
              <thead>
                <tr>
                  <th>Rede</th>
                  <th>Freq.</th>
                  <th>Indicativo</th>
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
              <span>Desafio: {dossier.comms.challenge || '—'}</span>
              <span>Senha: {dossier.comms.password || '—'}</span>
              <span>Sucessão: {dossier.comms.succession || '—'}</span>
            </div>
          </li>
        </ol>
        <section className="op-roe">
          <h2>Regras de engajamento (ROE)</h2>
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
