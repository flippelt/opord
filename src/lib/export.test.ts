import { describe, expect, it } from 'vitest'
import { fileBase } from './export'

describe('fileBase', () => {
  it('joins slug parts', () => {
    expect(fileBase(['OPORD', 'Serpente Negra', 'CONFIDENCIAL'])).toBe(
      'OPORD-SERPENTE-NEGRA-CONFIDENCIAL',
    )
  })

  it('falls back when empty', () => {
    expect(fileBase(['', ''])).toBe('OPORD')
  })
})
