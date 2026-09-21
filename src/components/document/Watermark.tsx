import { styleOf } from '../../lib/classification'
import type { Dossier, PageId } from '../../types'
import { RubberStamp } from './RubberStamp'

export function Marks({ dossier, page }: { dossier: Dossier; page: PageId }) {
  const style = styleOf(dossier.document.classification)
  const text = (dossier.marks.watermarkText || style.label).toUpperCase()
  const mode = dossier.marks.watermarkMode
  const copyLabel = `${dossier.document.copyNumber} / ${dossier.document.copyTotal}`
  const stamps = dossier.marks.stamps.filter(
    (s) => s.enabled && (s.page === 'all' || s.page === page),
  )
  const showDiagonal = mode === 'diagonal' || mode === 'both'
  const showCenter = mode === 'center' || mode === 'both'
  const showTiled = mode === 'tiled'

  return (
    <>
      {showTiled && (
        <div className="wm-tile" style={{ color: style.stamp }} aria-hidden>
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      )}
      {showDiagonal && (
        <div className="wm-word" style={{ color: style.stamp }} aria-hidden>
          {text}
        </div>
      )}
      {showCenter && (
        <div className="wm-center" style={{ color: style.stamp }} aria-hidden>
          <svg viewBox="0 0 280 200">
            <ellipse cx="140" cy="100" rx="132" ry="92" fill="none" stroke="currentColor" strokeWidth="7" />
            <ellipse cx="140" cy="100" rx="120" ry="80" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <text
              x="140"
              y="92"
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Oswald, sans-serif"
              fontSize={text.length > 12 ? 22 : 28}
              fontWeight="700"
              letterSpacing="3"
            >
              {text}
            </text>
            <text
              x="140"
              y="124"
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Oswald, sans-serif"
              fontSize="13"
              letterSpacing="4"
            >
              {style.nato}
            </text>
          </svg>
        </div>
      )}
      {stamps.map((stamp) => (
        <RubberStamp key={stamp.id} stamp={stamp} copyLabel={copyLabel} />
      ))}
    </>
  )
}
