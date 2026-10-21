import { readIntelPhoto } from '../../lib/image'
import { emptyHvtSlots, emptyOrbatLines, emptyRoster, emptyTimeline } from '../../defaults'
import { useDossier } from '../../store'
import type { HvtCard } from '../../types'
import { Field, ImageField } from '../ImageField'
import { Group, SignatureGroup, usePatch } from './common'

export function TimelinePanel() {
  const { dossier, patch } = usePatch()
  return (
    <>
      <Group title="Hora-H" hint="Sai no subtítulo da folha. É a mesma da OPORD.">
        <div className="row2">
          <Field
            label="Hora-H"
            edit="mission.hHour"
            value={dossier.mission.hHour}
            onChange={(hHour) => patch((d) => void (d.mission.hHour = hHour))}
          />
          <Field
            label="Fuso"
            edit="header.timeZone"
            value={dossier.header.timeZone}
            onChange={(timeZone) => patch((d) => void (d.header.timeZone = timeZone))}
          />
        </div>
      </Group>
      <Group title="Marcos" hint="O AAR compara cada marco com a hora em que ele aconteceu.">
        {dossier.timeline.map((row, i) => (
          <div key={row.id} className="intel-edit" data-edit={`timeline.${row.id}`}>
            <div className="row2">
              <Field
                label="Marca"
                value={row.mark}
                placeholder="H-30"
                onChange={(mark) => patch((d) => void (d.timeline[i].mark = mark))}
              />
              <Field
                label="DTG"
                value={row.dtg}
                onChange={(dtg) => patch((d) => void (d.timeline[i].dtg = dtg))}
              />
            </div>
            <Field
              label="O que acontece"
              value={row.what}
              onChange={(what) => patch((d) => void (d.timeline[i].what = what))}
            />
            <button type="button" className="btn-ghost" onClick={() => patch((d) => void d.timeline.splice(i, 1))}>
              Remover marco
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.timeline.push({ ...emptyTimeline()[0], id: `t-${crypto.randomUUID()}` })
            })
          }
        >
          + Marco
        </button>
      </Group>
    </>
  )
}

export function RosterPanel() {
  const { dossier, patch } = usePatch()
  return (
    <>
      <Group title="Vagas" hint="Quem ocupa cada vaga.">
        {dossier.roster.map((row, i) => (
          <div key={row.id} className="intel-edit" data-edit={`roster.${row.id}`}>
            <div className="row2">
              <Field
                label="Elemento"
                value={row.element}
                onChange={(element) => patch((d) => void (d.roster[i].element = element))}
              />
              <Field
                label="Vaga"
                value={row.billet}
                onChange={(billet) => patch((d) => void (d.roster[i].billet = billet))}
              />
            </div>
            <div className="row2">
              <Field
                label="Indicativo"
                value={row.callsign}
                onChange={(callsign) => patch((d) => void (d.roster[i].callsign = callsign))}
              />
              <Field
                label="Nome"
                value={row.name}
                onChange={(name) => patch((d) => void (d.roster[i].name = name))}
              />
            </div>
            <button type="button" className="btn-ghost" onClick={() => patch((d) => void d.roster.splice(i, 1))}>
              Remover vaga
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.roster.push({ ...emptyRoster()[0], id: `r-${crypto.randomUUID()}` })
            })
          }
        >
          + Vaga
        </button>
      </Group>
      <SignatureGroup />
    </>
  )
}

export function OrbatPanel() {
  const { dossier, patch } = usePatch()
  return (
    <>
      <Group title="Organização de tarefa">
        {dossier.orbat.map((row, i) => (
          <div key={row.id} className="intel-edit" data-edit={`orbat.${row.id}`}>
            <div className="row2">
              <Field
                label="Escalão"
                value={row.echelon}
                onChange={(echelon) => patch((d) => void (d.orbat[i].echelon = echelon))}
              />
              <Field
                label="Designação"
                value={row.designation}
                onChange={(designation) => patch((d) => void (d.orbat[i].designation = designation))}
              />
            </div>
            <div className="row2">
              <Field
                label="Indicativo"
                value={row.callsign}
                onChange={(callsign) => patch((d) => void (d.orbat[i].callsign = callsign))}
              />
              <Field
                label="Chefe"
                value={row.lead}
                onChange={(lead) => patch((d) => void (d.orbat[i].lead = lead))}
              />
            </div>
            <div className="row2">
              <Field
                label="Efetivo"
                value={row.strength}
                onChange={(strength) => patch((d) => void (d.orbat[i].strength = strength))}
              />
              <Field
                label="Tarefa"
                value={row.task}
                onChange={(task) => patch((d) => void (d.orbat[i].task = task))}
              />
            </div>
            <button type="button" className="btn-ghost" onClick={() => patch((d) => void d.orbat.splice(i, 1))}>
              Remover linha
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.orbat.push({ ...emptyOrbatLines()[0], id: `orbat-${crypto.randomUUID()}` })
            })
          }
        >
          + Linha no ORBAT
        </button>
      </Group>
      <Group title="Rodapé" hint="Sucessão, desafio e senha vêm da OPORD 2/2.">
        <Field
          label="Sucessão de comando"
          edit="comms.auth"
          value={dossier.comms.succession}
          onChange={(succession) => patch((d) => void (d.comms.succession = succession))}
        />
      </Group>
      <SignatureGroup />
    </>
  )
}

export function HvtPanel({ card, index }: { card: HvtCard; index: number }) {
  const { dossier, patch } = usePatch()
  const setActive = useDossier((s) => s.setActive)
  const at = dossier.hvts.findIndex((c) => c.id === card.id)
  const set = (key: keyof Omit<HvtCard, 'id'>) => (value: string) =>
    patch((d) => {
      const target = d.hvts.find((c) => c.id === card.id)
      if (target) target[key] = value
      else d.hvts.push({ ...card, [key]: value })
    })
  const edit = (key: string) => `hvt.${card.id}.${key}`
  return (
    <>
      <Group title={`Alvo HVT-${String(index + 1).padStart(2, '0')}`}>
        <ImageField label="Retrato" edit={edit('photo')} src={card.photoSrc} readFile={readIntelPhoto} onChange={set('photoSrc')} />
        <Field label="Status (CAPTURE / KILL / WANTED)" edit={edit('status')} value={card.status} onChange={set('status')} />
        <div className="row2">
          <Field label="Nome" edit={edit('name')} value={card.name} onChange={set('name')} />
          <Field label="Alias" edit={edit('name')} value={card.alias} onChange={set('alias')} />
        </div>
        <Field label="Função" edit={edit('id')} value={card.role} onChange={set('role')} />
        <div className="row2">
          <Field label="Nacionalidade" edit={edit('id')} value={card.nationality} onChange={set('nationality')} />
          <Field label="Grid" edit={edit('id')} value={card.grid} onChange={set('grid')} />
        </div>
        <Field label="Último avistamento" edit={edit('id')} value={card.lastSeen} onChange={set('lastSeen')} />
      </Group>
      <Group title="Perfil">
        <Field label="Descrição" edit={edit('description')} value={card.description} onChange={set('description')} multiline rows={3} />
        <Field label="Armamento" edit={edit('weapons')} value={card.weapons} onChange={set('weapons')} />
        <Field label="Associados" edit={edit('associates')} value={card.associates} onChange={set('associates')} />
        <Field label="Orientação" edit={edit('guidance')} value={card.guidance} onChange={set('guidance')} multiline rows={2} />
      </Group>
      <div className="panel-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            const id = `hvt-${crypto.randomUUID()}`
            patch((d) => {
              d.hvts.push({ ...emptyHvtSlots()[0], id })
            })
            setActive(`hvt-${useDossier.getState().dossier.hvts.length}`)
          }}
        >
          + Cartão de HVT
        </button>
        {at >= 0 && dossier.hvts.length > 1 ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              patch((d) => void d.hvts.splice(at, 1))
              setActive(`hvt-${Math.max(1, at)}`)
            }}
          >
            Remover este HVT
          </button>
        ) : null}
      </div>
    </>
  )
}
