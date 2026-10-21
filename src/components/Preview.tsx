import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { docTypeOf, styleOf } from '../lib/classification'
import { copyNumbers } from '../lib/copies'
import { captureAll, downloadJson, fileBase, savePdf, savePngZip } from '../lib/export'
import { SETUP_KEY, sheetList, stageKey } from '../lib/sheets'
import { useDossier } from '../store'
import { PageTabs } from './PageTabs'
import { PreviewModal } from './PreviewModal'
import { SheetStack } from './SheetStack'

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
  const exporting = useDossier((s) => s.exporting)
  const setExporting = useDossier((s) => s.setExporting)
  const active = useDossier((s) => s.active)
  const focus = useDossier((s) => s.focus)
  const previewOpen = useDossier((s) => s.previewOpen)
  const setPreviewOpen = useDossier((s) => s.setPreviewOpen)
  const [showAll, setShowAll] = useState(false)
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
        <label className="zoom">
          Zoom
          <input
            type="range"
            min={0.45}
            max={1.05}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
        <button
          type="button"
          className="btn"
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
                useDossier.getState().setDossier(parsed)
              })
            }}
          />
        </label>
      </div>

      <PageTabs sheets={sheets} />

      <div
        className="stage"
        ref={stage}
        onClick={(e) => {
          const target = (e.target as HTMLElement).closest<HTMLElement>('[data-edit]')
          const key = target?.dataset.edit?.split(' ')[0]
          if (!key) return
          const holder = document.querySelector<HTMLElement>(`.desk [data-edit~="${CSS.escape(key)}"]`)
          if (!holder) return
          // O bloco começa fechado: abre os que guardam o campo antes de dar foco.
          for (let el = holder.closest('details'); el; el = el.parentElement?.closest('details') ?? null) el.open = true
          // Num campo de imagem, clicar no papel já abre o seletor de arquivo.
          const file = holder.querySelector<HTMLInputElement>('input[type="file"]')
          if (file) file.click()
          else holder.querySelector<HTMLElement>('input, textarea, select, button')?.focus()
        }}
      >
        <style>{showAll ? '' : focusRule(focus)}</style>
        {active === SETUP_KEY ? (
          <p className="stage-note">Configuração do documento. A capa mostra o resultado.</p>
        ) : null}
        <div
          className="stage-fit"
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

      {previewOpen ? <PreviewModal dossier={dossier} sheets={sheets} onClose={() => setPreviewOpen(false)} /> : null}
      {exporting ? <div className="export-veil">{exporting}</div> : null}
    </section>
  )
}
