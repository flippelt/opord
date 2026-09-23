import { classificationLine } from '../../lib/classification'
import { captionText, notesFor } from '../../lib/mapPlate'
import { sheetTitle } from '../../lib/stack'
import type { Dossier, MapPlate } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

function mapLabels(language: Dossier['document']['language']) {
  if (language === 'en') {
    return { chart: 'Zoom', photo: 'Drone', emptyChart: 'NO ZOOM', emptyPhoto: 'NO DRONE' }
  }
  return { chart: 'Zoom', photo: 'Drone', emptyChart: 'SEM ZOOM', emptyPhoto: 'SEM DRONE' }
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
  const slide = plate.fullPage && dossier.document.orientation === 'landscape'
  const single = plate.images === 'one' || slide
  const photoOnly = plate.images === 'one' && plate.focus === 'photo'
  const showChart = !photoOnly
  const showPhoto = plate.images === 'one' ? plate.focus === 'photo' : !slide
  const chartCaption = captionText(plate.chartLabel, labels.chart)
  const photoCaption = captionText(plate.photoLabel, labels.photo)
  const notes = notesFor(plate, dossier.document.language)
  const pictures = (
    <div className={single ? 'map-pair map-one' : 'map-pair'}>
      {showChart ? (
        <figure>
          <MapFrame
            src={plate.src}
            empty={labels.emptyChart}
            cols={cols}
            rows={rows}
            showGrid={plate.grid}
          />
          {slide ? null : <figcaption>{chartCaption}</figcaption>}
        </figure>
      ) : null}
      {showPhoto ? (
        <figure>
          <MapFrame src={plate.photoSrc} empty={labels.emptyPhoto} cols={cols} rows={rows} showGrid={false} />
          {slide ? null : <figcaption>{photoCaption}</figcaption>}
        </figure>
      ) : null}
    </div>
  )

  return (
    <Sheet page="map" exportId={`map-${plate.id}`} paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="map" />
      <div className={slide ? 'notice-body map-body map-slide-page' : 'notice-body map-body'}>
        <DocumentChrome
          dossier={dossier}
          title={plate.title.trim() || sheetTitle(dossier.titles, 'map', fallback)}
          subtitle={plate.caption || ''}
        />
        {slide ? <div className="map-slide-fit">{pictures}</div> : pictures}
        {!slide && notes.length ? (
          <div className="map-notes">
            {notes.map(([label, text]) => (
              <section key={label}>
                <h2>{label}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
        ) : null}
        {slide ? null : <p className="op-foot-class">{classificationLine(dossier)}</p>}
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
