import { classificationLine, docTypeOf, handlingText, styleOf } from '../../lib/classification'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal } from './ClanSeal'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function CoverPage({ dossier }: { dossier: Dossier }) {
  const style = styleOf(dossier.document.classification)
  const kind = docTypeOf(dossier.document.type)
  const op = dossier.mission.name || dossier.mission.nickname || '—'

  return (
    <Sheet page="cover" paper={style.cover} ink={style.coverInk}>
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="cover" />
      <div className="cover-body">
        <p className="cover-kicker">Documento controlado · cópia numerada</p>
        <ClanSeal
          src={dossier.clan.sealSrc}
          name={dossier.clan.name}
          shortName={dossier.clan.shortName}
          size={148}
        />
        <p className="cover-unit">{dossier.clan.name || 'UNIDADE'}</p>
        {dossier.clan.motto ? <p className="cover-motto">« {dossier.clan.motto} »</p> : null}
        <h1 className="cover-kind">{kind.label}</h1>
        <p className="cover-kind-nato">{kind.short}</p>
        <p className="cover-op-label">Operação</p>
        <p className="cover-op">{op}</p>
        {dossier.mission.nickname ? <p className="cover-nick">{dossier.mission.nickname}</p> : null}

        <dl className="cover-meta">
          <div>
            <dt>Classificação</dt>
            <dd>{style.label}</dd>
          </div>
          <div>
            <dt>Equiv. NATO</dt>
            <dd>{style.nato}</dd>
          </div>
          <div>
            <dt>Cópia</dt>
            <dd>
              {dossier.document.copyNumber} / {dossier.document.copyTotal}
            </dd>
          </div>
          <div>
            <dt>Nº controle</dt>
            <dd>{dossier.document.controlNumber || '—'}</dd>
          </div>
          <div>
            <dt>DTG de emissão</dt>
            <dd>{dossier.header.dtg || '—'}</dd>
          </div>
          <div>
            <dt>Local</dt>
            <dd>{dossier.header.place || '—'}</dd>
          </div>
        </dl>

        <section className="cover-handling">
          <h2>Aviso de manuseio</h2>
          <p>{handlingText(dossier)}</p>
          <p className="cover-line">{classificationLine(dossier)}</p>
        </section>

        <div className="cover-receipt">
          <span>Recebido por: ________________________</span>
          <span>DTG: _______________</span>
        </div>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
