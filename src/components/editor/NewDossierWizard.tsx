import { docTypeOf, DOC_TYPE_GROUPS, PAGE_LABELS, TYPE_DEFAULT_PAGES, TYPE_PAGE } from '../../lib/classification'
import { STACK_ORDER } from '../../lib/stack'
import { TEMPLATE_CHOICES, templatePages } from '../../lib/templates'
import { newDossier } from '../../defaults'
import { useDossier } from '../../store'
import type { PageId } from '../../types'

const ORDER_TYPES = ['opord', 'frago', 'warnord', 'conops']

/** Novo dossiê em dois passos: o tipo, depois as folhas (e, nas ordens, um modelo de missão). Só grava ao criar. */
export function NewDossierWizard() {
  const wizard = useDossier((s) => s.wizard)
  const setWizard = useDossier((s) => s.setWizard)
  const setDossier = useDossier((s) => s.setDossier)
  const setActive = useDossier((s) => s.setActive)
  if (!wizard) return null

  const kind = docTypeOf(wizard.type)
  const main = TYPE_PAGE[wizard.type]
  const defaults = TYPE_DEFAULT_PAGES[wizard.type]
  const others = STACK_ORDER.filter((page) => !defaults.includes(page))

  function toggle(page: PageId) {
    if (!wizard || page === main) return
    const on = wizard.pages.includes(page)
    setWizard({ ...wizard, pages: on ? wizard.pages.filter((p) => p !== page) : [...wizard.pages, page] })
  }

  function pageCheck(page: PageId) {
    const locked = page === main
    const on = locked || Boolean(wizard?.pages.includes(page))
    return (
      <label key={page} className={on ? 'page-check on' : 'page-check'}>
        <input type="checkbox" checked={on} disabled={locked} onChange={() => toggle(page)} />
        <span>{PAGE_LABELS[page]}</span>
        {locked ? <small>folha do tipo</small> : null}
      </label>
    )
  }

  return (
    <div className="wizard">
      <div className="desk-step">
        <p className="desk-kicker">Novo dossiê · passo {wizard.step === 'type' ? 1 : 2} de 2</p>
        <h2>{wizard.step === 'type' ? 'Tipo de documento' : 'Folhas do pacote'}</h2>
        <p className="field-hint">
          {wizard.step === 'type'
            ? 'O tipo define a capa e as folhas que vêm marcadas. Depois dá para pôr ou tirar folhas em Geral.'
            : `${kind.short} — ${kind.label}. Marque as folhas que entram. A miniatura ao lado mostra o pacote.`}
        </p>
      </div>

      {wizard.step === 'type' ? (
        DOC_TYPE_GROUPS.map((group) => (
          <section key={group.label} className="wizard-group">
            <h3>{group.label}</h3>
            <div className="type-grid">
              {group.types.map((type) => {
                const t = docTypeOf(type)
                return (
                  <button
                    key={type}
                    type="button"
                    className={type === wizard.type ? 'type-card on' : 'type-card'}
                    onClick={() => setWizard({ step: 'pages', type, pages: TYPE_DEFAULT_PAGES[type], template: undefined })}
                  >
                    <strong>{t.short}</strong>
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>
          </section>
        ))
      ) : (
        <>
          {ORDER_TYPES.includes(wizard.type) ? (
            <section className="wizard-group">
              <h3>Modelo de missão (opcional)</h3>
              <p className="field-hint">
                O modelo marca as folhas daquele tipo de missão e já escreve um roteiro na ordem: assunto, situação,
                intenção, execução e os marcos da linha do tempo. Você troca o texto depois.
              </p>
              <div className="chips">
                <button
                  type="button"
                  className={wizard.template ? 'chip' : 'chip on'}
                  onClick={() => setWizard({ ...wizard, template: undefined, pages: TYPE_DEFAULT_PAGES[wizard.type] })}
                >
                  Nenhum
                </button>
                {TEMPLATE_CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className={wizard.template === choice.id ? 'chip on' : 'chip'}
                    onClick={() => setWizard({ ...wizard, template: choice.id, pages: templatePages(choice.id) })}
                  >
                    {choice.pt}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
          <section className="wizard-group">
            <h3>Padrão do tipo</h3>
            {defaults.map(pageCheck)}
          </section>
          <section className="wizard-group">
            <h3>Outras folhas</h3>
            {others.map(pageCheck)}
          </section>
        </>
      )}

      <nav className="desk-nav" aria-label="Novo dossiê">
        {wizard.step === 'type' ? (
          <button type="button" className="btn-ghost" onClick={() => setWizard(null)}>
            Cancelar
          </button>
        ) : (
          <button type="button" className="btn-ghost" onClick={() => setWizard({ ...wizard, step: 'type' })}>
            ← Tipo
          </button>
        )}
        {wizard.step === 'pages' ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setDossier(newDossier(wizard.type, wizard.pages, wizard.template))
              setWizard(null)
              setActive('setup')
            }}
          >
            Criar dossiê →
          </button>
        ) : null}
      </nav>
    </div>
  )
}
