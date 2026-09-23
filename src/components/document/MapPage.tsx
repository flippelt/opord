import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier, MapPlate } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function mapLabels(language: Dossier['document']['language']) {
  if (language === 'en') {
    return {
      chart: 'Zoom',
      photo: 'Drone',
      emptyChart: 'NO ZOOM',
      emptyPhoto: 'NO DRONE',
      grid: 'Grid',
      azimuth: 'Azimuth after landing',
      references: 'Reference points',
      observations: 'Area notes',
    }
  }
  return {
    chart: 'Zoom',
    photo: 'Drone',
    emptyChart: 'SEM ZOOM',
    emptyPhoto: 'SEM DRONE',
    grid: 'Localização no grid',
    azimuth: 'Azimute após o desembarque',
    references: 'Pontos de referência',
    observations: 'Observações da região',
  }
}

function MapFrame({
  src,
  empty,
  cols,
  rows,
  showGrid,
}: {
  src: string
  empty: string
  cols: number
  rows: number
  showGrid: boolean
}) {
  return (
    <div className="map-board">
      {src ? <img src={src} alt="" /> : <div className="map-empty">{empty}</div>}
      {showGrid && src ? (
        <div
          className="map-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
          aria-hidden
        >
          {Array.from({ length: cols * rows }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function MapPage({ dossier, plate }: { dossier: Dossier; plate: MapPlate }) {
  const cols = Math.min(24, Math.max(1, plate.cols || 1))
  const rows = Math.min(24, Math.max(1, plate.rows || 1))
  const fallback = dossier.document.language === 'en' ? 'MAP' : 'MAPA'
  const labels = mapLabels(dossier.document.language)
  const notes = (
    [
      [labels.grid, plate.location],
      [labels.azimuth, plate.azimuth],
      [labels.references, plate.references],
      [labels.observations, plate.observations],
    ] as const
  ).filter(([, text]) => text.trim())
  return (
    <Sheet page="map" exportId={`map-${plate.id}`} paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="map" />
      <div className="notice-body map-body">
        <DocumentChrome
          dossier={dossier}
          title={plate.title.trim() || sheetTitle(dossier.titles, 'map', fallback)}
          subtitle={plate.caption || ''}
        />
        <div className="map-pair">
          <figure>
            <MapFrame
              src={plate.src}
              empty={labels.emptyChart}
              cols={cols}
              rows={rows}
              showGrid={plate.grid}
            />
            <figcaption>{labels.chart}</figcaption>
          </figure>
          <figure>
            <MapFrame src={plate.photoSrc} empty={labels.emptyPhoto} cols={cols} rows={rows} showGrid={false} />
            <figcaption>{labels.photo}</figcaption>
          </figure>
        </div>
        {notes.length ? (
          <div className="map-notes">
            {notes.map(([label, text]) => (
              <section key={label}>
                <h2>{label}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
        ) : null}
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
