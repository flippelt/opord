import type { Classification, DocType, Dossier, Precedence } from '../types'

export interface ClassificationStyle {
  id: Classification
  label: string
  nato: string
  banner: string
  ink: string
  cover: string
  coverInk: string
  stamp: string
}

export const CLASSIFICATIONS: ClassificationStyle[] = [
  {
    id: 'ostensivo',
    label: 'OSTENSIVO',
    nato: 'UNCLASSIFIED',
    banner: '#166534',
    ink: '#ffffff',
    cover: '#dcfce7',
    coverInk: '#14532d',
    stamp: '#166534',
  },
  {
    id: 'reservado',
    label: 'RESERVADO',
    nato: 'RESTRICTED',
    banner: '#1e3a8a',
    ink: '#ffffff',
    cover: '#dbeafe',
    coverInk: '#1e3a8a',
    stamp: '#1e3a8a',
  },
  {
    id: 'confidencial',
    label: 'CONFIDENCIAL',
    nato: 'CONFIDENTIAL',
    banner: '#9f1239',
    ink: '#ffffff',
    cover: '#c5d4e8',
    coverInk: '#1e3a5f',
    stamp: '#b42318',
  },
  {
    id: 'secreto',
    label: 'SECRETO',
    nato: 'SECRET',
    banner: '#7f1d1d',
    ink: '#ffffff',
    cover: '#f4c7c7',
    coverInk: '#7f1d1d',
    stamp: '#b42318',
  },
  {
    id: 'ultra-secreto',
    label: 'ULTRA-SECRETO',
    nato: 'TOP SECRET',
    banner: '#111111',
    ink: '#facc15',
    cover: '#f5d76e',
    coverInk: '#111111',
    stamp: '#9a3412',
  },
]

export const DOC_TYPES: { id: DocType; label: string; short: string }[] = [
  { id: 'opord', label: 'Ordem de Operações', short: 'OPORD' },
  { id: 'frago', label: 'Ordem Fragmentária', short: 'FRAGO' },
  { id: 'warnord', label: 'Ordem de Alerta', short: 'WARNORD' },
  { id: 'sitrep', label: 'Relatório de Situação', short: 'SITREP' },
  { id: 'intel', label: 'Informe de Inteligência', short: 'INTEL' },
  { id: 'conops', label: 'Conceito de Operações', short: 'CONOPS' },
]

export const PRECEDENCE: { id: Precedence; label: string; nato: string }[] = [
  { id: 'flash', label: 'FLASH', nato: 'FLASH' },
  { id: 'immediate', label: 'IMEDIATO', nato: 'IMMEDIATE' },
  { id: 'priority', label: 'PRIORIDADE', nato: 'PRIORITY' },
  { id: 'routine', label: 'ROTINA', nato: 'ROUTINE' },
]

export const CAVEAT_OPTIONS = [
  'EYES ONLY',
  'NOFORN',
  'ORCON',
  'WNINTEL',
  'REL TO UNIDADE',
] as const

export function styleOf(id: Classification): ClassificationStyle {
  return CLASSIFICATIONS.find((c) => c.id === id) ?? CLASSIFICATIONS[2]
}

export function docTypeOf(id: DocType) {
  return DOC_TYPES.find((d) => d.id === id) ?? DOC_TYPES[0]
}

export function precedenceOf(id: Precedence) {
  return PRECEDENCE.find((p) => p.id === id) ?? PRECEDENCE[1]
}

export function classificationLine(d: Dossier): string {
  const c = styleOf(d.document.classification)
  const parts = [c.label]
  if (d.document.caveats.length) parts.push(...d.document.caveats)
  return parts.join(' // ')
}

export function handlingText(d: Dossier): string {
  const c = styleOf(d.document.classification)
  return (
    `Este documento contém informação classificada como ${c.label} ` +
    `(equiv. NATO ${c.nato}). O acesso é restrito ao efetivo autorizado da unidade. ` +
    `É proibida a reprodução, transmissão ou armazenamento em sistemas não aprovados. ` +
    `Destruir por incineração, fragmentação ou meio que impeça a reconstrução. ` +
    `Relatar extravio imediatamente ao S2 / oficial de segurança.`
  )
}
