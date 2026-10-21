import {
  aarActions,
  aarElements,
  aarLoss,
  aceLabel,
  aarEvent,
  aarObjective,
  aarObjectives,
  aarTimeline,
  clockDelta,
  formatDelta,
  objectiveName,
  statusLabel,
} from '../../lib/aar'
import { classificationLine } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { MetaLine, Para } from './Para'
import { DocumentChrome, SignBlock } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

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
          <MetaLine label="DTG da revisão" value={a.dtg || dossier.header.dtg} edit="aar.dtg" />
          <MetaLine label="Local" value={a.location || dossier.header.place} edit="aar.location" />
          <MetaLine label="Baixas / ACE" value={a.casualties} edit="aar.casualties" />
          <MetaLine label="BDA" value={a.bda} edit="aar.bda" />
        </div>
        <Para label="1. O que aconteceu" text={a.summary} edit="aar.summary" />
        <Para label="2. Manter — o que funcionou" text={a.sustain} edit="aar.sustain" />
        <Para label="3. Melhorar — o que falhou" text={a.improve} edit="aar.improve" />
        <Para label="4. Lições identificadas" text={a.lessons} edit="aar.lessons" />
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}

export function AarExecutionPage({ dossier }: { dossier: Dossier }) {
  const events = aarTimeline(dossier)
  const objectives = aarObjectives(dossier)
  const elements = aarElements(dossier)
  const actions = aarActions(dossier)
  // Os itens continuam a numeração do AAR (1 a 4 na primeira folha) e pulam o que estiver vazio.
  let next = 5
  const num = {
    events: events.length ? next++ : 0,
    objectives: objectives.length ? next++ : 0,
    losses: elements.length ? next++ : 0,
    actions: actions.length ? next++ : 0,
  }
  return (
    <Sheet page="aar" exportId="aar-execucao" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="aar" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={`AAR — EXECUÇÃO${dossier.mission.name ? ` · OP. ${dossier.mission.name}` : ''}`}
          subtitle={`Planejado × real · Hora-H ${dossier.mission.hHour || '—'} · ${dossier.header.timeZone || 'ZULU'}`}
        />
        {events.length ? (
          <section className="sitrep-para">
            <h2>{num.events}. Planejado × real</h2>
            <table className="orbat-table aar-table">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Evento</th>
                  <th>Planejado</th>
                  <th>Real</th>
                  <th>Diferença</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {events.map((row) => {
                  const result = aarEvent(dossier, row.id)
                  const delta = clockDelta(row.dtg, result.actual)
                  return (
                    <tr key={row.id} data-edit={`aar.event.${row.id}`}>
                      <td>{row.mark || '—'}</td>
                      <td>{row.what || '—'}</td>
                      <td>{row.dtg || '—'}</td>
                      <td>{result.actual || '—'}</td>
                      <td className={`aar-delta${delta && delta > 0 ? ' aar-late' : ''}`}>{formatDelta(delta)}</td>
                      <td>{result.note || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        ) : null}
        {objectives.length ? (
          <section className="sitrep-para">
            <h2>{num.objectives}. Objetivos</h2>
            <table className="orbat-table aar-table">
              <thead>
                <tr>
                  <th>Objetivo</th>
                  <th>Grid</th>
                  <th>Situação</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {objectives.map((plate) => {
                  const result = aarObjective(dossier, plate.id)
                  return (
                    <tr key={plate.id} data-edit={`aar.objective.${plate.id}`}>
                      <td>{objectiveName(plate)}</td>
                      <td>{plate.location || '—'}</td>
                      <td className={`aar-status aar-status-${result.status || 'none'}`}>
                        {result.status ? statusLabel(result.status) : '—'}
                      </td>
                      <td>{result.note || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        ) : null}
        {elements.length ? (
          <section className="sitrep-para">
            <h2>{num.losses}. Baixas por elemento</h2>
            <table className="orbat-table aar-table">
              <thead>
                <tr>
                  <th>Elemento</th>
                  <th>Indicativo</th>
                  <th>KIA</th>
                  <th>WIA</th>
                  <th>ACE</th>
                </tr>
              </thead>
              <tbody>
                {elements.map((row) => {
                  const loss = aarLoss(dossier, row.id)
                  return (
                    <tr key={row.id} data-edit={`aar.loss.${row.id}`}>
                      <td>{row.designation || '—'}</td>
                      <td>{row.callsign || '—'}</td>
                      <td>{loss.kia || '—'}</td>
                      <td>{loss.wia || '—'}</td>
                      <td className={`aar-status aar-ace-${loss.status || 'none'}`}>
                        {loss.status ? aceLabel(loss.status) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        ) : null}
        {actions.length ? (
          <section className="sitrep-para">
            <h2>{num.actions}. Ações para a próxima</h2>
            <table className="orbat-table aar-table">
              <thead>
                <tr>
                  <th>Ação</th>
                  <th>Tipo</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action.id} data-edit={`aar.action.${action.id}`}>
                    <td>{action.text || '—'}</td>
                    <td className="aar-status">{action.kind === 'sustain' ? 'Manter' : 'Melhorar'}</td>
                    <td>{action.owner || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
