import { describe, expect, it } from 'vitest'
import { chunk, pad2, slug, toDtg } from './dtg'

describe('toDtg', () => {
  it('formats 21 Sep 2026 14:30 UTC as 211430ZSEP26', () => {
    const d = new Date(Date.UTC(2026, 8, 21, 14, 30, 0))
    expect(toDtg(d)).toBe('211430ZSEP26')
  })

  it('formats 1 Jan 2026 00:00 UTC as 010000ZJAN26', () => {
    const d = new Date(Date.UTC(2026, 0, 1, 0, 0, 0))
    expect(toDtg(d)).toBe('010000ZJAN26')
  })

  it('accepts a custom zone letter', () => {
    const d = new Date(Date.UTC(2026, 11, 31, 23, 5, 0))
    expect(toDtg(d, 'B')).toBe('312305BDEC26')
  })
})

describe('slug', () => {
  it('strips accents and uppercases', () => {
    expect(slug('Serpente Negra')).toBe('SERPENTE-NEGRA')
    expect(slug('Operação Falcão')).toBe('OPERACAO-FALCAO')
  })
})

describe('chunk / pad2', () => {
  it('pads single digits', () => {
    expect(pad2(3)).toBe('03')
    expect(pad2(12)).toBe('12')
  })

  it('chunks arrays', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunk([], 4)).toEqual([])
  })
})
