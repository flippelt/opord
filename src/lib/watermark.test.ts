import { describe, expect, it } from 'vitest'
import { showDiagonalText, watermarkFigureSrc, watermarkInk } from './watermark'

describe('watermarkInk', () => {
  it('uses the classification color unless a custom hex is set', () => {
    expect(watermarkInk('classification', '#c9a227', '#b42318')).toBe('#b42318')
    expect(watermarkInk('custom', '#c9a227', '#b42318')).toBe('#c9a227')
    expect(watermarkInk('custom', 'dourado', '#b42318')).toBe('#b42318')
  })
})

describe('watermark figure and text', () => {
  it('picks the clan logo or a separate image', () => {
    expect(watermarkFigureSrc('none', 'logo.png', 'map.png')).toBe('')
    expect(watermarkFigureSrc('logo', 'logo.png', 'map.png')).toBe('logo.png')
    expect(watermarkFigureSrc('image', 'logo.png', 'map.png')).toBe('map.png')
  })

  it('keeps the diagonal word only when it should sit on top', () => {
    expect(showDiagonalText('diagonal', true)).toBe(true)
    expect(showDiagonalText('diagonal', false)).toBe(false)
    expect(showDiagonalText('tiled', false)).toBe(false)
    expect(showDiagonalText('none', true)).toBe(false)
  })
})
