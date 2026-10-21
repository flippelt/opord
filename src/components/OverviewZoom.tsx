const MIN = 0.2
const MAX = 1
const step = (value: number) => Math.min(MAX, Math.max(MIN, Math.round(value * 100) / 100))

/** Tamanho das miniaturas do Geral. Solto no canto inferior direito ou preso no topo do palco. */
export function OverviewZoom({
  zoom,
  onZoom,
  pinned,
  onPin,
}: {
  zoom: number
  onZoom: (zoom: number) => void
  pinned: boolean
  onPin: (pinned: boolean) => void
}) {
  return (
    <div
      className={pinned ? 'overview-zoom is-pinned' : 'overview-zoom is-floating'}
      role="group"
      aria-label="Tamanho das miniaturas"
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" className="oz-btn" aria-label="Diminuir" onClick={() => onZoom(step(zoom - 0.1))}>
        −
      </button>
      <input
        className="theme-range"
        type="range"
        min={MIN}
        max={MAX}
        step={0.01}
        value={zoom}
        aria-label="Tamanho das miniaturas"
        onChange={(e) => onZoom(Number(e.target.value))}
      />
      <button type="button" className="oz-btn" aria-label="Aumentar" onClick={() => onZoom(step(zoom + 0.1))}>
        +
      </button>
      <span className="oz-value">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        className={pinned ? 'oz-btn oz-pin on' : 'oz-btn oz-pin'}
        aria-pressed={pinned}
        title={pinned ? 'Soltar no canto' : 'Prender no topo'}
        aria-label={pinned ? 'Soltar no canto' : 'Prender no topo'}
        onClick={() => onPin(!pinned)}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
          <path
            d="M6 1.5h4l-.6 4.2 2.6 2.3v1.3H8.7V15H7.3V9.3H4V8l2.6-2.3z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  )
}
