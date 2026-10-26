import type { MapKind, MapPlate } from '../types'

export const MAP_KINDS: { id: MapKind; label: string }[] = [
  { id: 'area', label: 'Área' },
  { id: 'lz', label: 'LZ' },
  { id: 'pz', label: 'PZ' },
  { id: 'objective', label: 'Objetivo' },
  { id: 'other', label: 'Outro' },
]

export const CAPTION_PRESETS = ['Zoom', 'Drone', 'Mapa', 'Foto'] as const

/** Folha de mapa que aparece enquanto o pacote não tem nenhum mapa. */
export const EMPTY_MAP_ID = 'map-empty'

/**
 * O mapa que uma edição da folha altera. A folha vazia ganha um mapa na
 * primeira edição; um mapa removido não volta, nem quando a imagem que ainda
 * carregava chega depois da remoção.
 */
export function mapToEdit(maps: MapPlate[], plate: MapPlate): MapPlate | null {
  const found = maps.find((m) => m.id === plate.id)
  if (found) return found
  if (plate.id !== EMPTY_MAP_ID || maps.length) return null
  const created = { ...plate, id: `map-${crypto.randomUUID()}` }
  maps.push(created)
  return created
}

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
