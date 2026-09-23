import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { defaultDossier } from '../../defaults'
import { MapPage } from './MapPage'
import { SheetOrient } from './Sheet'

describe('MapPage', () => {
  it('puts the ground notes under the picture', () => {
    const dossier = defaultDossier()
    const plate = dossier.maps.find((item) => item.id === 'map-lz')
    if (!plate) throw new Error('missing LZ')
    const html = renderToStaticMarkup(createElement(MapPage, { dossier, plate }))
    const picture = html.indexOf('map-board')
    const notes = html.indexOf('Azimute após o desembarque')
    expect(picture).toBeGreaterThan(-1)
    expect(notes).toBeGreaterThan(picture)
    expect(html).toContain('166127')
    expect(html).toContain('090 — leste, para o complexo, depois do check-in')
    expect(html).toContain('Pontos de referência')
    expect(html).toContain('Observações da região')
    expect(html).toContain('>Zoom<')
    expect(html).toContain('>Drone<')
    expect(html).toContain('class="binding"')
  })

  it('fills a landscape sheet with the map when full page is on', () => {
    const dossier = defaultDossier()
    dossier.document.orientation = 'landscape'
    const plate = dossier.maps.find((item) => item.id === 'map-lz')
    if (!plate) throw new Error('missing LZ')
    plate.fullPage = true
    const html = renderToStaticMarkup(
      createElement(SheetOrient.Provider, {
        value: 'landscape',
        children: createElement(MapPage, { dossier, plate }),
      }),
    )
    expect(html).toContain('map-slide')
    expect(html).toContain('is-landscape')
    expect(html).not.toContain('map-notes')
    expect(html).not.toContain('class="binding"')
  })
})
