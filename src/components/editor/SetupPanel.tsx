import { CAVEAT_OPTIONS, CLASSIFICATIONS, docTypeOf, PAGE_LABELS, TYPE_DEFAULT_PAGES } from '../../lib/classification'
import { readClanMark } from '../../lib/image'
import { sheetList } from '../../lib/sheets'
import { applyTemplate, TEMPLATE_CHOICES } from '../../lib/templates'
import { defaultDossier, emptyMapPlate } from '../../defaults'
import { useDossier } from '../../store'
import type { Classification, PageId } from '../../types'
import { Field, ImageField, SelectField } from '../ImageField'
import { SheetOrder } from '../SheetOrder'
import { Group, usePatch } from './common'

/** Modelos prontos desligados até o conserto (2026-10-21). Volta com true. */
const TEMPLATES_ON = false

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
  const setWizard = useDossier((s) => s.setWizard)
  const pageIds = Object.keys(PAGE_LABELS) as PageId[]
  const pagesOn = pageIds.filter((id) => dossier.document.pages[id])
  const pagesOff = pageIds.filter((id) => !dossier.document.pages[id])

  return (
    <>
      {TEMPLATES_ON ? (
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
      ) : null}

      <Group
        title="Identidade do clã"
        sub="Nome, sigla, lema, logo e distintivo"
        hint="Tudo aqui se repete nas folhas: nome e sigla no cabeçalho, logo na capa e na assinatura, distintivo no canto. Clicar nessas partes de qualquer folha abre o campo."
      >
        <Field
          label="Nome da unidade / clã"
          edit="clan.name"
          value={dossier.clan.name}
          onChange={(name) => patch((d) => void (d.clan.name = name))}
          placeholder="Grupo de Operações…"
        />
        <Field
          label="Sigla"
          edit="clan.name"
          hint="Entra ao lado do nome, no selo e no patch sem imagem, e no REL TO."
          value={dossier.clan.shortName}
          onChange={(shortName) => patch((d) => void (d.clan.shortName = shortName))}
          placeholder="FALCÃO"
        />
        <Field
          label="Lema"
          edit="clan.motto"
          value={dossier.clan.motto}
          onChange={(motto) => patch((d) => void (d.clan.motto = motto))}
        />
        <ImageField
          label="Logo do clã"
          edit="clan.seal"
          hint="Capa, cabeçalho e assinatura."
          src={dossier.clan.sealSrc}
          readFile={readClanMark}
          onChange={(sealSrc) => patch((d) => void (d.clan.sealSrc = sealSrc))}
        />
        <ImageField
          label="Distintivo / patch"
          edit="clan.patch"
          hint="Canto direito do cabeçalho das folhas."
          src={dossier.clan.patchSrc}
          readFile={readClanMark}
          onChange={(patchSrc) => patch((d) => void (d.clan.patchSrc = patchSrc))}
        />
      </Group>

      <Group
        title="Classificação"
        sub="Grau e restrições"
        hint="O grau escolhe as cores das faixas e da capa. Vale para todas as folhas."
      >
        <p className="field-hint">
          Tipo: <strong>{docTypeOf(dossier.document.type).short}</strong> — {docTypeOf(dossier.document.type).label}.
          Para trocar o tipo, crie um novo dossiê.
        </p>
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
            hint="Vazio usa a sigla do clã e acompanha quando ela muda. Escreva só para liberar a outro grupo."
            value={dossier.document.relTo}
            placeholder={dossier.clan.shortName || 'FALCÃO'}
            onChange={(relTo) => patch((d) => void (d.document.relTo = relTo))}
          />
        ) : null}
      </Group>

      <Group title="Papel" sub="Sentido, idioma e furos">
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

      <Group
        title="Folhas do pacote"
        sub="Quais folhas entram e em que ordem"
        hint="Cada folha ligada vira uma página no seletor, na ordem de baixo. A miniatura ao lado mostra o pacote."
      >
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

      <div className="desk-foot">
        <button type="button" className="btn-ghost" onClick={() => setDossier(defaultDossier())}>
          Restaurar exemplo
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setWizard({ step: 'type', type: 'opord', pages: TYPE_DEFAULT_PAGES.opord })}
        >
          Novo dossiê
        </button>
      </div>
    </>
  )
}
