import type { StampConfig } from '../../types'

export function RubberStamp({ stamp, copyLabel }: { stamp: StampConfig; copyLabel?: string }) {
  const subtitle =
    stamp.id === 'copy' && copyLabel ? copyLabel : stamp.subtitle
  return (
    <div
      className="rubber-stamp"
      style={{
        left: `${stamp.x}%`,
        top: `${stamp.y}%`,
        width: stamp.size,
        color: stamp.color,
        transform: `rotate(${stamp.rotate}deg)`,
      }}
      aria-hidden
    >
      {stamp.kind === 'oval' && <OvalStamp title={stamp.title} subtitle={subtitle} />}
      {stamp.kind === 'box' && <BoxStamp title={stamp.title} subtitle={subtitle} />}
      {stamp.kind === 'round' && <RoundStamp title={stamp.title} subtitle={subtitle} />}
    </div>
  )
}

function OvalStamp({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <svg viewBox="0 0 280 200">
      <ellipse cx="140" cy="100" rx="132" ry="92" fill="none" stroke="currentColor" strokeWidth="7" />
      <ellipse cx="140" cy="100" rx="120" ry="80" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <text
        x="140"
        y={subtitle ? 96 : 108}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Oswald, sans-serif"
        fontSize={title.length > 12 ? 22 : 28}
        fontWeight="700"
        letterSpacing="3"
      >
        {title}
      </text>
      {subtitle && (
        <text
          x="140"
          y="128"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="Oswald, sans-serif"
          fontSize="13"
          letterSpacing="4"
        >
          {subtitle}
        </text>
      )}
    </svg>
  )
}

function BoxStamp({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <svg viewBox="0 0 280 120">
      <rect x="8" y="10" width="264" height="100" fill="none" stroke="currentColor" strokeWidth="6" />
      <rect x="16" y="18" width="248" height="84" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <text
        x="140"
        y={subtitle ? 58 : 70}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Oswald, sans-serif"
        fontSize={title.length > 14 ? 18 : 24}
        fontWeight="700"
        letterSpacing="2"
      >
        {title}
      </text>
      {subtitle && (
        <text
          x="140"
          y="82"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="Oswald, sans-serif"
          fontSize="11"
          letterSpacing="2"
        >
          {subtitle}
        </text>
      )}
    </svg>
  )
}

function RoundStamp({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="7" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
      <text
        x="100"
        y={subtitle ? 92 : 108}
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Oswald, sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="2"
      >
        {title}
      </text>
      {subtitle && (
        <text
          x="100"
          y="122"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="Oswald, sans-serif"
          fontSize="12"
          letterSpacing="1"
        >
          {subtitle}
        </text>
      )}
    </svg>
  )
}
