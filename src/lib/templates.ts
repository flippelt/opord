import type { Dossier, PageId, TimelineEvent } from '../types'

export type MissionTemplate = 'assalto' | 'defesa' | 'comboio' | 'recon'

type Pack = {
  pages: PageId[]
  mission: Partial<Dossier['mission']>
  body: Partial<Dossier['body']>
  timeline: TimelineEvent[]
}

const pages = {
  fight: ['cover', 'opord', 'timeline', 'roster', 'orbat'] as PageId[],
  recon: ['cover', 'opord', 'timeline', 'intel', 'sitrep'] as PageId[],
}

function marks(items: [string, string][]): TimelineEvent[] {
  return items.map(([mark, what], i) => ({ id: `tpl-${i + 1}`, mark, what, dtg: '' }))
}

const pt: Record<MissionTemplate, Pack> = {
  assalto: {
    pages: pages.fight,
    mission: {
      name: '',
      subject: 'Assalto a objetivo limitado',
      hHour: '',
      ao: '',
      grid: '',
      terrain: '',
    },
    body: {
      situationEnemy: 'Força, posição, sentinelas e reserva do objetivo.',
      situationFriendly: 'Quem ataca, quem isola, QRF e apoio.',
      situationAttachments: 'Meios anexados e destacáveis.',
      situationWeather: 'Luz, vento, visibilidade. NVG a partir de quando.',
      mission: 'Quem ataca, NLT quando, onde, para quê.',
      executionConcept: 'Infiltração, isolamento, assalto na hora-H, consolidação, extração.',
      executionTasks: 'Tarefa de cada esquadra.',
      executionCoord: 'H-30, H-10, hora-H, sinais de extração, limites que não se cruzam.',
      sustainment: 'Munição, água, CASEVAC, prisioneiros.',
      commandSignal: 'Quem comanda no terreno, sucessão e redes.',
      roe: 'Armas em HOLD até PID. HVT vivo se viável. Sem fogo sobre civis.',
    },
    timeline: marks([
      ['H-30', 'Check-in no ponto de reunião'],
      ['H-10', 'Isolamento'],
      ['H', 'Assalto'],
      ['EXFIL', 'Extração'],
    ]),
  },
  defesa: {
    pages: pages.fight,
    mission: { subject: 'Defesa de setor', name: '' },
    body: {
      situationEnemy: 'Direção provável do ataque e força estimada.',
      situationFriendly: 'Setores, reserva e QRF.',
      situationAttachments: 'Apoio de fogos e observação.',
      situationWeather: 'Luz e campos de visão.',
      mission: 'Quem defende, de quando a quando, qual setor, para quê.',
      executionConcept: 'Segurança, setores de tiro, reserva, contra-ataque.',
      executionTasks: 'Limite de cada elemento e quem cobre o intervalo.',
      executionCoord: 'Sinais de alarme, hora de ocupar e critério para romper contato.',
      sustainment: 'Munição de defesa, água, CASEVAC, rodízio.',
      commandSignal: 'PC, sucessão e rede de alarme.',
      roe: 'Fogo só com PID dentro do setor. Sem perseguir além do limite.',
    },
    timeline: marks([
      ['H-60', 'Ocupar posições'],
      ['H-15', 'Prontos'],
      ['H', 'Início da vigília'],
      ['FIM', 'Revezamento ou recolhimento'],
    ]),
  },
  comboio: {
    pages: [...pages.fight, 'casevac'],
    mission: { subject: 'Escolta de comboio', name: '' },
    body: {
      situationEnemy: 'Ameaças na rota: emboscada, IED, bloqueio.',
      situationFriendly: 'Ordem de marcha, vanguarda, corpo, retaguarda.',
      situationAttachments: 'Reconhecimento à frente e CASEVAC.',
      situationWeather: 'Piso, visibilidade, trechos sem cobertura.',
      mission: 'Quem escolta, de onde aonde, NLT quando, o que protege.',
      executionConcept: 'Marcha, halts, reação a contato, ponto de reunião.',
      executionTasks: 'Quem abre, quem fecha, quem fica com a carga.',
      executionCoord: 'Velocidade, intervalos, pontos de controle, desvios.',
      sustainment: 'Combustível, reboque, CASEVAC ao longo da rota.',
      commandSignal: 'Rede do comboio e sucessão se o líder parar.',
      roe: 'PID antes do fogo. Não abandonar a carga. Halt só sob ordem.',
    },
    timeline: marks([
      ['SP', 'Ponto de partida'],
      ['CP1', 'Primeiro ponto de controle'],
      ['RP', 'Ponto de liberação'],
    ]),
  },
  recon: {
    pages: pages.recon,
    mission: { subject: 'Reconhecimento de área', name: '' },
    body: {
      situationEnemy: 'O que se espera encontrar e o que já se sabe.',
      situationFriendly: 'Quem observa, quem dá segurança, para onde reportar.',
      situationAttachments: 'Ópticos, UAV, o que não levar.',
      situationWeather: 'Luz para observar e para sair.',
      mission: 'Quem reconhece, NLT quando, qual área, que informação trazer.',
      executionConcept: 'Infiltração, observação, registro, extração sem contato.',
      executionTasks: 'Posto de observação, segurança e corredor de saída.',
      executionCoord: 'PIR, hora de reportar, critério de abortar.',
      sustainment: 'Água, silêncio de rádio, sem deixar material.',
      commandSignal: 'Rede só para o SITREP combinado.',
      roe: 'Evitar contato. Fogo só para romper e sair.',
    },
    timeline: marks([
      ['IN', 'Infiltração'],
      ['OBS', 'No posto de observação'],
      ['REP', 'Reportar'],
      ['OUT', 'Extração'],
    ]),
  },
}

const en: Record<MissionTemplate, Pack> = {
  assalto: {
    ...pt.assalto,
    mission: { ...pt.assalto.mission, subject: 'Limited assault' },
    body: {
      situationEnemy: 'Strength, position, sentries and reserve at the objective.',
      situationFriendly: 'Who assaults, who isolates, QRF and support.',
      situationAttachments: 'Attachments and detachments.',
      situationWeather: 'Light, wind, visibility. NVGs from when.',
      mission: 'Who attacks, NLT when, where, and why.',
      executionConcept: 'Infiltration, isolation, assault at H-hour, consolidation, extraction.',
      executionTasks: 'Task of each squad.',
      executionCoord: 'H-30, H-10, H-hour, extraction signals, boundaries.',
      sustainment: 'Ammunition, water, CASEVAC, prisoners.',
      commandSignal: 'Who commands on the ground, succession and nets.',
      roe: 'Weapons HOLD until PID. HVT alive if feasible. No fire on civilians.',
    },
    timeline: marks([
      ['H-30', 'Check in at the rally point'],
      ['H-10', 'Isolation'],
      ['H', 'Assault'],
      ['EXFIL', 'Extraction'],
    ]),
  },
  defesa: {
    ...pt.defesa,
    mission: { subject: 'Sector defense', name: '' },
    body: {
      situationEnemy: 'Likely attack direction and estimated strength.',
      situationFriendly: 'Sectors, reserve and QRF.',
      situationAttachments: 'Fires and observation.',
      situationWeather: 'Light and fields of view.',
      mission: 'Who defends, from when to when, which sector, and why.',
      executionConcept: 'Security, sectors of fire, reserve, counterattack.',
      executionTasks: 'Each element’s boundary and who covers the gap.',
      executionCoord: 'Alarm signals, time to occupy, break-contact criteria.',
      sustainment: 'Defense ammunition, water, CASEVAC, relief.',
      commandSignal: 'CP, succession and alarm net.',
      roe: 'Fire only with PID inside the sector. Do not pursue past the limit.',
    },
  },
  comboio: {
    ...pt.comboio,
    mission: { subject: 'Convoy escort', name: '' },
    body: {
      situationEnemy: 'Threats on the route: ambush, IED, blockade.',
      situationFriendly: 'Order of march: van, main body, trail.',
      situationAttachments: 'Recon ahead and CASEVAC.',
      situationWeather: 'Road, visibility, uncovered stretches.',
      mission: 'Who escorts, from where to where, NLT when, what is protected.',
      executionConcept: 'March, halts, actions on contact, rally point.',
      executionTasks: 'Who leads, who trails, who stays with the cargo.',
      executionCoord: 'Speed, intervals, checkpoints, bypasses.',
      sustainment: 'Fuel, recovery, CASEVAC along the route.',
      commandSignal: 'Convoy net and succession if the leader stops.',
      roe: 'PID before fire. Do not abandon the cargo. Halt only on order.',
    },
  },
  recon: {
    ...pt.recon,
    mission: { subject: 'Area reconnaissance', name: '' },
    body: {
      situationEnemy: 'What is expected and what is already known.',
      situationFriendly: 'Who observes, who secures, where to report.',
      situationAttachments: 'Optics, UAV, what to leave behind.',
      situationWeather: 'Light to watch and light to leave.',
      mission: 'Who reconnoiters, NLT when, which area, what information to bring back.',
      executionConcept: 'Infiltration, observation, record, extraction without contact.',
      executionTasks: 'Observation post, security and exit corridor.',
      executionCoord: 'PIR, report time, abort criteria.',
      sustainment: 'Water, radio silence, leave nothing behind.',
      commandSignal: 'Net only for the scheduled SITREP.',
      roe: 'Avoid contact. Fire only to break contact and leave.',
    },
  },
}

export const TEMPLATE_CHOICES: { id: MissionTemplate; pt: string; en: string }[] = [
  { id: 'assalto', pt: 'Assalto', en: 'Assault' },
  { id: 'defesa', pt: 'Defesa', en: 'Defense' },
  { id: 'comboio', pt: 'Comboio', en: 'Convoy' },
  { id: 'recon', pt: 'Reconhecimento', en: 'Recon' },
]

export function applyTemplate(d: Dossier, id: MissionTemplate): void {
  const pack = (d.document.language === 'en' ? en : pt)[id]
  d.mission = { ...d.mission, ...pack.mission }
  d.body = { ...d.body, ...pack.body }
  d.timeline = pack.timeline.map((row) => ({ ...row }))
  d.document.pages.cover = true
  for (const page of pack.pages) d.document.pages[page] = true
}
