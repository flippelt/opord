import { describe, expect, it } from 'vitest'
import { escolherPorta, nodeMajor } from './abrir-lib.mjs'

describe('nodeMajor', () => {
  it('reads the major from a version string', () => {
    expect(nodeMajor('22.14.0')).toBe(22)
    expect(nodeMajor('24.0.1')).toBe(24)
  })
})

describe('escolherPorta', () => {
  it('returns a free port in the requested range', async () => {
    const port = await escolherPorta(4173, 4)
    expect(port).toBeGreaterThanOrEqual(4173)
    expect(port).toBeLessThan(4177)
  })
})
