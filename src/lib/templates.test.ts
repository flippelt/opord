import { describe, expect, it } from 'vitest'
import { blankDossier } from '../defaults'
import { applyTemplate } from './templates'

describe('applyTemplate', () => {
  it('keeps the clan logo and turns on the assault packet', () => {
    const d = blankDossier()
    d.clan.sealSrc = 'logo.png'
    d.document.pages.opord = false
    applyTemplate(d, 'assalto')
    expect(d.clan.sealSrc).toBe('logo.png')
    expect(d.document.pages.cover).toBe(true)
    expect(d.document.pages.opord).toBe(true)
    expect(d.document.pages.timeline).toBe(true)
    expect(d.body.mission.length).toBeGreaterThan(0)
  })

  it('writes the skeleton in English when the paper is English', () => {
    const d = blankDossier()
    d.document.language = 'en'
    applyTemplate(d, 'recon')
    expect(d.mission.subject).toBe('Area reconnaissance')
  })
})
