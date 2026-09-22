import { describe, expect, it } from 'vitest'
import { defaultDossier, migrateDossier } from './defaults'

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

  it('rejects payloads without version 1', () => {
    expect(migrateDossier({})).toBeNull()
    expect(migrateDossier({ version: 2 })).toBeNull()
  })
})
