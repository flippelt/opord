import { classificationLine, styleOf } from '../../lib/classification'
import type { Dossier, IntelPhoto } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal } from './ClanSeal'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function IntelPage({
  dossier,
  photos,
  startIndex = 0,
}: {
  dossier: Dossier
  photos: IntelPhoto[]
  startIndex?: number
}) {
  const slots = [...photos]
  while (slots.length < 4) {
    slots.push({
      id: `empty-${startIndex}-${slots.length}`,
      src: '',
      caption: '',
      grid: '',
      source: '',
      dtg: '',
    })
  }

  return (
    <Sheet page="intel" paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="intel" />
      <div className="intel-body">
        <header className="intel-head">
          <ClanSeal
            src={dossier.clan.sealSrc}
            name={dossier.clan.name}
            shortName={dossier.clan.shortName}
            size={56}
          />
          <div>
            <p className="intel-kicker">Anexo B — Inteligência</p>
            <h1>FOTO INTEL / IMAGERY</h1>
            <p>
              {dossier.mission.name ? `OP. ${dossier.mission.name}` : '—'} · {dossier.header.dtg || '—'}
            </p>
          </div>
        </header>
        <div className="intel-grid">
          {slots.slice(0, 4).map((photo, i) => (
            <PhotoPlate key={photo.id} photo={photo} index={startIndex + i + 1} />
          ))}
        </div>
        <p className="intel-note">
          Imagens para planejamento. Não reproduzir fora do circuito da unidade. Fonte e DTG no
          rodapé de cada placa. Classificação da página: {styleOf(dossier.document.classification).label}.
        </p>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}

function PhotoPlate({ photo, index }: { photo: IntelPhoto; index: number }) {
  return (
    <figure className="photo-plate">
      <div className="photo-frame">
        {photo.src ? (
          <img src={photo.src} alt={photo.caption || `Intel ${index}`} />
        ) : (
          <div className="photo-empty">
            <span>SEM IMAGEM</span>
            <small>Slot {index} — subir foto intel</small>
          </div>
        )}
        <span className="photo-stamp">FOTO INTEL</span>
      </div>
      <figcaption>
        <span className="photo-id">B-{String(index).padStart(2, '0')}</span>
        <span className="photo-cap">{photo.caption || 'Sem legenda'}</span>
        <span>
          GRID {photo.grid || '—'} · {photo.source || 'SRC —'} · {photo.dtg || 'DTG —'}
        </span>
      </figcaption>
    </figure>
  )
}
