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
  })

  it('rejects payloads without version 1', () => {
    expect(migrateDossier({})).toBeNull()
    expect(migrateDossier({ version: 2 })).toBeNull()
  })
})
