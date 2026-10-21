import { useState } from 'react'
import { readIntelPhoto } from '../../lib/image'
import { CAPTION_PRESETS, MAP_KINDS } from '../../lib/mapPlate'
import { emptyMapPlate } from '../../defaults'
import { useDossier } from '../../store'
import type { BlankPage, IntelPhoto, MapKind, MapPlate } from '../../types'
import { Field, ImageField, SelectField } from '../ImageField'
import { Group, usePatch } from './common'

const CAPTION_CHOICES = [
  ...CAPTION_PRESETS.map((id) => ({ id, label: id })),
  { id: 'custom', label: 'Outra' },
]

function MapCaption({
  label,
  edit,
  value,
  fallback,
  onChange,
}: {
  label: string
  edit: string
  value: string
  fallback: (typeof CAPTION_PRESETS)[number]
  onChange: (value: string) => void
}) {
  const [custom, setCustom] = useState(false)
  const trimmed = value.trim()
  const preset = (CAPTION_PRESETS as readonly string[]).includes(trimmed)
  const choice = custom || (trimmed && !preset) ? 'custom' : trimmed || fallback
  return (
    <div className="row2">
      <SelectField
        label={label}
        edit={edit}
        value={choice}
        onChange={(next) => {
          if (next === 'custom') {
            setCustom(true)
            return
          }
          setCustom(false)
          onChange(next)
        }}
        options={CAPTION_CHOICES}
      />
      <Field
        label="Texto da legenda"
        edit={edit}
        value={value}
        placeholder={fallback}
        onChange={(next) => {
          setCustom(!(CAPTION_PRESETS as readonly string[]).includes(next.trim()))
          onChange(next)
        }}
      />
    </div>
  )
}

export function MapPanel({ plate }: { plate: MapPlate }) {
  const { dossier, patch } = usePatch()
  const setActive = useDossier((s) => s.setActive)
  const at = dossier.maps.findIndex((m) => m.id === plate.id)
  /** Edita o mapa desta folha; sem mapa salvo, ele entra no pacote. */
  function update(recipe: (m: MapPlate) => void) {
    patch((d) => {
      let target = d.maps.find((m) => m.id === plate.id)
      if (!target) {
        target = { ...plate, id: `map-${crypto.randomUUID()}` }
        d.maps.push(target)
      }
      recipe(target)
    })
    if (at < 0) {
      const added = useDossier.getState().dossier.maps.at(-1)
      if (added) setActive(`map-${added.id}`)
    }
  }
  const edit = (key: string) => `map.${plate.id}.${key}`
  return (
    <>
      <Group title="Lugar" sub="Nome, legenda e tipo" hint="O tipo escolhe o que entra embaixo da imagem: azimute só no LZ, marcação e proa no PZ, direção de entrada no objetivo.">
        <Field
          label="Nome do lugar"
          edit={edit('title')}
          hint="Título desta folha. Também nomeia a linha do objetivo no AAR."
          value={plate.title}
          placeholder="LZ HAWK"
          onChange={(title) => update((m) => void (m.title = title))}
        />
        <Field
          label="Legenda da folha"
          edit={edit('title')}
          value={plate.caption}
          placeholder="Clareira oeste · H-30"
          onChange={(caption) => update((m) => void (m.caption = caption))}
        />
        <SelectField
          label="Tipo do mapa"
          value={plate.kind}
          onChange={(kind: MapKind) => update((m) => void (m.kind = kind))}
          options={MAP_KINDS}
        />
      </Group>
      <Group title="Imagens" sub="Zoom, drone e grade" hint="Uma imagem, no retrato, ocupa até metade da folha. Com as duas, elas ficam lado a lado, no mesmo tamanho.">
        <div className="row2">
          <SelectField
            label="Imagens"
            value={plate.images}
            onChange={(images) => update((m) => void (m.images = images))}
            options={[
              { id: 'pair', label: 'Zoom e drone' },
              { id: 'one', label: 'Uma imagem, maior' },
            ]}
          />
          {plate.images === 'one' ? (
            <SelectField
              label="Qual imagem"
              value={plate.focus}
              onChange={(focus) => update((m) => void (m.focus = focus))}
              options={[
                { id: 'chart', label: 'Zoom do mapa' },
                { id: 'photo', label: 'Vista de drone' },
              ]}
            />
          ) : null}
        </div>
        <ImageField
          label="Zoom do mapa"
          edit={edit('chart')}
          hint="O mapa do jogo, mais fechado naquele ponto. Com as duas imagens, fica à esquerda. A grade por cima vale só para esta."
          src={plate.src}
          readFile={readIntelPhoto}
          onChange={(src) => update((m) => void (m.src = src))}
        />
        <MapCaption
          label="Legenda do zoom"
          edit={edit('chart')}
          value={plate.chartLabel}
          fallback="Zoom"
          onChange={(chartLabel) => update((m) => void (m.chartLabel = chartLabel))}
        />
        <ImageField
          label="Vista de drone"
          edit={edit('photo')}
          hint="A foto aérea do mesmo ponto. Com as duas imagens, fica à direita."
          src={plate.photoSrc}
          readFile={readIntelPhoto}
          onChange={(photoSrc) => update((m) => void (m.photoSrc = photoSrc))}
        />
        <MapCaption
          label="Legenda do drone"
          edit={edit('photo')}
          value={plate.photoLabel}
          fallback="Drone"
          onChange={(photoLabel) => update((m) => void (m.photoLabel = photoLabel))}
        />
        <label className={plate.grid ? 'chip on' : 'chip'}>
          <input type="checkbox" checked={plate.grid} onChange={() => update((m) => void (m.grid = !m.grid))} />
          Grade por cima do mapa
        </label>
        {plate.grid ? (
          <div className="row2">
            <Field
              label="Colunas"
              edit={edit('chart')}
              value={String(plate.cols)}
              onChange={(value) => update((m) => void (m.cols = Number(value) || 1))}
            />
            <Field
              label="Linhas"
              edit={edit('chart')}
              value={String(plate.rows)}
              onChange={(value) => update((m) => void (m.rows = Number(value) || 1))}
            />
          </div>
        ) : null}
        <label className={plate.fullPage ? 'chip on' : 'chip'}>
          <input
            type="checkbox"
            checked={plate.fullPage}
            onChange={() => update((m) => void (m.fullPage = !m.fullPage))}
          />
          Página inteira
        </label>
        <p className="field-hint">
          Na paisagem, a imagem ocupa o resto da folha, embaixo do cabeçalho. As notas saem; as faixas ficam. No retrato, use uma imagem só.
        </p>
      </Group>
      <Group title="Notas do mapa" sub="Grid e referências">
        <Field
          label="Localização no grid"
          edit={edit('notes')}
          value={plate.location}
          placeholder="166127"
          onChange={(location) => update((m) => void (m.location = location))}
        />
        {plate.kind === 'lz' ? (
          <Field
            label="Azimute após o desembarque"
            edit={edit('notes')}
            value={plate.azimuth}
            placeholder="090 — leste"
            onChange={(azimuth) => update((m) => void (m.azimuth = azimuth))}
          />
        ) : null}
        {plate.kind === 'pz' ? (
          <div className="row2">
            <Field
              label="Marcação"
              edit={edit('notes')}
              value={plate.marking}
              placeholder="Fumaça verde + IR strobe"
              onChange={(marking) => update((m) => void (m.marking = marking))}
            />
            <Field
              label="Proa de decolagem"
              edit={edit('notes')}
              value={plate.heading}
              placeholder="270 — vento de 270"
              onChange={(heading) => update((m) => void (m.heading = heading))}
            />
          </div>
        ) : null}
        {plate.kind === 'objective' ? (
          <Field
            label="Direção de entrada"
            edit={edit('notes')}
            value={plate.entry}
            placeholder="Face noroeste, junto à rodovia"
            onChange={(entry) => update((m) => void (m.entry = entry))}
          />
        ) : null}
        <Field
          label="Pontos de referência"
          edit={edit('notes')}
          hint="O que se vê no chão: clareira, trilha, prédio, via."
          value={plate.references}
          multiline
          rows={3}
          onChange={(references) => update((m) => void (m.references = references))}
        />
        <Field
          label="Observações da região"
          edit={edit('notes')}
          value={plate.observations}
          multiline
          rows={3}
          onChange={(observations) => update((m) => void (m.observations = observations))}
        />
      </Group>
      <div className="panel-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            const next = emptyMapPlate()
            patch((d) => void d.maps.splice(at < 0 ? d.maps.length : at + 1, 0, next))
            setActive(`map-${next.id}`)
          }}
        >
          + Outro mapa
        </button>
        {at >= 0 ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              patch((d) => void d.maps.splice(at, 1))
              const rest = useDossier.getState().dossier.maps
              setActive(rest.length ? `map-${rest[Math.max(0, at - 1)].id}` : 'setup')
            }}
          >
            Remover este mapa
          </button>
        ) : null}
      </div>
    </>
  )
}

export function IntelPanel({ photos, startIndex }: { photos: IntelPhoto[]; startIndex: number }) {
  const { dossier, patch } = usePatch()
  const setActive = useDossier((s) => s.setActive)
  const saved = photos.filter((p) => dossier.intel.some((x) => x.id === p.id))
  return (
    <>
      <Group title="Carimbo das fotos" sub="Texto sobre as placas" hint="Vale para todas as placas de intel.">
        <label className={dossier.intelStamp.enabled ? 'chip on stamp-chip' : 'chip stamp-chip'}>
          <input
            type="checkbox"
            checked={dossier.intelStamp.enabled}
            onChange={() => patch((d) => void (d.intelStamp.enabled = !d.intelStamp.enabled))}
          />
          Carimbo nas fotos
        </label>
        <Field
          label="Texto do carimbo"
          edit="intel.stamp"
          hint="Vale para as placas que não tiverem um texto próprio."
          value={dossier.intelStamp.text}
          placeholder="FOTO INTEL"
          onChange={(text) => patch((d) => void (d.intelStamp.text = text))}
        />
      </Group>
      <Group title="Placas desta folha" sub="Imagem, legenda e fonte" hint="Quatro placas por folha. A quinta abre outra folha.">
        {saved.map((photo) => {
          const i = dossier.intel.findIndex((x) => x.id === photo.id)
          const n = i + 1
          return (
            <div key={photo.id} className="intel-edit" data-edit={`intel.${photo.id}`}>
              <p className="intel-edit-title">Placa B-{String(n).padStart(2, '0')}</p>
              <ImageField
                label="Imagem"
                src={photo.src}
                readFile={readIntelPhoto}
                onChange={(src) => patch((d) => void (d.intel[i].src = src))}
              />
              <Field
                label="Legenda"
                value={photo.caption}
                onChange={(caption) => patch((d) => void (d.intel[i].caption = caption))}
              />
              <Field
                label="Texto do carimbo desta placa"
                hint="Vazio usa o texto geral. O carimbo some se os dois estiverem vazios, ou se Carimbo nas fotos estiver desligado."
                value={photo.stamp ?? ''}
                placeholder={dossier.intelStamp.text || 'FOTO INTEL'}
                onChange={(stamp) => patch((d) => void (d.intel[i].stamp = stamp))}
              />
              <div className="row2">
                <Field
                  label="Grid"
                  value={photo.grid}
                  onChange={(grid) => patch((d) => void (d.intel[i].grid = grid))}
                />
                <Field
                  label="Fonte"
                  value={photo.source}
                  onChange={(source) => patch((d) => void (d.intel[i].source = source))}
                  placeholder="UAV / SAT / RECON / HUMINT"
                />
              </div>
              <Field
                label="DTG da imagem"
                value={photo.dtg}
                onChange={(dtg) => patch((d) => void (d.intel[i].dtg = dtg))}
              />
              <button type="button" className="btn-ghost" onClick={() => patch((d) => void d.intel.splice(i, 1))}>
                Remover placa
              </button>
            </div>
          )
        })}
        {!saved.length ? <p className="field-hint">Nenhuma placa salva nesta folha ainda.</p> : null}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            patch((d) => {
              d.intel.push({
                id: `intel-${crypto.randomUUID()}`,
                src: '',
                caption: '',
                grid: '',
                source: 'UAV',
                dtg: '',
              })
            })
            const total = useDossier.getState().dossier.intel.length
            const page = Math.floor((total - 1) / 4) + 1
            if (page !== Math.floor(startIndex / 4) + 1) setActive(`intel-${page}`)
          }}
        >
          + Placa de intel
        </button>
      </Group>
    </>
  )
}

export function BlankPanel({ blank }: { blank: BlankPage }) {
  const { patch } = usePatch()
  const setActive = useDossier((s) => s.setActive)
  const update = (recipe: (b: BlankPage) => void) =>
    patch((d) => {
      const page = d.blanks.find((b) => b.id === blank.id)
      if (page) recipe(page)
    })
  const edit = (key: string) => `blank.${blank.id}.${key}`
  return (
    <>
      <Group title="Página em branco" sub="Título, texto e pauta" hint="Só esta folha tem título livre. A ordem fica em Geral.">
        <Field label="Título" edit={edit('title')} value={blank.title} onChange={(title) => update((b) => void (b.title = title))} />
        <Field
          label="Linha menor"
          edit={edit('title')}
          value={blank.heading}
          onChange={(heading) => update((b) => void (b.heading = heading))}
        />
        <Field
          label="Texto"
          edit={edit('body')}
          hint="Pode ficar vazio. A folha continua no pacote."
          value={blank.body}
          multiline
          rows={4}
          onChange={(body) => update((b) => void (b.body = body))}
        />
        <label className={blank.lined ? 'chip on' : 'chip'}>
          <input type="checkbox" checked={blank.lined} onChange={() => update((b) => void (b.lined = !b.lined))} />
          Pautada
        </label>
      </Group>
      <div className="panel-actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            patch((d) => {
              d.blanks = d.blanks.filter((b) => b.id !== blank.id)
              d.stack = d.stack.filter((s) => !(s.kind === 'blank' && s.id === blank.id))
            })
            setActive('setup')
          }}
        >
          Remover página
        </button>
      </div>
    </>
  )
}
