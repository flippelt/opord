import { describe, expect, it } from 'vitest'
import { classificationLine, styleOf } from './classification'
import { defaultDossier } from '../defaults'

describe('styleOf', () => {
  it('maps confidencial to the classic red stamp', () => {
    expect(styleOf('confidencial').stamp).toBe('#b42318')
    expect(styleOf('confidencial').nato).toBe('CONFIDENTIAL')
  })

  it('falls back to confidencial on unknown id', () => {
    expect(styleOf('nope' as never).id).toBe('confidencial')
  })
})

describe('classificationLine', () => {
  it('joins label and caveats', () => {
    const d = structuredClone(defaultDossier())
    d.document.classification = 'secreto'
    d.document.caveats = ['EYES ONLY', 'NOFORN']
    expect(classificationLine(d)).toBe('SECRETO // EYES ONLY // NOFORN')
  })
})
