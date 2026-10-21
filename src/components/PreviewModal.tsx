import { useEffect } from 'react'
import type { SheetRef } from '../lib/sheets'
import { useDossier } from '../store'
import type { Dossier } from '../types'
import { SheetStack } from './SheetStack'

/** O dossiê inteiro, folha após folha, sem o editor. Clicar numa folha volta a editá-la. */
export function PreviewModal({
  dossier,
  sheets,
  onClose,
}: {
  dossier: Dossier
  sheets: SheetRef[]
  onClose: () => void
}) {
  const setActive = useDossier((s) => s.setActive)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Pré-visualização do dossiê">
      <div className="preview-bar">
        <p>
          Pré-visualização · {sheets.length} {sheets.length === 1 ? 'folha' : 'folhas'}
          <small>Clique numa folha para editá-la.</small>
        </p>
        <button type="button" className="btn" onClick={onClose} autoFocus>
          Fechar
        </button>
      </div>
      <div
        className="preview-body"
        onClick={(e) => {
          const sheet = (e.target as HTMLElement).closest<HTMLElement>('.sheet')
          if (!sheet) {
            if (e.target === e.currentTarget) onClose()
            return
          }
          const key = sheet.dataset.page
          if (key) setActive(key)
          onClose()
        }}
      >
        <SheetStack dossier={dossier} sheets={sheets} active={null} scope="pv-" className="preview-stack" />
      </div>
    </div>
  )
}
