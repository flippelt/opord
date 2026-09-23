import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { defaultDossier } from '../../defaults'
import { IntelPage } from './IntelPage'

describe('IntelPage photo stamp', () => {
  it('prints the editable stamp on each plate', () => {
    const dossier = defaultDossier()
    dossier.intelStamp = { enabled: true, text: 'FOTO INTEL' }
    const html = renderToStaticMarkup(createElement(IntelPage, { dossier, photos: dossier.intel.slice(0, 1) }))
    expect(html.match(/photo-stamp/g)?.length).toBe(4)
    expect(html).toContain('FOTO INTEL')
  })

  it('hides the stamp when it is off or blank', () => {
    const dossier = defaultDossier()
    dossier.intelStamp = { enabled: false, text: 'FOTO INTEL' }
    const off = renderToStaticMarkup(createElement(IntelPage, { dossier, photos: dossier.intel.slice(0, 1) }))
    expect(off).not.toContain('photo-stamp')
    dossier.intelStamp = { enabled: true, text: '   ' }
    const blank = renderToStaticMarkup(createElement(IntelPage, { dossier, photos: dossier.intel.slice(0, 1) }))
    expect(blank).not.toContain('photo-stamp')
  })
})
