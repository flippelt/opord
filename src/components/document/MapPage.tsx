import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function MapPage({ dossier }: { dossier: Dossier }) {
  const cols = Math.min(24, Math.max(1, dossier.map.cols || 1))
  const rows = Math.min(24, Math.max(1, dossier.map.rows || 1))
  return (
    <Sheet page="map" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="map" />
      <div className="notice-body map-body">
        <DocumentChrome
          dossier={dossier}
          title={sheetTitle(dossier.titles, 'map', dossier.document.language === 'en' ? 'MAP' : 'MAPA')}
          subtitle={dossier.map.caption || dossier.header.mapSheet || dossier.mission.ao || ''}
        />
        <div className="map-board">
          {dossier.map.src ? (
            <img src={dossier.map.src} alt="" />
          ) : (
            <div className="map-empty">{dossier.document.language === 'en' ? 'NO MAP' : 'SEM MAPA'}</div>
          )}
          {dossier.map.grid ? (
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
