import {
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
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome, SignBlock } from './DocumentChrome'
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

export function AarPage({ dossier }: { dossier: Dossier }) {
  const a = dossier.aar
  return (
    <Sheet page="aar" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="aar" />
      <div className="notice-body">
        <DocumentChrome
          dossier={dossier}
          title={sheetTitle(
            dossier.titles,
            'aar',
            `AAR — ${dossier.mission.name ? `OP. ${dossier.mission.name}` : 'REVISÃO'}`,
          )}
          subtitle="After Action Review · lições para o próximo emprego"
        />
        <div className="notice-meta">
          <div className="notice-line">
            <span>DTG da revisão</span>
            <strong>{a.dtg || dossier.header.dtg || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>Local</span>
            <strong>{a.location || dossier.header.place || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>Baixas / ACE</span>
            <strong>{a.casualties || '—'}</strong>
          </div>
          <div className="notice-line">
            <span>BDA</span>
            <strong>{a.bda || '—'}</strong>
          </div>
        </div>
        <Para label="1. O que aconteceu" text={a.summary} />
        <Para label="2. O que funcionou" text={a.wentWell} />
        <Para label="3. O que falhou" text={a.wentWrong} />
        <Para label="4. Lições identificadas" text={a.lessons} />
        <div className="aar-split">
          <Para label="Manter" text={a.sustain} />
          <Para label="Melhorar" text={a.improve} />
        </div>
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
            <h2>5. Planejado × real</h2>
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
                    <tr key={row.id}>
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
            <h2>{events.length ? '6' : '5'}. Objetivos</h2>
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
                    <tr key={plate.id}>
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
        <SignBlock dossier={dossier} />
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
