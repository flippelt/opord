import { describe, expect, it } from 'vitest'
import { inkOn } from './clanColors'

describe('inkOn', () => {
  it('usa tinta clara no fundo escuro e escura no claro', () => {
    expect(inkOn('#0b0c0d')).toBe('#ece8e1')
    expect(inkOn('#ce1e28')).toBe('#ece8e1')
    expect(inkOn('#efe6d0')).toBe('#1a1714')
    expect(inkOn('#facc15')).toBe('#1a1714')
  })

  it('cai na tinta clara com cor inválida', () => {
    expect(inkOn('vermelho')).toBe('#ece8e1')
  })
})
