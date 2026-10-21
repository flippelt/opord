import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SheetStack } from '../components/SheetStack'
import { blankDossier, defaultDossier } from '../defaults'
import { sheetList, stageKey } from './sheets'

describe('sheetList', () => {
  it('follows the stack and splits OPORD, AAR, HVT, maps and intel into sheets', () => {
    const keys = sheetList(defaultDossier()).map((s) => s.key)
    expect(keys.slice(0, 3)).toEqual(['cover', 'notice', 'opord-1'])
    expect(keys).toContain('opord-2')
    expect(keys.indexOf('aar-execucao')).toBe(keys.indexOf('aar') + 1)
    expect(keys).toEqual(expect.arrayContaining(['hvt-1', 'map-map-lz', 'blank-blank-croqui', 'intel-1']))
  })

  it('matches the data-page of every rendered sheet', () => {
    const dossier = defaultDossier()
    const sheets = sheetList(dossier)
    const html = renderToStaticMarkup(createElement(SheetStack, { dossier, sheets, active: null }))
    const pages = [...html.matchAll(/data-page="([^"]+)"/g)].map((m) => m[1])
    expect(pages).toEqual(sheets.map((s) => s.key))
  })

  it('keeps only the active sheet on screen', () => {
    const dossier = defaultDossier()
    const sheets = sheetList(dossier)
    const html = renderToStaticMarkup(createElement(SheetStack, { dossier, sheets, active: 'opord-2' }))
    const shown = [...html.matchAll(/class="sheet [^"]*"[^>]*data-page="([^"]+)"/g)]
      .filter((m) => !m[0].includes('is-off'))
      .map((m) => m[1])
    expect(shown).toEqual(['opord-2'])
  })

  it('gives a blank dossier just the cover', () => {
    expect(sheetList(blankDossier()).map((s) => s.key)).toEqual(['cover'])
  })

  it('opens a new map page on a stable key', () => {
    const d = blankDossier()
    d.document.pages.map = true
    expect(sheetList(d).map((s) => s.key)).toEqual(['cover', 'map-map-empty'])
    expect(sheetList(d)[1].key).toBe(sheetList(d)[1].key)
  })
})

describe('stageKey', () => {
  it('shows the first sheet for the setup step and for a sheet that left the pack', () => {
    const sheets = sheetList(defaultDossier())
    expect(stageKey(sheets, 'setup')).toBe('cover')
    expect(stageKey(sheets, 'hvt-9')).toBe('cover')
    expect(stageKey(sheets, 'sitrep')).toBe('sitrep')
  })
})

describe('data-edit', () => {
  it('marks the operation name on the cover, not a sheet title', () => {
    const dossier = defaultDossier()
    const sheets = sheetList(dossier).filter((s) => s.key === 'cover')
    const html = renderToStaticMarkup(createElement(SheetStack, { dossier, sheets, active: null }))
    expect(html).toContain('data-edit="mission.name">SERPENTE NEGRA<')
  })
})
