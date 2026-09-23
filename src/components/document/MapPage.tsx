import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier, MapPlate } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function MapPage({ dossier, plate }: { dossier: Dossier; plate: MapPlate }) {
  const cols = Math.min(24, Math.max(1, plate.cols || 1))
  const rows = Math.min(24, Math.max(1, plate.rows || 1))
  const fallback = dossier.document.language === 'en' ? 'MAP' : 'MAPA'
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
        <div className="map-board">
          {plate.src ? (
            <img src={plate.src} alt="" />
          ) : (
            <div className="map-empty">{dossier.document.language === 'en' ? 'NO MAP' : 'SEM MAPA'}</div>
          )}
          {plate.grid ? (
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
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
