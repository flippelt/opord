import { describe, expect, it } from 'vitest'
import { insertBlankBeforeIntel, normalizeStack } from './stack'
import type { BlankPage } from '../types'

const croqui: BlankPage = {
  id: 'blank-croqui',
  title: 'ANEXO C — CROQUI DO PZ',
  heading: '',
  body: '',
  lined: true,
}

describe('normalizeStack', () => {
  it('builds the classic order and puts old blanks at the end', () => {
    const stack = normalizeStack(undefined, [croqui])
    expect(stack.at(-1)).toEqual({ kind: 'blank', id: 'blank-croqui' })
    expect(stack.findIndex((item) => item.kind === 'opord')).toBeLessThan(
      stack.findIndex((item) => item.kind === 'intel'),
    )
  })

  it('drops radio and roe sheets from an older stack', () => {
    const stack = normalizeStack(
      [{ kind: 'cover' }, { kind: 'opord' }, { kind: 'radio' }, { kind: 'roe' }, { kind: 'roster' }],
      [],
    )
    const kinds = stack.map((item) => item.kind)
    expect(kinds).not.toContain('radio')
    expect(kinds).not.toContain('roe')
    expect(kinds).toContain('opord')
    expect(kinds).toContain('roster')
  })

  it('keeps a blank between the OPORD and the intel annex', () => {
    const stack = insertBlankBeforeIntel(normalizeStack(undefined, []), croqui.id)
    const withBlank = normalizeStack(stack, [croqui])
    const ids = withBlank.map((item) => (item.kind === 'blank' ? item.id : item.kind))
    expect(ids.indexOf('opord')).toBeLessThan(ids.indexOf('blank-croqui'))
    expect(ids.indexOf('blank-croqui')).toBeLessThan(ids.indexOf('intel'))
  })
})
