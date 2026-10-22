import { describe, expect, it } from 'vitest'
import { blankDossier, migrateDossier } from '../defaults'
import { findInsignia, FORCES, migrateInsigniaRef, NATO_RANKS, natoInsigniaSvg } from './insignia'

describe('insignia catalog', () => {
  it('covers the NATO codes once each, enlisted to officers', () => {
    const codes = NATO_RANKS.map((r) => r.code)
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes).toEqual([
      ...Array.from({ length: 9 }, (_, i) => `OR-${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `WO-${i + 1}`),
      'OF-D',
      ...Array.from({ length: 10 }, (_, i) => `OF-${i + 1}`),
    ])
  })

  it('draws a different pin for every code', () => {
    const svgs = NATO_RANKS.map((r) => natoInsigniaSvg(r.code))
    expect(new Set(svgs).size).toBe(svgs.length)
    for (const svg of svgs) expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 120 92".*<\/svg>$/)
  })

  it('names every code in the three forces, in both languages', () => {
    for (const rank of NATO_RANKS) {
      for (const force of FORCES) for (const name of rank.names[force.id]) expect(name.trim()).not.toBe('')
    }
  })

  it('finds a rank by force in the document language, or a clan pin', () => {
    const pins = [{ id: 'p1', label: 'Capitão do clã', src: 'data:image/png;base64,AAAA' }]
    expect(findInsignia('army/OF-2', pins)?.label).toBe('Capitão')
    expect(findInsignia('army/OF-2', pins, 'en')?.label).toBe('Captain')
    expect(findInsignia('navy/OF-2', pins)?.label).toBe('Capitão-Tenente')
    expect(findInsignia('navy/OF-5', pins, 'en')?.label).toBe('Captain')
    expect(findInsignia('air/OF-6', pins)?.label).toBe('Brigadeiro')
    // Mesmo código, mesmo pin, em qualquer força.
    expect(findInsignia('navy/OF-2', pins)?.src).toBe(findInsignia('army/OF-2', pins)?.src)
    expect(findInsignia('army/OF-2', pins)?.src).toMatch(/^data:image\/svg\+xml,/)
    expect(findInsignia('clan/p1', pins)).toEqual({ src: pins[0].src, label: 'Capitão do clã' })
    expect(findInsignia('clan/gone', pins)).toBeNull()
    expect(findInsignia('army/OF-11', pins)).toBeNull()
    expect(findInsignia('nato/OF-2', pins)).toBeNull()
    expect(findInsignia('', pins)).toBeNull()
  })

  it('moves the old per-force picks to the NATO code', () => {
    expect(migrateInsigniaRef('br-army/OF-2')).toBe('army/OF-2')
    expect(migrateInsigniaRef('br-army/OF-1-2ten')).toBe('army/OF-1')
    expect(migrateInsigniaRef('us-army/OF-10')).toBe('army/OF-10')
    expect(migrateInsigniaRef('us-army/OR-9-sgm')).toBe('army/OR-9')
    expect(migrateInsigniaRef('us-army/WO-3')).toBe('army/WO-3')
    expect(migrateInsigniaRef('br-navy/OF-1-1t')).toBe('navy/OF-1')
    expect(migrateInsigniaRef('us-navy/OR-9-mcpon')).toBe('navy/OR-9')
    expect(migrateInsigniaRef('br-air/OF-D')).toBe('air/OF-D')
    expect(migrateInsigniaRef('br-army/')).toBe('')
    expect(migrateInsigniaRef('xx/OF-2')).toBe('')
    expect(migrateInsigniaRef('air/OR-4')).toBe('air/OR-4')
    expect(migrateInsigniaRef('clan/p1')).toBe('clan/p1')
  })

  it('migrates old dossiers, signatures included, and keeps valid clan pins', () => {
    const raw = structuredClone(blankDossier()) as unknown as Record<string, any>
    raw.command.mark = 'insignia'
    raw.command.insignia = 'br-navy/OF-5'
    raw.signatures = { sitrep: { ...raw.command, insignia: 'us-air/OR-4' } }
    raw.clan.pins = [{ id: 'p1', label: 'Cb', src: 'data:x' }, { label: 'sem id' }, null]
    const next = migrateDossier(raw)
    expect(next?.command.insignia).toBe('navy/OF-5')
    expect(next?.signatures.sitrep.insignia).toBe('air/OR-4')
    expect(next?.clan.pins).toEqual([{ id: 'p1', label: 'Cb', src: 'data:x' }])
    delete raw.clan.pins
    expect(migrateDossier(raw)?.clan.pins).toEqual([])
  })
})
