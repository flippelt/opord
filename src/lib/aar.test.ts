import { describe, expect, it } from 'vitest'
import { blankDossier, defaultDossier, migrateDossier } from '../defaults'
import {
  aarObjectives,
  aarTimeline,
  clockDelta,
  formatDelta,
  hasAarExecution,
  normalizeAarResults,
  readClock,
} from './aar'

describe('readClock', () => {
  it('reads a full DTG', () => {
    expect(readClock('230204ZSEP26')).toMatchObject({ zone: 'Z', dated: true })
  })

  it('reads a bare time with or without colon', () => {
    expect(readClock('0204')).toEqual({ minutes: 124, zone: '', dated: false })
    expect(readClock('02:04')).toEqual({ minutes: 124, zone: '', dated: false })
  })

  it('rejects text that is not a time', () => {
    expect(readClock('')).toBeNull()
    expect(readClock('H+10')).toBeNull()
    expect(readClock('2504')).toBeNull()
    expect(readClock('230204ZXYZ26')).toBeNull()
  })
})

describe('clockDelta', () => {
  it('counts minutes late and early between two DTGs', () => {
    expect(clockDelta('230200ZSEP26', '230204ZSEP26')).toBe(4)
    expect(clockDelta('230200ZSEP26', '230158ZSEP26')).toBe(-2)
  })

  it('crosses days and months', () => {
    expect(clockDelta('302350ZSEP26', '010010ZOCT26')).toBe(20)
  })

  it('compares a bare time against the planned DTG', () => {
    expect(clockDelta('230200ZSEP26', '0212')).toBe(12)
    expect(clockDelta('232350ZSEP26', '0005')).toBe(15)
  })

  it('gives up on missing times or different zones', () => {
    expect(clockDelta('', '0204')).toBeNull()
    expect(clockDelta('230200ZSEP26', '')).toBeNull()
    expect(clockDelta('230200ZSEP26', '230204BSEP26')).toBeNull()
  })
})

describe('formatDelta', () => {
  it('writes the difference the way the sheet prints it', () => {
    expect(formatDelta(null)).toBe('—')
    expect(formatDelta(0)).toBe('no horário')
    expect(formatDelta(4)).toBe('+4 min')
    expect(formatDelta(-2)).toBe('−2 min')
    expect(formatDelta(65)).toBe('+1 h 05 min')
    expect(formatDelta(-120)).toBe('−2 h')
  })
})

describe('AAR rows', () => {
  it('takes LZ, PZ and objective maps, not the area map', () => {
    const ids = aarObjectives(defaultDossier()).map((p) => p.id)
    expect(ids).toEqual(expect.arrayContaining(['map-lz', 'map-pz', 'map-obj']))
    expect(ids).not.toContain('map-ao')
  })

  it('skips the empty timeline row of a blank dossier', () => {
    const blank = blankDossier()
    expect(aarTimeline(blank)).toEqual([])
    expect(hasAarExecution(blank)).toBe(false)
    expect(hasAarExecution(defaultDossier())).toBe(true)
  })
})

describe('normalizeAarResults', () => {
  it('keeps text fields and drops junk', () => {
    const out = normalizeAarResults({
      events: { t1: { actual: '0204', note: 7 }, t2: 'x', t3: null },
      objectives: { a: { status: 'done', note: 'ok' }, b: { status: 'won' } },
    })
    expect(out.events).toEqual({ t1: { actual: '0204', note: '' } })
    expect(out.objectives).toEqual({
      a: { status: 'done', note: 'ok' },
      b: { status: '', note: '' },
    })
  })

  it('opens an old dossier without the new fields', () => {
    const raw = structuredClone(defaultDossier()) as unknown as { aar: Record<string, unknown> }
    delete raw.aar.events
    delete raw.aar.objectives
    const next = migrateDossier(raw)
    expect(next?.aar.events).toEqual({})
    expect(next?.aar.objectives).toEqual({})
    expect(next?.aar.summary).toBe(defaultDossier().aar.summary)
  })

  it('keeps the results of a saved dossier', () => {
    const next = migrateDossier(structuredClone(defaultDossier()))
    expect(next?.aar.events.t3.actual).toBe('230204ZSEP26')
    expect(next?.aar.objectives['map-obj'].status).toBe('partial')
  })
})
