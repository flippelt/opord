import { docTypeOf, DOC_TYPE_GROUPS, PAGE_LABELS, TYPE_DEFAULT_PAGES, TYPE_PAGE } from '../../lib/classification'
import { STACK_ORDER } from '../../lib/stack'
import { newDossier } from '../../defaults'
import { useDossier } from '../../store'
import type { PageId } from '../../types'

/** Novo dossiê em dois passos: o tipo, depois as folhas. Só grava ao criar. */
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
                    onClick={() => setWizard({ step: 'pages', type, pages: TYPE_DEFAULT_PAGES[type] })}
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
              setDossier(newDossier(wizard.type, wizard.pages))
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
