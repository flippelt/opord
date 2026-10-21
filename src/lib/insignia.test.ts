import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findInsignia, INSIGNIA_SETS } from './insignia'

const FREE = ['Public domain', 'CC0', 'CC BY 4.0', 'CC BY-SA 4.0']

describe('insignia catalog', () => {
  it('has the six forces, each with enlisted and officers', () => {
    expect(INSIGNIA_SETS.map((s) => s.id)).toEqual(['br-army', 'br-navy', 'br-air', 'us-army', 'us-navy', 'us-air'])
    for (const set of INSIGNIA_SETS) {
      expect(set.ranks.some((r) => r.group === 'enlisted')).toBe(true)
      expect(set.ranks.some((r) => r.group === 'officer')).toBe(true)
    }
  })

  it('points every rank at a file in public/insignia, with a free license and credit', () => {
    for (const set of INSIGNIA_SETS) {
      const ids = new Set<string>()
      for (const rank of set.ranks) {
        expect(ids.has(rank.id)).toBe(false)
        ids.add(rank.id)
        expect(existsSync(join(process.cwd(), 'public', 'insignia', rank.file))).toBe(true)
        expect(FREE).toContain(rank.license)
        expect(rank.author.trim()).not.toBe('')
        expect(rank.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//)
      }
    }
  })

  it('finds a rank by set and id', () => {
    expect(findInsignia('br-army/OF-2')?.rank.label).toBe('Capitão')
    expect(findInsignia('br-army/')).toBeNull()
    expect(findInsignia('xx/OF-2')).toBeNull()
  })
})
