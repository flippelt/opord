import type { WatermarkColorMode, WatermarkFigure, WatermarkMode } from '../types'

const HEX = /^#[0-9a-fA-F]{6}$/

export function watermarkInk(mode: WatermarkColorMode, custom: string, fallback: string): string {
  if (mode !== 'custom') return fallback
  const color = custom.trim()
  return HEX.test(color) ? color : fallback
}

export function watermarkFigureSrc(figure: WatermarkFigure, logo: string, image: string): string {
  if (figure === 'logo') return logo
  if (figure === 'image') return image
  return ''
}

export function showDiagonalText(mode: WatermarkMode, textOnTop: boolean): boolean {
  return mode === 'diagonal' && textOnTop
}
