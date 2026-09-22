import { styleOf } from '../../lib/classification'
import type { Dossier, PageId } from '../../types'
import { RubberStamp } from './RubberStamp'

export function Marks({ dossier, page }: { dossier: Dossier; page: PageId | 'blank' }) {
  const style = styleOf(dossier.document.classification)
  const text = (dossier.marks.watermarkText || style.label).toUpperCase()
  const mode = dossier.marks.watermarkMode
  const copyLabel = `${dossier.document.copyNumber} / ${dossier.document.copyTotal}`
  const stamps = dossier.marks.stamps.filter(
    (s) => s.enabled && (s.page === 'all' || s.page === page),
  )

  return (
    <>
      {mode === 'tiled' && (
        <div className="wm-tile" style={{ color: style.stamp }} aria-hidden>
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      )}
      {mode === 'diagonal' && (
        <div className="wm-word" style={{ color: style.stamp }} aria-hidden>
          {text}
        </div>
      )}
      {stamps.map((stamp) => (
        <RubberStamp key={stamp.id} stamp={stamp} copyLabel={copyLabel} />
      ))}
    </>
  )
}
