import { describe, expect, it } from 'vitest'
import { classificationLine, relToMark, styleOf } from './classification'
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
    d.document.relToOn = false
    expect(classificationLine(d)).toBe('SECRETO // EYES ONLY // NOFORN')
  })

  it('adds REL TO with the clan sigla', () => {
    const d = defaultDossier()
    expect(relToMark(d)).toBe('REL TO FALCÃO')
    expect(classificationLine(d)).toBe('CONFIDENCIAL // EYES ONLY // REL TO FALCÃO')
    d.document.relTo = '  '
    expect(relToMark(d)).toBe('')
  })
})
