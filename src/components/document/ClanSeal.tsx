type Props = {
  src: string
  name: string
  shortName: string
  size?: number
}

export function ClanSeal({ src, name, shortName, size = 128 }: Props) {
  if (src) {
    return (
      <img
        className="clan-seal-img"
        src={src}
        alt={name || 'Logo do clã'}
        width={size}
        height={size}
      />
    )
  }
  const rim = (shortName || name || 'UNIDADE').toUpperCase().slice(0, 24)
  const uid = `seal-${size}-${rim.replace(/\s+/g, '')}`
  return (
    <svg className="clan-seal" width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={name}>
      <defs>
        <path id={`${uid}-top`} d="M28 108 A78 78 0 0 1 172 108" fill="none" />
      </defs>
      <circle cx="100" cy="100" r="98" fill="#1a1714" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#c9a227" strokeWidth="4" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#c9a227" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="#c9a227" strokeWidth="0.6" opacity="0.7" />
      <path
        d="M100 52 L109 80 L139 80 L115 97 L124 126 L100 109 L76 126 L85 97 L61 80 L91 80 Z"
        fill="#c9a227"
      />
      {size >= 96 ? (
        <text fill="#c9a227" fontSize="13" fontFamily="Cinzel, serif" letterSpacing="3">
          <textPath href={`#${uid}-top`} startOffset="50%" textAnchor="middle">
            {rim}
          </textPath>
        </text>
      ) : (
        <text
          x="100"
          y="168"
          textAnchor="middle"
          fill="#c9a227"
          fontFamily="Oswald, sans-serif"
          fontSize="16"
          letterSpacing="2"
        >
          {rim.slice(0, 6)}
        </text>
      )}
    </svg>
  )
}

export function UnitPatch({ src, shortName, size = 72 }: { src: string; shortName: string; size?: number }) {
  if (src) {
    return <img className="unit-patch-img" src={src} alt="Distintivo" width={size} height={size} />
  }
  const letters = (shortName || 'UN').toUpperCase().slice(0, 4)
  return (
    <svg className="unit-patch" width={size} height={Math.round(size * 1.2)} viewBox="0 0 80 96" aria-hidden>
      <path
        d="M40 4 L76 18 V54 C76 74 40 92 40 92 C40 92 4 74 4 54 V18 Z"
        fill="#1a1714"
        stroke="#c9a227"
        strokeWidth="3"
      />
      <path d="M40 14 L68 24 V52 C68 68 40 82 40 82 C40 82 12 68 12 52 V24 Z" fill="none" stroke="#c9a227" strokeWidth="1" />
      <text
        x="40"
        y="56"
        textAnchor="middle"
        fill="#c9a227"
        fontFamily="Oswald, sans-serif"
        fontSize={letters.length > 3 ? 12 : 16}
        letterSpacing="1"
      >
        {letters}
      </text>
    </svg>
  )
}
