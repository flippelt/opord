import { classificationLine } from '../../lib/classification'
import type { BlankPage, Dossier } from '../../types'
import { ClassificationBanner } from './Banners'
import { DocumentChrome } from './DocumentChrome'
import { Sheet } from './Sheet'
import { Marks } from './Watermark'

export function BlankSheet({ dossier, blank }: { dossier: Dossier; blank: BlankPage }) {
  return (
    <Sheet page="blank" exportId={`blank-${blank.id}`} paper="#efe6d0" ink="#1a1714">
      <ClassificationBanner dossier={dossier} position="top" />
      <Marks dossier={dossier} page="blank" />
      <div className="notice-body blank-body">
        <DocumentChrome
          dossier={dossier}
          title={blank.title || 'ANEXO'}
          subtitle={blank.heading || undefined}
        />
        {blank.body ? <p className="blank-text">{blank.body}</p> : null}
        {blank.lined ? <div className="blank-lines" aria-hidden /> : <div className="blank-open" />}
        <p className="op-foot-class">{classificationLine(dossier)}</p>
      </div>
      <ClassificationBanner dossier={dossier} position="bottom" />
    </Sheet>
  )
}
