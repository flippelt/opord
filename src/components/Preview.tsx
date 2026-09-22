import { Fragment, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { docTypeOf, styleOf } from '../lib/classification'
import { copyNumbers } from '../lib/copies'
import { chunk } from '../lib/dtg'
import { captureAll, downloadJson, fileBase, savePdf, savePngZip } from '../lib/export'
import { emptyHvtSlots, emptyIntelSlots } from '../defaults'
import { useDossier } from '../store'
import { AarPage } from './document/AarPage'
import { BlankSheet } from './document/BlankPage'
import { CasevacPage } from './document/CasevacPage'
import { CoverPage } from './document/CoverPage'
import { HvtPage } from './document/HvtPage'
import { IntelPage } from './document/IntelPage'
import { MapPage } from './document/MapPage'
import { NoticePage } from './document/NoticePage'
import { OpordBack, OpordFront } from './document/OpordPage'
import { OrbatPage } from './document/OrbatPage'
import { RadioPage } from './document/RadioPage'
import { RoePage } from './document/RoePage'
import { RosterPage } from './document/RosterPage'
import { SitrepPage } from './document/SitrepPage'
import { TimelinePage } from './document/TimelinePage'

export function Preview() {
  const dossier = useDossier((s) => s.dossier)
  const zoom = useDossier((s) => s.zoom)
  const setZoom = useDossier((s) => s.setZoom)
  const exporting = useDossier((s) => s.exporting)
  const setExporting = useDossier((s) => s.setExporting)
  const stack = useRef<HTMLDivElement>(null)
  const orientation = dossier.document.orientation === 'landscape' ? 'landscape' : 'portrait'

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
          data-orient={orientation}
          style={{ width: orientation === 'landscape' ? '297mm' : '210mm', transform: `scale(${zoom})` }}
        >
          {dossier.stack.map((item) => {
            if (item.kind === 'blank') {
              const blank = dossier.blanks.find((b) => b.id === item.id)
              return blank ? <BlankSheet key={blank.id} dossier={dossier} blank={blank} /> : null
            }
            if (!dossier.document.pages[item.kind]) return null
            if (item.kind === 'cover') return <CoverPage key="cover" dossier={dossier} />
            if (item.kind === 'notice') return <NoticePage key="notice" dossier={dossier} />
            if (item.kind === 'opord') {
              return (
                <Fragment key="opord">
                  <OpordFront dossier={dossier} />
                  <OpordBack dossier={dossier} />
                </Fragment>
              )
            }
            if (item.kind === 'timeline') return <TimelinePage key="timeline" dossier={dossier} />
            if (item.kind === 'radio') return <RadioPage key="radio" dossier={dossier} />
            if (item.kind === 'roe') return <RoePage key="roe" dossier={dossier} />
            if (item.kind === 'roster') return <RosterPage key="roster" dossier={dossier} />
            if (item.kind === 'sitrep') return <SitrepPage key="sitrep" dossier={dossier} />
            if (item.kind === 'aar') return <AarPage key="aar" dossier={dossier} />
            if (item.kind === 'orbat') return <OrbatPage key="orbat" dossier={dossier} />
            if (item.kind === 'hvt') {
              return (
                <Fragment key="hvt">
                  {(dossier.hvts.length ? dossier.hvts : emptyHvtSlots()).map((card, i) => (
                    <HvtPage key={card.id} dossier={dossier} card={card} index={i} />
                  ))}
                </Fragment>
              )
            }
            if (item.kind === 'casevac') return <CasevacPage key="casevac" dossier={dossier} />
            if (item.kind === 'map') return <MapPage key="map" dossier={dossier} />
            return (
              <Fragment key="intel">
                {chunk(dossier.intel.length ? dossier.intel : emptyIntelSlots(), 4).map((group, i) => (
                  <IntelPage key={group[0]?.id ?? i} dossier={dossier} photos={group} startIndex={i * 4} />
                ))}
              </Fragment>
            )
          })}
        </div>
      </div>

      {exporting ? <div className="export-veil">{exporting}</div> : null}
    </section>
  )
}
