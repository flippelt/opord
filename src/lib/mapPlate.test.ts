import { describe, expect, it } from 'vitest'
import { emptyMapPlate } from '../defaults'
import { EMPTY_MAP_ID, inferMapKind, mapToEdit, notesFor } from './mapPlate'

describe('inferMapKind', () => {
  it('reads the place from the title', () => {
    expect(inferMapKind('LZ HAWK')).toBe('lz')
    expect(inferMapKind('PZ RAVEN')).toBe('pz')
    expect(inferMapKind('EZ NORTH')).toBe('pz')
    expect(inferMapKind('OBJETIVO — BLOCO C2')).toBe('objective')
    expect(inferMapKind('MAPA — AO SUL')).toBe('area')
    expect(inferMapKind('Croqui')).toBe('other')
  })
})

describe('notesFor', () => {
  it('shows the post-landing azimuth on an LZ only', () => {
    const lz = emptyMapPlate('LZ HAWK')
    lz.kind = 'lz'
    lz.location = '166127'
    lz.azimuth = '090'
    const labels = notesFor(lz, 'pt').map(([label]) => label)
    expect(labels).toEqual([
      'Localização no grid',
      'Azimute após o desembarque',
    ])

    const area = emptyMapPlate('MAPA — AO SUL')
    area.kind = 'area'
    area.azimuth = '090'
    area.location = '169128'
    area.references = 'Pyrgos'
    expect(notesFor(area, 'pt').map(([label]) => label)).not.toContain('Azimute após o desembarque')
  })

  it('uses pickup facts and an entry direction where they belong', () => {
    const pz = emptyMapPlate('PZ RAVEN')
    pz.kind = 'pz'
    pz.marking = 'Fumaça verde'
    pz.heading = '270'
    pz.azimuth = '090'
    expect(notesFor(pz, 'en').map(([label]) => label)).toEqual(['Marking', 'Departure heading'])

    const objective = emptyMapPlate('OBJETIVO')
    objective.kind = 'objective'
    objective.entry = 'Noroeste'
    expect(notesFor(objective, 'pt').map(([label]) => label)).toEqual(['Direção de entrada'])
  })
})

describe('mapToEdit', () => {
  it('edits the saved map with the same id', () => {
    const plate = emptyMapPlate('LZ HAWK')
    const maps = [plate]
    expect(mapToEdit(maps, { ...plate })).toBe(plate)
    expect(maps).toHaveLength(1)
  })

  it('adds a map when the empty sheet is edited', () => {
    const maps: ReturnType<typeof emptyMapPlate>[] = []
    const created = mapToEdit(maps, { ...emptyMapPlate(), id: EMPTY_MAP_ID })
    expect(maps).toEqual([created])
    expect(created?.id).not.toBe(EMPTY_MAP_ID)
  })

  it('does not bring back a removed map when its image arrives late', () => {
    const removed = emptyMapPlate('LZ HAWK')
    const other = emptyMapPlate('PZ RAVEN')
    const maps = [other]
    expect(mapToEdit(maps, removed)).toBeNull()
    expect(mapToEdit([], removed)).toBeNull()
    expect(maps).toEqual([other])
  })

  it('does not add a second map from the empty sheet once one exists', () => {
    const maps = [emptyMapPlate('LZ HAWK')]
    expect(mapToEdit(maps, { ...emptyMapPlate(), id: EMPTY_MAP_ID })).toBeNull()
    expect(maps).toHaveLength(1)
  })
})
