export type Classification =
  | 'ostensivo'
  | 'reservado'
  | 'confidencial'
  | 'secreto'
  | 'ultra-secreto'

export type DocType =
  | 'opord'
  | 'frago'
  | 'warnord'
  | 'sitrep'
  | 'intel'
  | 'conops'
  | 'comunicado'
  | 'convocacao'
  | 'boletim'

export type Precedence = 'flash' | 'immediate' | 'priority' | 'routine'

export type WatermarkMode = 'none' | 'diagonal' | 'tiled'

export type StampKind = 'oval' | 'box' | 'round'

export type PageId = 'cover' | 'opord' | 'notice' | 'sitrep' | 'intel'

export interface StampConfig {
  id: string
  kind: StampKind
  title: string
  subtitle: string
  enabled: boolean
  rotate: number
  x: number
  y: number
  page: PageId | 'all'
  color: string
  size: number
}

export interface IntelPhoto {
  id: string
  src: string
  caption: string
  grid: string
  source: string
  dtg: string
}

export interface NetRow {
  id: string
  name: string
  freq: string
  callsign: string
}

export interface Dossier {
  version: 1
  clan: {
    name: string
    shortName: string
    motto: string
    sealSrc: string
    patchSrc: string
  }
  document: {
    type: DocType
    classification: Classification
    caveats: string[]
    copyNumber: string
    copyTotal: string
    controlNumber: string
    pages: Record<PageId, boolean>
  }
  header: {
    origin: string
    destination: string
    info: string
    precedence: Precedence
    dtg: string
    place: string
    orderNumber: string
    mapSheet: string
    timeZone: string
  }
  mission: {
    name: string
    nickname: string
    subject: string
    hHour: string
    ao: string
    grid: string
    terrain: string
  }
  body: {
    situationEnemy: string
    situationFriendly: string
    situationAttachments: string
    situationWeather: string
    mission: string
    executionConcept: string
    executionTasks: string
    executionCoord: string
    sustainment: string
    commandSignal: string
    roe: string
  }
  command: {
    commander: string
    rank: string
    billet: string
    callsign: string
  }
  comms: {
    nets: NetRow[]
    challenge: string
    password: string
    succession: string
  }
  intel: IntelPhoto[]
  notice: {
    number: string
    audience: string
    subject: string
    body: string
    orders: string
    validFrom: string
    validUntil: string
    distribution: string
    eventDtg: string
    server: string
    mods: string
    slotting: string
    uniform: string
    attendance: string
    rally: string
  }
  sitrep: {
    period: string
    enemy: string
    friendly: string
    own: string
    issues: string
    intent: string
  }
  marks: {
    watermarkMode: WatermarkMode
    watermarkText: string
    stamps: StampConfig[]
  }
}
