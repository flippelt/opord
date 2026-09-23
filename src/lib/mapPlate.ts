import type { MapKind, MapPlate } from '../types'

export const MAP_KINDS: { id: MapKind; label: string }[] = [
  { id: 'area', label: 'Área' },
  { id: 'lz', label: 'LZ' },
  { id: 'pz', label: 'PZ' },
  { id: 'objective', label: 'Objetivo' },
  { id: 'other', label: 'Outro' },
]

export const CAPTION_PRESETS = ['Zoom', 'Drone', 'Mapa', 'Foto'] as const

export function inferMapKind(title: string): MapKind {
  const text = title.toUpperCase()
  if (/\bLZ\b/.test(text)) return 'lz'
  if (/\bPZ\b|\bEZ\b/.test(text)) return 'pz'
  if (/OBJETIVO|OBJECTIVE|\bALVO\b/.test(text)) return 'objective'
  if (/MAPA|\bMAP\b|\bAO\b|ÁREA|\bAREA\b/.test(text)) return 'area'
  return 'other'
}

export function isMapKind(value: string | undefined): value is MapKind {
  return MAP_KINDS.some((item) => item.id === value)
}

export function captionText(value: string | undefined, fallback: string) {
  const text = value?.trim()
  return text ? text : fallback
}

export function notesFor(plate: MapPlate, language: 'pt' | 'en'): [string, string][] {
  const en = language === 'en'
  const rows: [string, string][] = []
  const add = (label: string, text: string | undefined) => {
    const value = text?.trim()
    if (value) rows.push([label, value])
  }
  add(en ? 'Grid' : 'Localização no grid', plate.location)
  if (plate.kind === 'lz') {
    add(en ? 'Azimuth after landing' : 'Azimute após o desembarque', plate.azimuth)
  }
  if (plate.kind === 'pz') {
    add(en ? 'Marking' : 'Marcação', plate.marking)
    add(en ? 'Departure heading' : 'Proa de decolagem', plate.heading)
  }
  if (plate.kind === 'objective') {
    add(en ? 'Direction of entry' : 'Direção de entrada', plate.entry)
  }
  add(en ? 'Reference points' : 'Pontos de referência', plate.references)
  add(en ? 'Area notes' : 'Observações da região', plate.observations)
  return rows
}
