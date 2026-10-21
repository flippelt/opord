import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { blankDossier, defaultDossier, migrateDossier } from '../../defaults'
import { SignBlock } from './DocumentChrome'

const html = (d: ReturnType<typeof defaultDossier>) => renderToStaticMarkup(createElement(SignBlock, { dossier: d }))

describe('SignBlock', () => {
  it('uses the clan seal by default and signs in a cursive font in the example', () => {
    const out = html(defaultDossier())
    expect(out).toContain('data-edit="command.mark clan.seal"')
    expect(out).toContain('class="op-sign-signature"')
    expect(out).toContain("Mrs Saint Delafield")
    expect(out).toContain('>A. Mendes<')
  })

  it('falls back to the signer name and leaves the line empty without signature', () => {
    const d = defaultDossier()
    d.command.signatureText = ''
    expect(html(d)).toContain('>A. MENDES<')
    d.command.signature = 'none'
    expect(html(d)).not.toContain('op-sign-signature')
  })

  it('shows the photo and keeps the clan seal when the insignia is missing', () => {
    const d = defaultDossier()
    d.command.mark = 'avatar'
    d.command.avatarSrc = 'data:image/png;base64,AAAA'
    expect(html(d)).toContain('class="sign-avatar"')
    d.command.mark = 'insignia'
    d.command.insignia = 'xx/none'
    expect(html(d)).toContain('clan.seal')
  })

  it('gives old dossiers the new signature fields', () => {
    const raw = structuredClone(blankDossier()) as unknown as { command: Record<string, unknown> }
    raw.command = { commander: 'X', rank: 'SGT', billet: '', callsign: '', mark: 'bogus' }
    const next = migrateDossier(raw)
    expect(next?.command.mark).toBe('clan')
    expect(next?.command.signature).toBe('none')
    expect(next?.command.signatureFont).toBe('mrs-saint-delafield')
  })
})
