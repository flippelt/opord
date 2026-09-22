import { styleOf } from '../../lib/classification'
import { showDiagonalText, watermarkFigureSrc, watermarkInk } from '../../lib/watermark'
import type { Dossier, PageId } from '../../types'
import { RubberStamp } from './RubberStamp'

export function Marks({ dossier, page }: { dossier: Dossier; page: PageId | 'blank' }) {
  const style = styleOf(dossier.document.classification)
  const text = (dossier.marks.watermarkText || style.label).toUpperCase()
  const mode = dossier.marks.watermarkMode
  const copyLabel = `${dossier.document.copyNumber} / ${dossier.document.copyTotal}`
  const ink = watermarkInk(dossier.marks.watermarkColorMode, dossier.marks.watermarkColor, style.stamp)
  const figure = watermarkFigureSrc(
    dossier.marks.watermarkFigure,
    dossier.clan.sealSrc,
    dossier.marks.watermarkImageSrc,
  )
  const stamps = dossier.marks.stamps.filter(
    (s) => s.enabled && (s.page === 'all' || s.page === page),
  )

  return (
    <>
      {figure ? <img className="wm-figure" src={figure} alt="" /> : null}
      {mode === 'tiled' && (
        <div className="wm-tile" style={{ color: ink }} aria-hidden>
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      )}
      {showDiagonalText(mode, dossier.marks.watermarkTextOnTop) && (
        <div className="wm-word" style={{ color: ink }} aria-hidden>
          {text}
        </div>
      )}
      {stamps.map((stamp) => (
        <RubberStamp key={stamp.id} stamp={stamp} copyLabel={copyLabel} />
      ))}
    </>
  )
}
