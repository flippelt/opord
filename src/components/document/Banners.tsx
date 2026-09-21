import { classificationLine, styleOf } from '../../lib/classification'
import type { Dossier } from '../../types'

export function ClassificationBanner({ dossier, position }: { dossier: Dossier; position: 'top' | 'bottom' }) {
  const s = styleOf(dossier.document.classification)
  return (
    <div
      className={`class-banner class-banner-${position}`}
      style={{ background: s.banner, color: s.ink }}
    >
      <span className="class-banner-mark">■</span>
      <span className="class-banner-text">{classificationLine(dossier)}</span>
      <span className="class-banner-mark">■</span>
    </div>
  )
}

export function PaperGrain({ id }: { id: string }) {
  return (
    <svg className="paper-grain" aria-hidden>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  )
}
