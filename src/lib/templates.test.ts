import { describe, expect, it } from 'vitest'
import { blankDossier, newDossier } from '../defaults'
import { applyTemplate, templatePages } from './templates'

describe('applyTemplate', () => {
  it('writes the script and leaves the pages and the clan alone', () => {
    const d = blankDossier()
    d.clan.sealSrc = 'logo.png'
    applyTemplate(d, 'assalto')
    expect(d.clan.sealSrc).toBe('logo.png')
    expect(d.body.mission.length).toBeGreaterThan(0)
    expect(d.body.commanderIntent.length).toBeGreaterThan(0)
    expect(d.timeline.map((t) => t.mark)).toEqual(['H-30', 'H-10', 'H', 'EXFIL'])
    expect(d.document.pages.timeline).toBe(false)
  })

  it('writes the skeleton in English when the paper is English', () => {
    const d = blankDossier()
    d.document.language = 'en'
    applyTemplate(d, 'recon')
    expect(d.mission.subject).toBe('Area reconnaissance')
  })
})

describe('new dossier with a template', () => {
  it('turns on only the pages chosen in the wizard, plus the type sheet', () => {
    const d = newDossier('opord', templatePages('comboio'), 'comboio')
    const on = Object.entries(d.document.pages).filter(([, v]) => v).map(([k]) => k).sort()
    expect(on).toEqual([...templatePages('comboio')].sort())
    expect(d.mission.subject).toBe('Escolta de comboio')
    expect(d.mission.name).toBe('')
  })

  it('stays empty without a template', () => {
    expect(newDossier('opord', ['cover', 'opord']).body.mission).toBe('')
  })
})
