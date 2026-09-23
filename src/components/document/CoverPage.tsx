import { classificationLine, docTypeOf, handlingText, isNoticeType, styleOf } from '../../lib/classification'
import { paper } from '../../lib/i18n'
import { sheetTitle } from '../../lib/stack'
import type { Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { ClanSeal } from './ClanSeal'
import { unitTitle } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function CoverPage({ dossier }: { dossier: Dossier }) {
  const style = styleOf(dossier.document.classification)
  const t = paper(dossier)
  const kind = docTypeOf(dossier.document.type)
  const kindId = dossier.document.type
  const notice = isNoticeType(kindId)
  const hvt = kindId === 'hvt' ? dossier.hvts[0] : undefined
  const op = notice
    ? dossier.notice.subject || dossier.mission.name || '—'
    : hvt
      ? hvt.name || hvt.alias || 'HVT'
      : dossier.mission.name || dossier.mission.nickname || '—'
  const kicker =
    notice ? t.subject : kindId === 'hvt' ? t.target : kindId === 'casevac' ? t.request : kindId === 'orbat' ? t.unit : t.operation

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
        <p className="cover-unit">{unitTitle(dossier.clan.name, dossier.clan.shortName, 'UNIDADE')}</p>
        {dossier.clan.motto ? <p className="cover-motto">« {dossier.clan.motto} »</p> : null}
        <h1 className="cover-kind">{kind.label}</h1>
        <p className="cover-kind-nato">{kind.short}</p>
        <p className="cover-op-label">{kicker}</p>
        <p className="cover-op">{sheetTitle(dossier.titles, 'cover', op)}</p>
        {!notice && dossier.mission.nickname ? <p className="cover-nick">{dossier.mission.nickname}</p> : null}
        {notice && dossier.notice.number ? (
          <p className="cover-nick">Nº {dossier.notice.number}</p>
        ) : null}

        <dl className="cover-meta">
          <div>
            <dt>{t.classification}</dt>
            <dd>{dossier.document.language === 'en' ? style.nato : style.label}</dd>
          </div>
          <div>
            <dt>{t.nato}</dt>
            <dd>{style.nato}</dd>
          </div>
          <div>
            <dt>{t.copy}</dt>
            <dd>
              {dossier.document.copyNumber} / {dossier.document.copyTotal}
            </dd>
          </div>
          <div>
            <dt>{t.control}</dt>
            <dd>{dossier.document.controlNumber || '—'}</dd>
          </div>
          <div>
            <dt>{t.issued}</dt>
            <dd>{dossier.header.dtg || '—'}</dd>
          </div>
          <div>
            <dt>{t.place}</dt>
            <dd>{dossier.header.place || '—'}</dd>
          </div>
        </dl>

        <section className="cover-handling">
          <h2>{t.handling}</h2>
          <p>{handlingText(dossier)}</p>
          <p className="cover-line">{classificationLine(dossier)}</p>
        </section>

        <div className="cover-receipt">
          <span>{t.received}</span>
          <span>DTG: _______________</span>
        </div>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
