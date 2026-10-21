import { describe, expect, it } from 'vitest'
import { blankDossier, defaultDossier, migrateDossier } from '../defaults'
import { annexLetter, annexList } from './annexes'

describe('annexList', () => {
  it('letters the pack sheets after the order, grouping maps and HVT cards', () => {
    const list = annexList(defaultDossier())
    expect(list.map((a) => a.letter)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
    expect(list.map((a) => a.kind)).toEqual(['timeline', 'roster', 'orbat', 'hvt', 'casevac', 'map', 'blank', 'intel'])
    expect(list.find((a) => a.kind === 'blank')?.label).toBe('CROQUI DO PZ')
    expect(annexLetter(defaultDossier(), 'intel')).toBe('H')
  })

  it('leaves out the cover, the order and the separate reports', () => {
    const kinds = annexList(defaultDossier()).map((a) => a.kind)
    for (const kind of ['cover', 'notice', 'opord', 'sitrep', 'aar']) expect(kinds).not.toContain(kind)
    expect(annexList(blankDossier())).toEqual([])
  })

  it('drops a letter the person already wrote in a blank page title', () => {
    const d = defaultDossier()
    d.blanks[0].title = 'ANEXO C — CROQUI DO PZ'
    expect(annexList(d).find((a) => a.kind === 'blank')?.label).toBe('CROQUI DO PZ')
  })
})

describe('doctrine fields', () => {
  it('opens an old dossier with the new fields empty and acknowledge on', () => {
    const raw = structuredClone(defaultDossier()) as unknown as {
      body: Record<string, unknown>
      comms: Record<string, unknown>
    }
    for (const k of ['commanderIntent', 'situationCivil', 'enemyCoa', 'acknowledge', 'distribution']) delete raw.body[k]
    for (const k of ['commandPost', 'visualSignals', 'recognition', 'runningPassword', 'codeWords']) delete raw.comms[k]
    const next = migrateDossier(raw)
    expect(next?.body.commanderIntent).toBe('')
    expect(next?.body.acknowledge).toBe(true)
    expect(next?.comms.codeWords).toEqual([])
    expect(next?.comms.runningPassword).toBe('')
  })

  it('drops broken code words', () => {
    const raw = structuredClone(defaultDossier()) as unknown as { comms: { codeWords: unknown } }
    raw.comms.codeWords = [{ id: 'a', word: 'X', meaning: 'Y' }, null, { id: 'b', word: 3 }]
    expect(migrateDossier(raw)?.comms.codeWords).toEqual([{ id: 'a', word: 'X', meaning: 'Y' }])
  })
})
