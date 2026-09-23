import { classificationLine } from '../../lib/classification'
import { sheetTitle } from '../../lib/stack'
import type { Dossier, HvtCard } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal } from './ClanSeal'
import { unitTitle } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function HvtPage({ dossier, card, index }: { dossier: Dossier; card: HvtCard; index: number }) {
  return (
    <Sheet page="hvt" exportId={`hvt-${index + 1}`} paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="hvt" />
      <div className="hvt-body">
        <header className="hvt-top">
          <ClanSeal
            src={dossier.clan.sealSrc}
            name={dossier.clan.name}
            shortName={dossier.clan.shortName}
            size={56}
          />
          <div>
            <p className="hvt-kicker">
              {unitTitle(dossier.clan.name, dossier.clan.shortName, 'UNIDADE')} · CARTÃO DE ALVO · HVT-{String(index + 1).padStart(2, '0')}
            </p>
            <h1>{sheetTitle(dossier.titles, 'hvt', card.status || 'WANTED')}</h1>
            <p>
              {dossier.mission.name ? `OP. ${dossier.mission.name}` : '—'} · {dossier.header.dtg || '—'}
            </p>
          </div>
        </header>

        <div className="hvt-grid">
          <figure className="hvt-photo">
            {card.photoSrc ? (
              <img src={card.photoSrc} alt={card.name || 'HVT'} />
            ) : (
              <div className="hvt-empty">
                <span>SEM RETRATO</span>
                <small>Subir foto intel do alvo</small>
              </div>
            )}
            <figcaption>FOTO INTEL · NÃO CLASSIFICAR FORA DE CIRCUITO</figcaption>
          </figure>
          <div className="hvt-id">
            <p className="hvt-name">{card.name || 'IDENTIDADE DESCONHECIDA'}</p>
            <p className="hvt-alias">AKA {card.alias || '—'}</p>
            <dl>
              <div>
                <dt>Função</dt>
                <dd>{card.role || '—'}</dd>
              </div>
              <div>
                <dt>Nacionalidade</dt>
                <dd>{card.nationality || '—'}</dd>
              </div>
              <div>
                <dt>Último avistamento</dt>
                <dd>{card.lastSeen || '—'}</dd>
              </div>
              <div>
                <dt>Grid</dt>
                <dd>{card.grid || '—'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className="hvt-block">
          <h2>Descrição</h2>
          <p>{card.description || '—'}</p>
        </section>
        <div className="hvt-two">
          <section className="hvt-block">
            <h2>Armamento / meios</h2>
            <p>{card.weapons || '—'}</p>
          </section>
          <section className="hvt-block">
            <h2>Associados</h2>
            <p>{card.associates || '—'}</p>
          </section>
        </div>
        <section className="hvt-guidance">
          <h2>Orientação</h2>
          <p>{card.guidance || '—'}</p>
        </section>
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
