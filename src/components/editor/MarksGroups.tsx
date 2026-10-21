import { useState } from 'react'
import { PAGE_LABELS } from '../../lib/classification'
import { readClanMark } from '../../lib/image'
import { STAMP_TERMS, stampTerm } from '../../lib/stamps'
import type { WatermarkColorMode, WatermarkFigure, WatermarkMode } from '../../types'
import { Field, ImageField, SelectField } from '../ImageField'
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

/** Marca d'água: vale para todas as folhas. */
export function WatermarkGroup() {
  const { dossier, patch } = usePatch()
  return (
      <Group title="Marca d’água" sub="Fundo das folhas" hint="Vale para todas as folhas.">
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
          <p className="field-hint">Suba o logo do clã em Geral para ele aparecer aqui.</p>
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
  )
}

/** Carimbos: cada um sai na folha marcada nele (ou em todas). */
export function StampsGroup() {
  const { dossier, patch } = usePatch()
  return (
      <Group
        title="Carimbos"
        sub="Quais carimbos e textos"
        hint="Marque um carimbo para ligá-lo e editar o texto. Desmarcado, ele some da folha. O seletor grava o termo em inglês no carimbo. CLASSIFIED, CONFIDENTIAL, SECRET, TOP SECRET, UNCLASSIFIED e RESTRICTED. Outro texto aceita qualquer palavra."
      >
        {dossier.marks.stamps.map((stamp, i) => (
          <div
            key={stamp.id}
            className={stamp.enabled ? 'stamp-edit is-on' : 'stamp-edit'}
            data-edit={`marks.stamp.${stamp.id}`}
          >
            <label className="stamp-toggle">
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
              <span className="stamp-toggle-name">{stamp.title || 'Carimbo'}</span>
              <small>{stamp.page === 'all' ? 'todas as folhas' : PAGE_LABELS[stamp.page]}</small>
            </label>
            {stamp.enabled ? (
              <div className="stamp-body">
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
            ) : null}
          </div>
        ))}
      </Group>
  )
}
