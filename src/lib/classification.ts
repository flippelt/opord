import type { Classification, DocType, Dossier, PageId, Precedence } from '../types'

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
  { id: 'conops', label: 'Conceito de Operações', short: 'CONOPS' },
  { id: 'comunicado', label: 'Comunicado interno', short: 'COMUNICADO' },
  { id: 'convocacao', label: 'Convocação / emprego', short: 'CONVOCAÇÃO' },
  { id: 'boletim', label: 'Boletim da unidade', short: 'BOLETIM' },
  { id: 'sitrep', label: 'Relatório de Situação', short: 'SITREP' },
  { id: 'aar', label: 'After Action Review', short: 'AAR' },
  { id: 'casevac', label: 'Pedido CASEVAC (9 linhas)', short: 'CASEVAC' },
  { id: 'hvt', label: 'Cartão de HVT', short: 'HVT' },
  { id: 'orbat', label: 'ORBAT / organização de tarefa', short: 'ORBAT' },
  { id: 'intel', label: 'Informe de Inteligência', short: 'INTEL' },
]

export const PAGE_LABELS: Record<PageId, string> = {
  cover: 'Capa',
  opord: 'OPORD',
  notice: 'Comunicado',
  sitrep: 'SITREP',
  aar: 'AAR',
  casevac: 'CASEVAC',
  hvt: 'HVT',
  orbat: 'ORBAT',
  map: 'Mapa',
  intel: 'Anexo intel',
  timeline: 'Linha do tempo',
  roster: 'Escalação',
}

export const TYPE_PAGE: Partial<Record<DocType, PageId>> = {
  opord: 'opord',
  frago: 'opord',
  warnord: 'opord',
  conops: 'opord',
  comunicado: 'notice',
  convocacao: 'notice',
  boletim: 'notice',
  sitrep: 'sitrep',
  aar: 'aar',
  casevac: 'casevac',
  hvt: 'hvt',
  orbat: 'orbat',
  intel: 'intel',
}

export const CASEVAC_LINES: { key: keyof import('../types').Dossier['casevac']; n: string; label: string; hint: string }[] =
  [
    { key: 'line1', n: '1', label: 'Local do PZ', hint: 'Grid do ponto de coleta' },
    { key: 'line2', n: '2', label: 'Freq. / indicativo', hint: 'Rede e callsign do pedido' },
    { key: 'line3', n: '3', label: 'Pacientes por precedência', hint: 'A urgente · B cirúrgico · C prioridade · D rotina · E conveniência' },
    { key: 'line4', n: '4', label: 'Equipamento especial', hint: 'A nenhum · B içamento · C extração · D ventilador' },
    { key: 'line5', n: '5', label: 'Pacientes por tipo', hint: 'L maca · A ambulante' },
    { key: 'line6', n: '6', label: 'Segurança no PZ', hint: 'N sem inimigo · P possível · E inimigo · X escolta armada' },
    { key: 'line7', n: '7', label: 'Marcação do PZ', hint: 'A painéis · B pirotécnico · C fumaça · D nenhum · E outro' },
    { key: 'line8', n: '8', label: 'Nacionalidade / status', hint: 'A mil. coligação · B civ. coligação · C mil. outro · D civ. outro · E EPW' },
    { key: 'line9', n: '9', label: 'NBC / terreno', hint: 'N nuclear · B biológico · C químico — ou descrição do terreno' },
  ]

export const NOTICE_TYPES: DocType[] = ['comunicado', 'convocacao', 'boletim']

export function isNoticeType(id: DocType): boolean {
  return NOTICE_TYPES.includes(id)
}

export const PRECEDENCE: { id: Precedence; label: string; nato: string }[] = [
  { id: 'flash', label: 'FLASH', nato: 'FLASH' },
  { id: 'immediate', label: 'IMEDIATO', nato: 'IMMEDIATE' },
  { id: 'priority', label: 'PRIORIDADE', nato: 'PRIORITY' },
  { id: 'routine', label: 'ROTINA', nato: 'ROUTINE' },
]

export const CAVEAT_OPTIONS = ['EYES ONLY', 'NOFORN', 'ORCON', 'WNINTEL'] as const

export function styleOf(id: Classification): ClassificationStyle {
  return CLASSIFICATIONS.find((c) => c.id === id) ?? CLASSIFICATIONS[2]
}

export function docTypeOf(id: DocType) {
  return DOC_TYPES.find((d) => d.id === id) ?? DOC_TYPES[0]
}

export function precedenceOf(id: Precedence) {
  return PRECEDENCE.find((p) => p.id === id) ?? PRECEDENCE[1]
}

export function relToMark(d: Dossier): string {
  const who = d.document.relTo.trim()
  if (!d.document.relToOn || !who) return ''
  return `REL TO ${who}`
}

export function classificationLine(d: Dossier): string {
  const c = styleOf(d.document.classification)
  const parts = [d.document.language === 'en' ? c.nato : c.label]
  if (d.document.caveats.length) parts.push(...d.document.caveats.filter((c) => !/^REL TO\b/i.test(c)))
  const rel = relToMark(d)
  if (rel) parts.push(rel)
  return parts.join(' // ')
}

export function handlingText(d: Dossier): string {
  const c = styleOf(d.document.classification)
  if (d.document.language === 'en') {
    return (
      `This document contains information classified ${c.nato}. ` +
      `Access is limited to personnel authorized by the unit. ` +
      `Reproduction, transmission, or storage on unapproved systems is prohibited. ` +
      `Destroy by burning, shredding, or any method that prevents reconstruction. ` +
      `Report loss at once to the S2 / security officer.`
    )
  }
  return (
    `Este documento contém informação confidencial: ${c.label} ` +
    `(equiv. NATO ${c.nato}). O acesso é restrito ao efetivo autorizado da unidade. ` +
    `É proibida a reprodução, transmissão ou armazenamento em sistemas não aprovados. ` +
    `Destruir por incineração, fragmentação ou meio que impeça a reconstrução. ` +
    `Relatar extravio imediatamente ao S2 / oficial de segurança.`
  )
}
