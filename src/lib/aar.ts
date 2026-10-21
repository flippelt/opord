import type {
  AarAction,
  AarLoss,
  AceStatus,
  AarEventResult,
  AarObjectiveResult,
  Dossier,
  MapPlate,
  ObjectiveStatus,
  OrbatLine,
  TimelineEvent,
} from '../types'
import { MAP_KINDS } from './mapPlate'

export const OBJECTIVE_STATUS: { id: ObjectiveStatus; label: string }[] = [
  { id: '', label: 'Não avaliado' },
  { id: 'done', label: 'Cumprido' },
  { id: 'partial', label: 'Parcial' },
  { id: 'failed', label: 'Não cumprido' },
]

const OBJECTIVE_KINDS: MapPlate['kind'][] = ['lz', 'pz', 'objective']

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const DAY = 24 * 60

export function statusLabel(status: ObjectiveStatus): string {
  return OBJECTIVE_STATUS.find((s) => s.id === status)?.label ?? 'Não avaliado'
}

/** Marcos que valem para o AAR: os que têm evento ou DTG. */
export function aarTimeline(dossier: Dossier): TimelineEvent[] {
  return dossier.timeline.filter((row) => row.what.trim() || row.dtg.trim())
}

/** Mapas de LZ, PZ e objetivo viram as linhas de objetivos do AAR. */
export function aarObjectives(dossier: Dossier): MapPlate[] {
  return dossier.maps.filter((plate) => OBJECTIVE_KINDS.includes(plate.kind))
}

export function objectiveName(plate: MapPlate): string {
  return plate.title.trim() || MAP_KINDS.find((k) => k.id === plate.kind)?.label || 'Objetivo'
}

export function aarEvent(dossier: Dossier, id: string): AarEventResult {
  return dossier.aar.events[id] ?? { actual: '', note: '' }
}

export function aarObjective(dossier: Dossier, id: string): AarObjectiveResult {
  return dossier.aar.objectives[id] ?? { status: '', note: '' }
}

export const ACE_STATUS: { id: AceStatus; label: string }[] = [
  { id: '', label: '—' },
  { id: 'green', label: 'Verde' },
  { id: 'amber', label: 'Âmbar' },
  { id: 'red', label: 'Vermelho' },
]

export function aceLabel(status: AceStatus): string {
  return ACE_STATUS.find((s) => s.id === status)?.label ?? '—'
}

/** Elementos do ORBAT que entram no AAR (linhas com designação ou indicativo). */
export function aarElements(dossier: Dossier): OrbatLine[] {
  return dossier.orbat.filter((row) => row.designation.trim() || row.callsign.trim())
}

export function aarLoss(dossier: Dossier, id: string): AarLoss {
  return dossier.aar.losses[id] ?? { kia: '', wia: '', status: '' }
}

export function aarActions(dossier: Dossier): AarAction[] {
  return dossier.aar.actions.filter((a) => a.text.trim() || a.owner.trim())
}

export function hasAarExecution(dossier: Dossier): boolean {
  return (
    aarTimeline(dossier).length > 0 ||
    aarObjectives(dossier).length > 0 ||
    aarElements(dossier).length > 0 ||
    aarActions(dossier).length > 0
  )
}

type Clock = { minutes: number; zone: string; dated: boolean }

/** Lê um DTG (231402ZSEP26) ou só a hora (1402, 14:02). */
export function readClock(text: string): Clock | null {
  const value = text.trim().toUpperCase().replace(/\s+/g, '')
  const full = /^(\d{2})(\d{2})(\d{2})([A-Z])([A-Z]{3})(\d{2})$/.exec(value)
  if (full) {
    const [, day, h, m, zone, mon, yy] = full
    const month = MONTHS.indexOf(mon)
    if (month < 0 || Number(h) > 23 || Number(m) > 59) return null
    const ms = Date.UTC(2000 + Number(yy), month, Number(day), Number(h), Number(m))
    return { minutes: ms / 60000, zone, dated: true }
  }
  const short = /^(\d{2}):?(\d{2})([A-Z])?$/.exec(value)
  if (short) {
    const [, h, m, zone = ''] = short
    if (Number(h) > 23 || Number(m) > 59) return null
    return { minutes: Number(h) * 60 + Number(m), zone, dated: false }
  }
  return null
}

/** Minutos entre o planejado e o real; null quando não dá para comparar. */
export function clockDelta(planned: string, actual: string): number | null {
  const a = readClock(planned)
  const b = readClock(actual)
  if (!a || !b) return null
  if (a.zone && b.zone && a.zone !== b.zone) return null
  if (a.dated && b.dated) return b.minutes - a.minutes
  const diff = (b.minutes % DAY) - (a.minutes % DAY)
  if (diff > DAY / 2) return diff - DAY
  if (diff < -DAY / 2) return diff + DAY
  return diff
}

export function formatDelta(minutes: number | null): string {
  if (minutes === null) return '—'
  if (minutes === 0) return 'no horário'
  const sign = minutes > 0 ? '+' : '−'
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  if (!h) return `${sign}${m} min`
  return m ? `${sign}${h} h ${m.toString().padStart(2, '0')} min` : `${sign}${h} h`
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function isStatus(value: unknown): value is ObjectiveStatus {
  return OBJECTIVE_STATUS.some((s) => s.id === value)
}

/** Limpa o que veio de um JSON: só objetos com campos de texto passam. */
export function normalizeAarResults(incoming: unknown): {
  events: Record<string, AarEventResult>
  objectives: Record<string, AarObjectiveResult>
  losses: Record<string, AarLoss>
  actions: AarAction[]
} {
  const raw = (incoming && typeof incoming === 'object' ? incoming : {}) as {
    events?: unknown
    objectives?: unknown
    losses?: unknown
    actions?: unknown
  }
  const losses: Record<string, AarLoss> = {}
  if (raw.losses && typeof raw.losses === 'object') {
    for (const [id, value] of Object.entries(raw.losses as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue
      const row = value as Record<string, unknown>
      const status = ACE_STATUS.some((s) => s.id === row.status) ? (row.status as AceStatus) : ''
      losses[id] = { kia: text(row.kia), wia: text(row.wia), status }
    }
  }
  const actions: AarAction[] = Array.isArray(raw.actions)
    ? raw.actions
        .filter((a): a is Record<string, unknown> => Boolean(a) && typeof a === 'object')
        .map((a, i) => ({
          id: text(a.id) || `act-${i + 1}`,
          kind: a.kind === 'sustain' ? 'sustain' : 'improve',
          text: text(a.text),
          owner: text(a.owner),
        }))
    : []
  const events: Record<string, AarEventResult> = {}
  const objectives: Record<string, AarObjectiveResult> = {}
  if (raw.events && typeof raw.events === 'object') {
    for (const [id, value] of Object.entries(raw.events as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue
      const row = value as Record<string, unknown>
      events[id] = { actual: text(row.actual), note: text(row.note) }
    }
  }
  if (raw.objectives && typeof raw.objectives === 'object') {
    for (const [id, value] of Object.entries(raw.objectives as Record<string, unknown>)) {
      if (!value || typeof value !== 'object') continue
      const row = value as Record<string, unknown>
      objectives[id] = { status: isStatus(row.status) ? row.status : '', note: text(row.note) }
    }
  }
  return { events, objectives, losses, actions }
}
