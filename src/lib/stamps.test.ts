import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RubberStamp } from '../components/document/RubberStamp'
import { defaultStamps } from '../defaults'
import { stampTerm } from './stamps'

describe('stampTerm', () => {
  it('recognizes the English classification words', () => {
    expect(stampTerm('top secret')).toBe('TOP SECRET')
    expect(stampTerm('CONFIDENTIAL')).toBe('CONFIDENTIAL')
    expect(stampTerm('CLASSIFIED')).toBe('CLASSIFIED')
    expect(stampTerm('EYES ONLY')).toBe('custom')
  })
})

describe('RubberStamp', () => {
  it('prints the chosen English term in capitals', () => {
    const stamp = defaultStamps()[0]
    stamp.title = 'top secret'
    stamp.subtitle = 'classified'
    const html = renderToStaticMarkup(createElement(RubberStamp, { stamp }))
    expect(html).toContain('TOP SECRET')
    expect(html).toContain('CLASSIFIED')
  })
})
