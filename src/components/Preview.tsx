import { useRef } from 'react'
import { docTypeOf, styleOf } from '../lib/classification'
import { chunk } from '../lib/dtg'
import { captureAll, downloadJson, fileBase, savePdf, savePngZip } from '../lib/export'
import { emptyHvtSlots, emptyIntelSlots } from '../defaults'
import { useDossier } from '../store'
import { AarPage } from './document/AarPage'
import { CasevacPage } from './document/CasevacPage'
import { CoverPage } from './document/CoverPage'
import { HvtPage } from './document/HvtPage'
import { IntelPage } from './document/IntelPage'
import { NoticePage } from './document/NoticePage'
import { OpordBack, OpordFront } from './document/OpordPage'
import { OrbatPage } from './document/OrbatPage'
import { SitrepPage } from './document/SitrepPage'

export function Preview() {
  const dossier = useDossier((s) => s.dossier)
  const zoom = useDossier((s) => s.zoom)
  const setZoom = useDossier((s) => s.setZoom)
  const exporting = useDossier((s) => s.exporting)
  const setExporting = useDossier((s) => s.setExporting)
  const stack = useRef<HTMLDivElement>(null)
  const style = styleOf(dossier.document.classification)
  const kind = docTypeOf(dossier.document.type)
  const base = fileBase([kind.short, dossier.mission.name, style.label])

  async function withSheets(job: (sheets: HTMLElement[]) => Promise<void>, msg: string) {
    const sheets = [...(stack.current?.querySelectorAll<HTMLElement>('.sheet') ?? [])]
    if (!sheets.length) return
    setExporting(msg)
    try {
      await job(sheets)
    } finally {
      setExporting('')
    }
  }

  return (
    <section className="workspace">
      <div className="toolbar">
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
            void withSheets(async (sheets) => {
              const pngs = await captureAll(sheets)
              await savePdf(pngs, `${base}.pdf`)
            }, 'Gerando PDF…')
          }
        >
          Exportar PDF
        </button>
        <button
          type="button"
          className="btn"
          onClick={() =>
            void withSheets(async (sheets) => {
              const pngs = await captureAll(sheets)
              const names = sheets.map((el, i) => {
                const page = el.dataset.page ?? `pagina-${i + 1}`
                return `${base}-${page}.png`
              })
              await savePngZip(pngs, `${base}-paginas.zip`, names)
            }, 'Gerando imagens…')
          }
        >
          Exportar PNG
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

      <div className="stage">
        <div
          className="stage-inner"
          ref={stack}
          style={{ transform: `scale(${zoom})` }}
        >
          {dossier.document.pages.cover ? <CoverPage dossier={dossier} /> : null}
          {dossier.document.pages.notice ? <NoticePage dossier={dossier} /> : null}
          {dossier.document.pages.opord ? (
            <>
              <OpordFront dossier={dossier} />
              <OpordBack dossier={dossier} />
            </>
          ) : null}
          {dossier.document.pages.sitrep ? <SitrepPage dossier={dossier} /> : null}
          {dossier.document.pages.aar ? <AarPage dossier={dossier} /> : null}
          {dossier.document.pages.orbat ? <OrbatPage dossier={dossier} /> : null}
          {dossier.document.pages.hvt
            ? (dossier.hvts.length ? dossier.hvts : emptyHvtSlots()).map((card, i) => (
                <HvtPage key={card.id} dossier={dossier} card={card} index={i} />
              ))
            : null}
          {dossier.document.pages.casevac ? <CasevacPage dossier={dossier} /> : null}
          {dossier.document.pages.intel
            ? chunk(dossier.intel.length ? dossier.intel : emptyIntelSlots(), 4).map((group, i) => (
                <IntelPage key={group[0]?.id ?? i} dossier={dossier} photos={group} startIndex={i * 4} />
              ))
            : null}
        </div>
      </div>

      {exporting ? <div className="export-veil">{exporting}</div> : null}
    </section>
  )
}
