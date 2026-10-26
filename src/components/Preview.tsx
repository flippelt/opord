import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { docTypeOf, styleOf } from '../lib/classification'
import { copyNumbers } from '../lib/copies'
import { captureAll, downloadJson, fileBase, savePdf, savePngZip } from '../lib/export'
import { SETUP_KEY, sheetList, stageKey } from '../lib/sheets'
import { newDossier } from '../defaults'
import { useDossier } from '../store'
import { OverviewZoom } from './OverviewZoom'
import { PageTabs } from './PageTabs'
import { PreviewModal } from './PreviewModal'
import { SheetStack } from './SheetStack'

const PIN_KEY = 'opord.overviewZoom.pinned'

/** Campos que só existem em Geral, mesmo aparecendo em todas as folhas. */
const GERAL_KEYS = ['clan.name', 'clan.motto', 'clan.seal', 'clan.patch', 'clan.colors', 'document.classification']

/** Abre os blocos do campo no menu e dá foco nele (ou abre o seletor de imagem). */
function openField(key: string): boolean {
  const holder = document.querySelector<HTMLElement>(`.desk [data-edit~="${CSS.escape(key)}"]`)
  if (!holder) return false
  for (let el = holder.closest('details'); el; el = el.parentElement?.closest('details') ?? null) el.open = true
  const file = holder.querySelector<HTMLInputElement>('input[type="file"]')
  if (file) file.click()
  else holder.querySelector<HTMLElement>('input, textarea, select, button')?.focus()
  return true
}

/** Realça no palco o que tem o mesmo `data-edit` do campo com foco. */
function focusRule(key: string) {
  if (!key) return ''
  const value = key.replace(/["\\]/g, '\\$&')
  return `.stage [data-edit~="${value}"] { outline: 2px solid #c9a227; outline-offset: 2px; background-color: rgba(201, 162, 39, 0.16); border-radius: 2px; }`
}

export function Preview({ collapsed, onExpand }: { collapsed: boolean; onExpand: () => void }) {
  const dossier = useDossier((s) => s.dossier)
  const zoom = useDossier((s) => s.zoom)
  const setZoom = useDossier((s) => s.setZoom)
  const overviewZoom = useDossier((s) => s.overviewZoom)
  const setOverviewZoom = useDossier((s) => s.setOverviewZoom)
  const exporting = useDossier((s) => s.exporting)
  const setExporting = useDossier((s) => s.setExporting)
  const active = useDossier((s) => s.active)
  const focus = useDossier((s) => s.focus)
  const previewOpen = useDossier((s) => s.previewOpen)
  const setPreviewOpen = useDossier((s) => s.setPreviewOpen)
  const setActive = useDossier((s) => s.setActive)
  const wizard = useDossier((s) => s.wizard)
  const draft = useMemo(
    () => (wizard?.step === 'pages' ? newDossier(wizard.type, wizard.pages, wizard.template) : null),
    [wizard],
  )
  const draftSheets = useMemo(() => (draft ? sheetList(draft) : []), [draft])
  const [showAll, setShowAll] = useState(false)
  const [zoomPinned, setZoomPinnedState] = useState(() => {
    try {
      return localStorage.getItem(PIN_KEY) === '1'
    } catch {
      return false
    }
  })
  function setZoomPinned(pinned: boolean) {
    setZoomPinnedState(pinned)
    try {
      localStorage.setItem(PIN_KEY, pinned ? '1' : '0')
    } catch {
      /* sem armazenamento: volta solto na próxima visita */
    }
  }
  const stack = useRef<HTMLDivElement>(null)
  const orientation = dossier.document.orientation === 'landscape' ? 'landscape' : 'portrait'
  const sheets = useMemo(() => sheetList(dossier), [dossier])
  const stage = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const observer = new ResizeObserver(() => setRoom(el.clientWidth - 48))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // A folha cabe na largura do palco: o zoom só escolhe até onde ela cresce.
  const sheetPx = (orientation === 'landscape' ? 297 : 210) * (96 / 25.4)
  const sheetTall = (orientation === 'landscape' ? 210 : 297) * (96 / 25.4)
  const scale = room > 0 ? Math.min(zoom, room / sheetPx) : zoom
  const onStage = stageKey(sheets, active)
  // Em Geral e no novo dossiê o palco mostra o pacote todo em miniatura.
  const overview = !showAll && (Boolean(wizard) || active === SETUP_KEY)

  useEffect(() => {
    if (!focus) return
    const el = stack.current?.querySelector(`.sheet:not(.is-off) [data-edit~="${CSS.escape(focus)}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focus, onStage])

  useEffect(() => {
    const id = 'opord-page-size'
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('style')
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = `@page { size: A4 ${orientation}; margin: 0; }`
  }, [orientation])
  const style = styleOf(dossier.document.classification)
  const kind = docTypeOf(dossier.document.type)
  const base = fileBase([kind.short, dossier.mission.name, style.label])

  async function captureCopies() {
    const numbers = copyNumbers(dossier.document.copyTotal, dossier.document.copyNumber)
    const original = dossier.document.copyNumber
    const pngs: string[] = []
    const names: string[] = []
    const patch = useDossier.getState().patch
    flushSync(() => setShowAll(true))
    try {
      for (const num of numbers) {
        flushSync(() => {
          patch((d) => {
            d.document.copyNumber = num
          })
        })
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
        const sheets = [...(stack.current?.querySelectorAll<HTMLElement>('.sheet') ?? [])]
        const shot = await captureAll(sheets)
        shot.forEach((png, i) => {
          pngs.push(png)
          const page = sheets[i]?.dataset.page ?? `pagina-${i + 1}`
          names.push(`${base}-copia-${num}-${page}.png`)
        })
      }
    } finally {
      flushSync(() => {
        patch((d) => {
          d.document.copyNumber = original
        })
        setShowAll(false)
      })
    }
    return { pngs, names }
  }

  async function withCopies(job: (pngs: string[], names: string[]) => Promise<void>, msg: string) {
    const sheets = stack.current?.querySelectorAll('.sheet')
    if (!sheets?.length) return
    setExporting(msg)
    try {
      const { pngs, names } = await captureCopies()
      await job(pngs, names)
    } finally {
      setExporting('')
    }
  }

  return (
    <section className="workspace">
      <div className="toolbar">
        {collapsed ? (
          <button type="button" className="btn-ghost" onClick={onExpand} title="Abrir o menu de edição">
            ▸ Menu
          </button>
        ) : null}
        <div className="toolbar-class" style={{ background: style.banner, color: style.ink }}>
          {style.label}
        </div>
        {overview ? null : (
          <label className="zoom">
            Zoom
            <input
              className="theme-range"
              type="range"
              min={0.45}
              max={1.05}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span className="zoom-value">{Math.round(scale * 100)}%</span>
          </label>
        )}
        <button
          type="button"
          className="btn"
          disabled={Boolean(wizard)}
          onClick={() =>
            void withCopies(async (pngs) => {
              await savePdf(pngs, `${base}.pdf`, orientation)
            }, 'Gerando PDF…')
          }
        >
          Exportar PDF
        </button>
        <button
          type="button"
          className="btn"
          disabled={Boolean(wizard)}
          onClick={() =>
            void withCopies(async (pngs, names) => {
              await savePngZip(pngs, `${base}-paginas.zip`, names)
            }, 'Gerando imagens…')
          }
        >
          Exportar PNG
        </button>
        <button type="button" className="btn-ghost" onClick={() => setPreviewOpen(true)}>
          Pré-visualizar
        </button>
        <button type="button" className="btn-ghost" onClick={() => window.print()}>
          Imprimir
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => downloadJson(dossier, `${base}.json`)}
        >
          JSON
        </button>
        <label className="btn-ghost file-btn">
          Importar JSON
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              void file.text().then((text) => {
                const parsed = JSON.parse(text)
                useDossier.getState().setWizard(null)
                useDossier.getState().setDossier(parsed)
              })
            }}
          />
        </label>
      </div>

      {wizard ? null : <PageTabs sheets={sheets} />}

      <div
        className="stage"
        ref={stage}
        onClick={(e) => {
          if (wizard) return
          const target = (e.target as HTMLElement).closest<HTMLElement>('[data-edit]')
          const key = target?.dataset.edit?.split(' ')[0]
          if (key && openField(key)) return
          if (key && GERAL_KEYS.includes(key) && active !== SETUP_KEY) {
            // O campo mora em Geral: vai para lá e abre o campo, ainda dentro do clique.
            flushSync(() => setActive(SETUP_KEY))
            openField(key)
            return
          }
          // Na miniatura, clicar fora de um campo de Geral abre a folha para editar.
          const page = (e.target as HTMLElement).closest<HTMLElement>('.overview-stack .sheet')?.dataset.page
          if (page) setActive(page)
        }}
      >
        <style>{showAll ? '' : focusRule(focus)}</style>
        {overview ? (
          <>
            {wizard?.step === 'type' || !zoomPinned ? null : (
              <OverviewZoom zoom={overviewZoom} onZoom={setOverviewZoom} pinned onPin={setZoomPinned} />
            )}
            <p className="stage-note">
              {wizard?.step === 'type'
                ? 'Escolha o tipo de documento no menu.'
                : wizard
                  ? 'Pacote do novo dossiê. Marque ou desmarque folhas no menu.'
                  : 'O pacote inteiro. Clique numa folha para editá-la, ou na faixa para mudar a classificação.'}
            </p>
            {wizard?.step === 'type' ? null : (
              <SheetStack
                dossier={draft ?? dossier}
                sheets={draft ? draftSheets : sheets}
                active={null}
                scope="ov-"
                className="preview-stack overview-stack"
                style={{ zoom: overviewZoom }}
              />
            )}
          </>
        ) : null}
        <div
          className={overview ? 'stage-fit is-hidden' : 'stage-fit'}
          style={{ width: sheetPx * scale, height: showAll ? undefined : sheetTall * scale }}
        >
          <SheetStack
            ref={stack}
            dossier={dossier}
            sheets={sheets}
            active={showAll ? null : onStage}
            style={{
              width: orientation === 'landscape' ? '297mm' : '210mm',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>

      {overview && !zoomPinned && wizard?.step !== 'type' ? (
        <OverviewZoom zoom={overviewZoom} onZoom={setOverviewZoom} pinned={false} onPin={setZoomPinned} />
      ) : null}
      {previewOpen ? <PreviewModal dossier={dossier} sheets={sheets} onClose={() => setPreviewOpen(false)} /> : null}
      {exporting ? <div className="export-veil">{exporting}</div> : null}
    </section>
  )
}
