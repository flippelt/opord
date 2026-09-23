import { describe, expect, it } from 'vitest'
import { blankDossier, defaultDossier, migrateDossier } from './defaults'

describe('blankDossier', () => {
  it('starts with the cover only', () => {
    const on = Object.entries(blankDossier().document.pages)
      .filter(([, enabled]) => enabled)
      .map(([id]) => id)
    expect(on).toEqual(['cover'])
  })
})

describe('migrateDossier', () => {
  it('turns the old dual watermark into diagonal text only', () => {
    const raw = structuredClone(defaultDossier()) as unknown as Record<string, unknown>
    const marks = raw.marks as { watermarkMode: string; stamps: { id: string; enabled: boolean }[] }
    marks.watermarkMode = 'both'
    const oval = marks.stamps.find((s) => s.id === 'confidential')
    if (oval) oval.enabled = true
    const next = migrateDossier(raw)
    expect(next?.marks.watermarkMode).toBe('diagonal')
    expect(next?.marks.stamps.find((s) => s.id === 'confidential')?.enabled).toBe(false)
    expect(next?.notice.number).toBeDefined()
    expect(next?.document.pages.notice).toBe(true)
    expect(next?.aar).toBeDefined()
    expect(next?.casevac.line1).toBeDefined()
    expect(next?.hvts.length).toBeGreaterThan(0)
    expect(next?.orbat.length).toBeGreaterThan(0)
    const legacy = structuredClone(defaultDossier())
    delete (legacy.marks as { watermarkFigure?: string }).watermarkFigure
    delete (legacy.marks as { watermarkTextOnTop?: boolean }).watermarkTextOnTop
    const kept = migrateDossier(legacy)
    expect(kept?.marks.watermarkFigure).toBe('none')
    expect(kept?.marks.watermarkTextOnTop).toBe(true)
  })

  it('gives an old dossier a stack and keeps a renamed OPORD', () => {
    const raw = structuredClone(defaultDossier())
    const legacy = { ...raw, titles: undefined, blanks: undefined, stack: undefined }
    const next = migrateDossier(legacy)
    expect(next?.stack.some((item) => item.kind === 'opord')).toBe(true)
    expect(next?.stack.at(-1)?.kind === 'blank' || next?.stack.some((item) => item.kind === 'intel')).toBe(
      true,
    )
    const renamed = migrateDossier({ ...raw, titles: { opord: 'FRAGO 04' }, stack: raw.stack, blanks: raw.blanks })
    expect(renamed?.titles.opord).toBe('FRAGO 04')
    const ids = renamed?.stack.map((item) => (item.kind === 'blank' ? item.id : item.kind)) ?? []
    expect(ids.indexOf('opord')).toBeLessThan(ids.indexOf('blank-croqui'))
    expect(ids.indexOf('blank-croqui')).toBeLessThan(ids.indexOf('intel'))
  })

  it('turns REL TO UNIDADE into the clan sigla', () => {
    const raw = structuredClone(defaultDossier())
    raw.document.caveats = ['EYES ONLY', 'REL TO UNIDADE']
    delete (raw.document as { relToOn?: boolean }).relToOn
    delete (raw.document as { relTo?: string }).relTo
    const next = migrateDossier(raw)
    expect(next?.document.caveats).toEqual(['EYES ONLY'])
    expect(next?.document.relToOn).toBe(true)
    expect(next?.document.relTo).toBe('FALCÃO')
  })

  it('keeps a custom REL TO name and a hidden intel stamp', () => {
    const raw = structuredClone(defaultDossier())
    raw.document.relToOn = true
    raw.document.relTo = 'BRAVO'
    raw.document.caveats = ['NOFORN', 'REL TO UNIDADE']
    raw.intelStamp = { enabled: false, text: 'IMAGERY' }
    const next = migrateDossier(raw)
    expect(next?.document.caveats).toEqual(['NOFORN'])
    expect(next?.document.relTo).toBe('BRAVO')
    expect(next?.intelStamp).toEqual({ enabled: false, text: 'IMAGERY' })
    delete (raw as { intelStamp?: unknown }).intelStamp
    expect(migrateDossier(raw)?.intelStamp).toEqual({ enabled: true, text: 'FOTO INTEL' })
  })

  it('rejects payloads without version 1', () => {
    expect(migrateDossier({})).toBeNull()
    expect(migrateDossier({ version: 2 })).toBeNull()
  })
})
