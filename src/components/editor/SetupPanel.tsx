import { useState } from 'react'
import { CAVEAT_OPTIONS, CLASSIFICATIONS, DOC_TYPES, PAGE_LABELS, TYPE_PAGE } from '../../lib/classification'
import { readClanMark } from '../../lib/image'
import { sheetList } from '../../lib/sheets'
import { STAMP_TERMS, stampTerm } from '../../lib/stamps'
import { applyTemplate, TEMPLATE_CHOICES } from '../../lib/templates'
import { blankDossier, defaultDossier, emptyMapPlate } from '../../defaults'
import { useDossier } from '../../store'
import type { Classification, DocType, PageId, WatermarkColorMode, WatermarkFigure, WatermarkMode } from '../../types'
import { Field, ImageField, SelectField } from '../ImageField'
import { SheetOrder } from '../SheetOrder'
import { Group, usePatch } from './common'

const STAMP_CHOICES = [
  ...STAMP_TERMS.map((id) => ({ id, label: id })),
  { id: 'custom', label: 'Outro texto' },
]

function StampTerm({ title, onChange }: { title: string; onChange: (title: string) => void }) {
  const [custom, setCustom] = useState(false)
  const known = stampTerm(title)
  const choice = custom || known === 'custom' ? 'custom' : known
  return (
    <SelectField
      label="Termo em inglês"
      value={choice}
      onChange={(next) => {
        if (next === 'custom') {
          setCustom(true)
          return
        }
        setCustom(false)
        onChange(next)
      }}
      options={STAMP_CHOICES}
    />
  )
}

/** Vai para a primeira folha de um tipo, depois que ela entrou no pacote. */
function goToFirst(kind: PageId) {
  const { dossier, setActive } = useDossier.getState()
  const sheet = sheetList(dossier).find((s) => s.kind === kind)
  if (sheet) setActive(sheet.key)
}

export function SetupPanel() {
  const { dossier, patch } = usePatch()
  const setDossier = useDossier((s) => s.setDossier)
  const setActive = useDossier((s) => s.setActive)
  const pageIds = Object.keys(PAGE_LABELS) as PageId[]
  const pagesOn = pageIds.filter((id) => dossier.document.pages[id])
  const pagesOff = pageIds.filter((id) => !dossier.document.pages[id])

  return (
    <>
      <Group
        title="Modelo pronto"
        hint="O modelo preenche a missão e liga as folhas daquele tipo. Depois o editor segue folha por folha. O logo do clã fica."
      >
        <div className="chips">
          {TEMPLATE_CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="chip"
              onClick={() => {
                patch((d) => applyTemplate(d, choice.id))
                setActive('cover')
              }}
            >
              {dossier.document.language === 'en' ? choice.en : choice.pt}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Documento" hint="Tipo e classificação valem para todas as folhas.">
        <SelectField
          label="Tipo"
          value={dossier.document.type}
          onChange={(type: DocType) =>
            patch((d) => {
              d.document.type = type
              const page = TYPE_PAGE[type]
              if (page) d.document.pages[page] = true
            })
          }
          options={DOC_TYPES.map((t) => ({ id: t.id, label: `${t.short} — ${t.label}` }))}
        />
        <SelectField
          label="Classificação"
          edit="document.classification"
          value={dossier.document.classification}
          onChange={(classification: Classification) =>
            patch((d) => void (d.document.classification = classification))
          }
          options={CLASSIFICATIONS.map((c) => ({
            id: c.id,
            label: `${c.label} (${c.nato})`,
          }))}
        />
        <fieldset className="chips" data-edit="document.classification">
          <legend>Restrições / caveats</legend>
          {CAVEAT_OPTIONS.map((c) => {
            const on = dossier.document.caveats.includes(c)
            return (
              <label key={c} className={on ? 'chip on' : 'chip'}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    patch((d) => {
                      d.document.caveats = on
                        ? d.document.caveats.filter((x) => x !== c)
                        : [...d.document.caveats, c]
                    })
                  }
                />
                {c}
              </label>
            )
          })}
          <label className={dossier.document.relToOn ? 'chip on' : 'chip'}>
            <input
              type="checkbox"
              checked={dossier.document.relToOn}
              onChange={() =>
                patch((d) => {
                  d.document.relToOn = !d.document.relToOn
                  if (d.document.relToOn && !d.document.relTo.trim()) d.document.relTo = d.clan.shortName
                })
              }
            />
            REL TO
          </label>
        </fieldset>
        {dossier.document.relToOn ? (
          <Field
            label="REL TO"
            edit="document.classification"
            hint="Entra na faixa depois das outras restrições. O padrão é a sigla do clã."
            value={dossier.document.relTo}
            placeholder={dossier.clan.shortName || 'FALCÃO'}
            onChange={(relTo) => patch((d) => void (d.document.relTo = relTo))}
          />
        ) : null}
      </Group>

      <Group title="Papel">
        <div className="row2">
          <SelectField
            label="Sentido"
            value={dossier.document.orientation}
            onChange={(orientation: 'portrait' | 'landscape') =>
              patch((d) => void (d.document.orientation = orientation))
            }
            options={[
              { id: 'portrait', label: 'Retrato' },
              { id: 'landscape', label: 'Paisagem' },
            ]}
          />
          <SelectField
            label="Idioma do papel"
            value={dossier.document.language}
            onChange={(language: 'pt' | 'en') => patch((d) => void (d.document.language = language))}
            options={[
              { id: 'pt', label: 'Português' },
              { id: 'en', label: 'English' },
            ]}
          />
        </div>
        <label className={dossier.document.binding ? 'chip on' : 'chip'}>
          <input
            type="checkbox"
            checked={dossier.document.binding}
            onChange={() => patch((d) => void (d.document.binding = !d.document.binding))}
          />
          Furos na folha
        </label>
      </Group>

      <Group title="Folhas do pacote" hint="Cada folha ligada vira uma página no seletor, na ordem de baixo.">
        <fieldset className="chips">
          <legend>No pacote</legend>
          {pagesOn.map((p) => (
            <button
              key={p}
              type="button"
              className="chip on"
              onClick={() => patch((d) => void (d.document.pages[p] = false))}
            >
              {PAGE_LABELS[p]} · tirar
            </button>
          ))}
        </fieldset>
        <fieldset className="chips">
          <legend>Adicionar folha</legend>
          {pagesOff.map((p) => (
            <button
              key={p}
              type="button"
              className="chip"
              onClick={() => {
                patch((d) => {
                  d.document.pages[p] = true
                  if (p === 'map' && d.maps.length === 0) d.maps.push(emptyMapPlate('MAPA'))
                })
                goToFirst(p)
              }}
            >
              + {PAGE_LABELS[p]}
            </button>
          ))}
        </fieldset>
        <SheetOrder />
      </Group>

      <Group title="Marca d’água" hint="Vale para todas as folhas.">
        <SelectField
          label="Marca d’água"
          edit="marks.watermark"
          value={dossier.marks.watermarkMode}
          onChange={(watermarkMode: WatermarkMode) =>
            patch((d) => void (d.marks.watermarkMode = watermarkMode))
          }
          options={[
            { id: 'none', label: 'Nenhuma' },
            { id: 'diagonal', label: 'Texto grande na diagonal' },
            { id: 'tiled', label: 'Mosaico repetido' },
          ]}
        />
        <Field
          label="Texto da marca d’água"
          edit="marks.watermark"
          hint="Vazio = usa a classificação (CONFIDENCIAL, SECRETO…)"
          value={dossier.marks.watermarkText}
          onChange={(watermarkText) => patch((d) => void (d.marks.watermarkText = watermarkText))}
        />
        <SelectField
          label="Figura por baixo"
          edit="marks.watermark"
          value={dossier.marks.watermarkFigure}
          onChange={(watermarkFigure: WatermarkFigure) =>
            patch((d) => void (d.marks.watermarkFigure = watermarkFigure))
          }
          options={[
            { id: 'none', label: 'Nenhuma' },
            { id: 'logo', label: 'Logo do clã' },
            { id: 'image', label: 'Outra imagem' },
          ]}
        />
        {dossier.marks.watermarkFigure === 'logo' && !dossier.clan.sealSrc ? (
          <p className="field-hint">Sobe o logo do clã na capa para ele aparecer aqui.</p>
        ) : null}
        {dossier.marks.watermarkFigure === 'image' ? (
          <ImageField
            label="Imagem da marca d’água"
            edit="marks.watermark"
            hint="Fica grande e clara, no meio da folha. Não troca o logo do cabeçalho."
            src={dossier.marks.watermarkImageSrc}
            readFile={readClanMark}
            onChange={(watermarkImageSrc) =>
              patch((d) => void (d.marks.watermarkImageSrc = watermarkImageSrc))
            }
          />
        ) : null}
        <label className={dossier.marks.watermarkTextOnTop ? 'chip on stamp-chip' : 'chip stamp-chip'}>
          <input
            type="checkbox"
            checked={dossier.marks.watermarkTextOnTop}
            onChange={() =>
              patch((d) => void (d.marks.watermarkTextOnTop = !d.marks.watermarkTextOnTop))
            }
          />
          Texto confidencial por cima
        </label>
        <SelectField
          label="Cor do texto"
          edit="marks.watermark"
          value={dossier.marks.watermarkColorMode}
          onChange={(watermarkColorMode: WatermarkColorMode) =>
            patch((d) => void (d.marks.watermarkColorMode = watermarkColorMode))
          }
          options={[
            { id: 'classification', label: 'Cor da classificação' },
            { id: 'custom', label: 'Cor escolhida' },
          ]}
        />
        {dossier.marks.watermarkColorMode === 'custom' ? (
          <label className="field" data-edit="marks.watermark">
            <span className="field-label">Cor</span>
            <span className="color-row">
              <input
                type="color"
                value={
                  /^#[0-9a-fA-F]{6}$/.test(dossier.marks.watermarkColor)
                    ? dossier.marks.watermarkColor
                    : '#c9a227'
                }
                onChange={(e) => patch((d) => void (d.marks.watermarkColor = e.target.value))}
              />
              {['#c9a227', '#14532d', '#1a1714', '#b42318', '#1e3a8a'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className="color-swatch"
                  style={{ background: color }}
                  aria-label={color}
                  onClick={() => patch((d) => void (d.marks.watermarkColor = color))}
                />
              ))}
            </span>
          </label>
        ) : null}
      </Group>

      <Group
        title="Carimbos"
        hint="O seletor grava o termo em inglês no carimbo. CLASSIFIED, CONFIDENTIAL, SECRET, TOP SECRET, UNCLASSIFIED e RESTRICTED. Outro texto aceita qualquer palavra."
      >
        {dossier.marks.stamps.map((stamp, i) => (
          <div key={stamp.id} className="intel-edit" data-edit={`marks.stamp.${stamp.id}`}>
            <label className={stamp.enabled ? 'chip on stamp-chip' : 'chip stamp-chip'}>
              <input
                type="checkbox"
                checked={stamp.enabled}
                onChange={() =>
                  patch((d) => {
                    const s = d.marks.stamps.find((x) => x.id === stamp.id)
                    if (s) s.enabled = !s.enabled
                  })
                }
              />
              {stamp.title || 'Carimbo'}
              <small>{stamp.page === 'all' ? 'todas' : PAGE_LABELS[stamp.page]}</small>
            </label>
            <div className="row2">
              <StampTerm
                title={stamp.title}
                onChange={(title) => patch((d) => void (d.marks.stamps[i].title = title))}
              />
              <Field
                label="Texto do carimbo"
                value={stamp.title}
                onChange={(title) => patch((d) => void (d.marks.stamps[i].title = title))}
              />
            </div>
            {stamp.id === 'copy' ? (
              <p className="field-hint">A linha de baixo deste carimbo é o número da via.</p>
            ) : (
              <Field
                label="Linha de baixo"
                value={stamp.subtitle}
                placeholder="CLASSIFIED"
                onChange={(subtitle) => patch((d) => void (d.marks.stamps[i].subtitle = subtitle))}
              />
            )}
          </div>
        ))}
      </Group>

      <div className="desk-foot">
        <button type="button" className="btn-ghost" onClick={() => setDossier(defaultDossier())}>
          Restaurar exemplo
        </button>
        <button type="button" className="btn-ghost" onClick={() => setDossier(blankDossier())}>
          Novo dossiê
        </button>
      </div>
    </>
  )
}
