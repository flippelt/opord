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

  it('keeps post-landing azimuth off the other map types', () => {
    const dossier = defaultDossier()
    const area = dossier.maps.find((item) => item.id === 'map-ao')
    const pz = dossier.maps.find((item) => item.id === 'map-pz')
    const objective = dossier.maps.find((item) => item.id === 'map-obj')
    if (!area || !pz || !objective) throw new Error('missing map')
    area.azimuth = '090 — não entra na área'
    const areaHtml = renderToStaticMarkup(createElement(MapPage, { dossier, plate: area }))
    expect(areaHtml).not.toContain('Azimute após o desembarque')
    expect(areaHtml).toContain('Pontos de referência')
    const pzHtml = renderToStaticMarkup(createElement(MapPage, { dossier, plate: pz }))
    expect(pzHtml).toContain('Marcação')
    expect(pzHtml).toContain('Proa de decolagem')
    expect(pzHtml).toContain('Fumaça verde + IR strobe')
    expect(pzHtml).not.toContain('Azimute após o desembarque')
    const objectiveHtml = renderToStaticMarkup(createElement(MapPage, { dossier, plate: objective }))
    expect(objectiveHtml).toContain('Direção de entrada')
    expect(objectiveHtml).not.toContain('Azimute após o desembarque')
  })

  it('prints the caption the author picked', () => {
    const dossier = defaultDossier()
    const plate = dossier.maps.find((item) => item.id === 'map-lz')
    if (!plate) throw new Error('missing LZ')
    plate.chartLabel = 'Carta'
    plate.photoLabel = 'Aérea'
    const html = renderToStaticMarkup(createElement(MapPage, { dossier, plate }))
    expect(html).toContain('>Carta<')
    expect(html).toContain('>Aérea<')
  })

  it('uses one larger frame when a single image is selected', () => {
    const dossier = defaultDossier()
    const plate = dossier.maps.find((item) => item.id === 'map-ao')
    if (!plate) throw new Error('missing AO')
    plate.images = 'one'
    plate.focus = 'chart'
    const html = renderToStaticMarkup(createElement(MapPage, { dossier, plate }))
    expect(html).toContain('map-one')
    expect(html).toContain('zoom-ao.jpg')
    expect(html).not.toContain('drone-ao.jpg')
    expect(html).toContain('op-head')
  })

  it('fills the landscape sheet under the header when full page is on', () => {
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
    expect(html).toContain('map-slide-fit')
    expect(html).toContain('op-head')
    expect(html).toContain('is-landscape')
    expect(html).not.toContain('map-notes')
    expect(html).toContain('class="binding"')
    expect(html).toContain('zoom-lz.jpg')
    expect(html).not.toContain('drone-lz.jpg')
  })
})
