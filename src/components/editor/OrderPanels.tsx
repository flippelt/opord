import { aarEvent, aarObjective, aarObjectives, aarTimeline, OBJECTIVE_STATUS, objectiveName } from '../../lib/aar'
import { CASEVAC_LINES, PRECEDENCE } from '../../lib/classification'
import type { Dossier, Precedence } from '../../types'
import { Field, SelectField } from '../ImageField'
import { Group, RoutingFields, SignatureGroup, usePatch } from './common'

type BodyKey = keyof Dossier['body']

function BodyField({ k, label, rows }: { k: BodyKey; label: string; rows?: number }) {
  const { dossier, patch } = usePatch()
  return (
    <Field
      label={label}
      edit={`body.${k}`}
      value={dossier.body[k]}
      onChange={(value) => patch((d) => void (d.body[k] = value))}
      multiline
      rows={rows}
    />
  )
}

export function NoticePanel() {
  const { dossier, patch } = usePatch()
  const n = dossier.notice
  const set = (key: keyof Dossier['notice']) => (value: string) => patch((d) => void (d.notice[key] = value))
  return (
    <>
      <Group title="Cabeçalho">
        <Field label="Nº do comunicado" edit="notice.number" value={n.number} onChange={set('number')} placeholder="12/2026" />
        <RoutingFields destination={false} />
        <Field
          label="Para (audiência)"
          edit="notice.audience"
          value={n.audience}
          onChange={set('audience')}
          placeholder="TODO O EFETIVO"
        />
        <Field label="Assunto" edit="notice.subject" value={n.subject} onChange={set('subject')} />
      </Group>
      <Group title="Dados do emprego" hint="Campos de convocação (op night). Preenchidos, entram na folha.">
        <Field label="Apresentação (DTG)" edit="notice.eventDtg" value={n.eventDtg} onChange={set('eventDtg')} />
        <Field label="Comparecimento" edit="notice.attendance" value={n.attendance} onChange={set('attendance')} />
        <div className="row2">
          <Field label="Servidor" edit="notice.server" value={n.server} onChange={set('server')} />
          <Field label="Ponto de reunião / TS" edit="notice.rally" value={n.rally} onChange={set('rally')} />
        </div>
        <Field label="Mods / mapa" edit="notice.mods" value={n.mods} onChange={set('mods')} />
        <Field label="Slotting" edit="notice.slotting" value={n.slotting} onChange={set('slotting')} />
        <Field label="Uniforme / loadout" edit="notice.uniform" value={n.uniform} onChange={set('uniform')} />
      </Group>
      <Group title="Texto">
        <Field label="Texto" edit="notice.body" value={n.body} onChange={set('body')} multiline rows={6} />
        <Field label="Determinações" edit="notice.orders" value={n.orders} onChange={set('orders')} multiline rows={3} />
      </Group>
      <Group title="Vigência">
        <div className="row2">
          <Field label="Vigência de" edit="notice.validity" value={n.validFrom} onChange={set('validFrom')} />
          <Field label="Até" edit="notice.validity" value={n.validUntil} onChange={set('validUntil')} />
        </div>
        <Field label="Distribuição" edit="notice.validity" value={n.distribution} onChange={set('distribution')} />
      </Group>
      <SignatureGroup />
    </>
  )
}

export function OpordFrontPanel() {
  const { dossier, patch } = usePatch()
  const h = dossier.header
  const m = dossier.mission
  return (
    <>
      <Group title="Título" hint="O título junta o tipo, o número da ordem e o nome da operação (na capa).">
        <Field
          label="Nº da ordem"
          edit="header.orderNumber"
          value={h.orderNumber}
          onChange={(orderNumber) => patch((d) => void (d.header.orderNumber = orderNumber))}
        />
        <Field
          label="Assunto"
          edit="mission.subject"
          value={m.subject}
          onChange={(subject) => patch((d) => void (d.mission.subject = subject))}
          multiline
          rows={2}
        />
      </Group>
      <Group title="Identificação">
        <RoutingFields />
        <Field
          label="Info (CC)"
          edit="header.info"
          value={h.info}
          onChange={(info) => patch((d) => void (d.header.info = info))}
        />
        <SelectField
          label="Precedência"
          edit="header.precedence"
          value={h.precedence}
          onChange={(precedence: Precedence) => patch((d) => void (d.header.precedence = precedence))}
          options={PRECEDENCE.map((p) => ({ id: p.id, label: `${p.label} (${p.nato})` }))}
        />
        <div className="row2">
          <Field
            label="Hora-H"
            edit="mission.hHour"
            hint="NLT / TOT em DTG"
            value={m.hHour}
            onChange={(hHour) => patch((d) => void (d.mission.hHour = hHour))}
          />
          <Field
            label="Fuso"
            edit="header.timeZone"
            value={h.timeZone}
            onChange={(timeZone) => patch((d) => void (d.header.timeZone = timeZone))}
          />
        </div>
        <div className="row2">
          <Field label="AO" edit="mission.ao" value={m.ao} onChange={(ao) => patch((d) => void (d.mission.ao = ao))} />
          <Field
            label="Grid"
            edit="mission.grid"
            value={m.grid}
            onChange={(grid) => patch((d) => void (d.mission.grid = grid))}
          />
        </div>
        <div className="row2">
          <Field
            label="Carta / mapa"
            edit="header.mapSheet"
            value={h.mapSheet}
            onChange={(mapSheet) => patch((d) => void (d.header.mapSheet = mapSheet))}
          />
          <Field
            label="Terreno"
            edit="mission.terrain"
            value={m.terrain}
            onChange={(terrain) => patch((d) => void (d.mission.terrain = terrain))}
          />
        </div>
        <p className="field-hint">Cópia e nº de controle ficam na capa.</p>
      </Group>
      <Group title="1. Situação">
        <BodyField k="situationEnemy" label="a. Forças inimigas" />
        <BodyField k="situationFriendly" label="b. Forças amigas" />
        <BodyField k="situationAttachments" label="c. Destacamentos" rows={3} />
        <BodyField k="situationWeather" label="d. Tempo e terreno" rows={3} />
      </Group>
      <Group title="2. Missão" hint="Quem, o quê, quando, onde, para quê.">
        <BodyField k="mission" label="Missão" />
      </Group>
      <Group title="3. Execução">
        <BodyField k="executionConcept" label="a. Conceito da operação" />
        <BodyField k="executionTasks" label="b. Tarefas" />
        <BodyField k="executionCoord" label="c. Coordenação" />
      </Group>
    </>
  )
}

export function OpordBackPanel() {
  const { dossier, patch } = usePatch()
  return (
    <>
      <Group title="4. Logística">
        <BodyField k="sustainment" label="Logística e administração" />
      </Group>
      <Group title="5. Comando e comunicações">
        <BodyField k="commandSignal" label="Texto" />
        <div data-edit="comms.nets">
          {dossier.comms.nets.map((net, i) => (
            <div key={net.id} className="net-row">
              <Field
                label={i === 0 ? 'Rede' : ''}
                value={net.name}
                onChange={(name) => patch((d) => void (d.comms.nets[i].name = name))}
              />
              <Field
                label={i === 0 ? 'Freq.' : ''}
                value={net.freq}
                onChange={(freq) => patch((d) => void (d.comms.nets[i].freq = freq))}
              />
              <Field
                label={i === 0 ? 'Indicativo' : ''}
                value={net.callsign}
                onChange={(callsign) => patch((d) => void (d.comms.nets[i].callsign = callsign))}
              />
            </div>
          ))}
        </div>
        <div className="row2">
          <Field
            label="Desafio"
            edit="comms.auth"
            value={dossier.comms.challenge}
            onChange={(challenge) => patch((d) => void (d.comms.challenge = challenge))}
          />
          <Field
            label="Senha"
            edit="comms.auth"
            value={dossier.comms.password}
            onChange={(password) => patch((d) => void (d.comms.password = password))}
          />
        </div>
        <Field
          label="Sucessão de comando"
          edit="comms.auth"
          value={dossier.comms.succession}
          onChange={(succession) => patch((d) => void (d.comms.succession = succession))}
        />
      </Group>
      <Group title="Regras de engajamento">
        <BodyField k="roe" label="ROE" rows={3} />
      </Group>
      <SignatureGroup />
    </>
  )
}

export function SitrepPanel() {
  const { dossier, patch } = usePatch()
  const s = dossier.sitrep
  const set = (key: keyof Dossier['sitrep']) => (value: string) => patch((d) => void (d.sitrep[key] = value))
  return (
    <>
      <Group title="Cabeçalho" hint="Origem e destino são os mesmos da OPORD. O DTG é o de emissão, na capa.">
        <RoutingFields />
        <Field label="Período coberto" edit="sitrep.period" value={s.period} onChange={set('period')} />
      </Group>
      <Group title="Relatório">
        <Field label="1. Inimigo" edit="sitrep.enemy" value={s.enemy} onChange={set('enemy')} multiline />
        <Field label="2. Forças amigas" edit="sitrep.friendly" value={s.friendly} onChange={set('friendly')} multiline rows={3} />
        <Field label="3. Situação própria (ACE)" edit="sitrep.own" value={s.own} onChange={set('own')} multiline rows={3} />
        <Field label="4. Pendências" edit="sitrep.issues" value={s.issues} onChange={set('issues')} multiline rows={3} />
        <Field
          label="5. Intenção / próximos passos"
          edit="sitrep.intent"
          value={s.intent}
          onChange={set('intent')}
          multiline
          rows={3}
        />
      </Group>
      <SignatureGroup />
    </>
  )
}

export function AarPanel() {
  const { dossier, patch } = usePatch()
  const a = dossier.aar
  const set = (key: 'dtg' | 'location' | 'summary' | 'lessons' | 'sustain' | 'improve' | 'casualties' | 'bda') =>
    (value: string) => patch((d) => void (d.aar[key] = value))
  return (
    <>
      <Group title="Revisão">
        <div className="row2">
          <Field label="DTG da revisão" edit="aar.dtg" value={a.dtg} onChange={set('dtg')} />
          <Field label="Local" edit="aar.location" value={a.location} onChange={set('location')} />
        </div>
        <Field label="Baixas / ACE" edit="aar.casualties" value={a.casualties} onChange={set('casualties')} />
        <Field label="BDA" edit="aar.bda" value={a.bda} onChange={set('bda')} />
      </Group>
      <Group title="1. O que aconteceu">
        <Field label="Resumo" edit="aar.summary" value={a.summary} onChange={set('summary')} multiline />
      </Group>
      <Group title="2 e 3. Manter e melhorar">
        <Field
          label="Manter — o que funcionou"
          edit="aar.sustain"
          value={a.sustain}
          onChange={set('sustain')}
          multiline
          rows={3}
        />
        <Field
          label="Melhorar — o que falhou"
          edit="aar.improve"
          value={a.improve}
          onChange={set('improve')}
          multiline
          rows={3}
        />
      </Group>
      <Group title="4. Lições identificadas">
        <Field label="Lições" edit="aar.lessons" value={a.lessons} onChange={set('lessons')} multiline rows={3} />
      </Group>
      <p className="field-hint">
        A folha AAR — execução entra quando a linha do tempo tem marcos ou o pacote tem mapas de LZ, PZ ou
        objetivo.
      </p>
      <SignatureGroup />
    </>
  )
}

export function AarExecutionPanel() {
  const { dossier, patch } = usePatch()
  const events = aarTimeline(dossier)
  const objectives = aarObjectives(dossier)
  return (
    <>
      {events.length ? (
        <Group title="5. Planejado × real" hint="A hora real aceita DTG (230204ZSEP26) ou só a hora (0204).">
          {events.map((row) => {
            const result = aarEvent(dossier, row.id)
            const setEvent = (key: 'actual' | 'note') => (value: string) =>
              patch((d) => void (d.aar.events[row.id] = { ...aarEvent(d, row.id), [key]: value }))
            return (
              <div key={row.id} className="intel-edit" data-edit={`aar.event.${row.id}`}>
                <p className="intel-edit-title">
                  {row.mark || '—'} · {row.what || '—'}
                </p>
                <p className="field-hint">Planejado {row.dtg || '—'}</p>
                <div className="row2">
                  <Field label="Hora real" value={result.actual} placeholder={row.dtg || '0204'} onChange={setEvent('actual')} />
                  <Field label="Nota" value={result.note} onChange={setEvent('note')} />
                </div>
              </div>
            )
          })}
        </Group>
      ) : null}
      {objectives.length ? (
        <Group title={`${events.length ? '6' : '5'}. Objetivos`} hint="Os mapas de LZ, PZ e objetivo viram as linhas.">
          {objectives.map((plate) => {
            const result = aarObjective(dossier, plate.id)
            return (
              <div key={plate.id} className="intel-edit" data-edit={`aar.objective.${plate.id}`}>
                <p className="intel-edit-title">{objectiveName(plate)}</p>
                <p className="field-hint">Grid {plate.location || '—'}</p>
                <div className="row2">
                  <SelectField
                    label="Situação"
                    value={result.status}
                    options={OBJECTIVE_STATUS}
                    onChange={(status) =>
                      patch((d) => void (d.aar.objectives[plate.id] = { ...aarObjective(d, plate.id), status }))
                    }
                  />
                  <Field
                    label="Observação"
                    value={result.note}
                    onChange={(note) =>
                      patch((d) => void (d.aar.objectives[plate.id] = { ...aarObjective(d, plate.id), note }))
                    }
                  />
                </div>
              </div>
            )
          })}
        </Group>
      ) : null}
      <SignatureGroup />
    </>
  )
}

export function CasevacPanel() {
  const { dossier, patch } = usePatch()
  return (
    <>
      <Group title="9 linhas" hint="Transmitir na rede CASEVAC, linha por linha.">
        {CASEVAC_LINES.map((line) => (
          <Field
            key={line.key}
            label={`${line.n}. ${line.label}`}
            edit={`casevac.${line.key}`}
            hint={line.hint}
            value={dossier.casevac[line.key]}
            onChange={(v) => patch((d) => void (d.casevac[line.key] = v))}
          />
        ))}
      </Group>
      <Group title="Observações">
        <Field
          label="Observações"
          edit="casevac.remarks"
          value={dossier.casevac.remarks}
          onChange={(remarks) => patch((d) => void (d.casevac.remarks = remarks))}
          multiline
          rows={3}
        />
      </Group>
      <SignatureGroup />
    </>
  )
}
