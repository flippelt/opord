import type { Dossier, StampConfig } from './types'
import { nowDtg } from './lib/dtg'

export function defaultStamps(): StampConfig[] {
  return [
    {
      id: 'confidential',
      kind: 'oval',
      title: 'CONFIDENCIAL',
      subtitle: 'CLASSIFIED',
      enabled: false,
      rotate: -16,
      x: 72,
      y: 58,
      page: 'cover',
      color: '#b42318',
      size: 210,
    },
    {
      id: 'eyes',
      kind: 'box',
      title: 'EYES ONLY',
      subtitle: 'SOMENTE AUTORIZADOS',
      enabled: true,
      rotate: 8,
      x: 8,
      y: 78,
      page: 'cover',
      color: '#b42318',
      size: 170,
    },
    {
      id: 'copy',
      kind: 'round',
      title: 'CÓPIA',
      subtitle: '',
      enabled: false,
      rotate: -6,
      x: 78,
      y: 72,
      page: 'opord',
      color: '#b42318',
      size: 120,
    },
    {
      id: 'destroy',
      kind: 'box',
      title: 'DESTROY',
      subtitle: 'AFTER ACTION',
      enabled: false,
      rotate: 12,
      x: 62,
      y: 82,
      page: 'opord',
      color: '#7f1d1d',
      size: 160,
    },
    {
      id: 'working',
      kind: 'box',
      title: 'WORKING PAPERS',
      subtitle: 'RASCUNHO CONTROLADO',
      enabled: false,
      rotate: -8,
      x: 10,
      y: 18,
      page: 'all',
      color: '#1e3a8a',
      size: 180,
    },
    {
      id: 'orcon',
      kind: 'box',
      title: 'ORCON',
      subtitle: 'ORIGINATOR CONTROLLED',
      enabled: false,
      rotate: 4,
      x: 6,
      y: 62,
      page: 'intel',
      color: '#9a3412',
      size: 150,
    },
    {
      id: 'verified',
      kind: 'oval',
      title: 'VERIFICADO',
      subtitle: 'S2 / S3',
      enabled: false,
      rotate: -10,
      x: 68,
      y: 80,
      page: 'opord',
      color: '#166534',
      size: 150,
    },
  ]
}

export function blankDossier(): Dossier {
  return {
    version: 1,
    clan: {
      name: '',
      shortName: '',
      motto: '',
      sealSrc: '',
      patchSrc: '',
    },
    document: {
      type: 'opord',
      classification: 'confidencial',
      caveats: ['EYES ONLY'],
      copyNumber: '01',
      copyTotal: '04',
      controlNumber: '',
      pages: {
        cover: true,
        opord: true,
        notice: true,
        sitrep: false,
        intel: true,
        aar: false,
        casevac: false,
        hvt: false,
        orbat: false,
      },
    },
    header: {
      origin: '',
      destination: '',
      info: '',
      precedence: 'immediate',
      dtg: nowDtg(),
      place: '',
      orderNumber: '',
      mapSheet: '',
      timeZone: 'ZULU (UTC)',
    },
    mission: {
      name: '',
      nickname: '',
      subject: '',
      hHour: '',
      ao: '',
      grid: '',
      terrain: '',
    },
    body: {
      situationEnemy: '',
      situationFriendly: '',
      situationAttachments: '',
      situationWeather: '',
      mission: '',
      executionConcept: '',
      executionTasks: '',
      executionCoord: '',
      sustainment: '',
      commandSignal: '',
      roe: '',
    },
    command: {
      commander: '',
      rank: '',
      billet: '',
      callsign: '',
    },
    comms: {
      nets: [
        { id: 'n1', name: 'COMANDO', freq: '', callsign: '' },
        { id: 'n2', name: 'TÁTICA', freq: '', callsign: '' },
        { id: 'n3', name: 'APOIO', freq: '', callsign: '' },
        { id: 'n4', name: 'CASEVAC', freq: '', callsign: '' },
      ],
      challenge: '',
      password: '',
      succession: '',
    },
    intel: emptyIntelSlots(),
    notice: blankNotice(),
    sitrep: blankSitrep(),
    aar: blankAar(),
    casevac: blankCasevac(),
    hvts: emptyHvtSlots(),
    orbat: emptyOrbatLines(),
    marks: {
      watermarkMode: 'diagonal',
      watermarkText: '',
      stamps: defaultStamps(),
    },
  }
}

export function blankNotice() {
  return {
    number: '',
    audience: '',
    subject: '',
    body: '',
    orders: '',
    validFrom: '',
    validUntil: '',
    distribution: '',
    eventDtg: '',
    server: '',
    mods: '',
    slotting: '',
    uniform: '',
    attendance: '',
    rally: '',
  }
}

export function blankSitrep() {
  return {
    period: '',
    enemy: '',
    friendly: '',
    own: '',
    issues: '',
    intent: '',
  }
}

export function blankAar() {
  return {
    dtg: '',
    location: '',
    summary: '',
    wentWell: '',
    wentWrong: '',
    lessons: '',
    sustain: '',
    improve: '',
    casualties: '',
    bda: '',
  }
}

export function blankCasevac() {
  return {
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    line5: '',
    line6: '',
    line7: '',
    line8: '',
    line9: '',
    remarks: '',
  }
}

export function emptyHvtSlots() {
  return [
    {
      id: 'hvt-1',
      name: '',
      alias: '',
      role: '',
      nationality: '',
      lastSeen: '',
      grid: '',
      description: '',
      weapons: '',
      associates: '',
      guidance: '',
      status: 'CAPTURE',
      photoSrc: '',
    },
  ]
}

export function emptyOrbatLines() {
  return [
    {
      id: 'orbat-1',
      echelon: '',
      designation: '',
      callsign: '',
      lead: '',
      strength: '',
      task: '',
    },
  ]
}

export function emptyIntelSlots() {
  return [0, 1, 2, 3].map((i) => ({
    id: `intel-${i + 1}`,
    src: '',
    caption: '',
    grid: '',
    source: i === 0 ? 'UAV' : i === 1 ? 'SAT' : i === 2 ? 'RECON' : 'HUMINT',
    dtg: '',
  }))
}

export function defaultDossier(): Dossier {
  const d = blankDossier()
  d.clan = {
    name: 'Grupo de Operações Falcão',
    shortName: 'FALCÃO',
    motto: 'Quem vê primeiro, age primeiro',
    sealSrc: '',
    patchSrc: '',
  }
  d.document.controlNumber = 'FALCAO-23-09-04'
  d.document.copyNumber = '01'
  d.document.copyTotal = '04'
  d.document.caveats = ['EYES ONLY', 'REL TO UNIDADE']
  d.header = {
    origin: 'S3 / 2º BATALHÃO',
    destination: '2º PELOTÃO / CIA BRAVO',
    info: 'COMANDO DA CIA B; QRF; S2',
    precedence: 'immediate',
    dtg: '221845ZSEP26',
    place: 'FOB KAMINO, ALTIS',
    orderNumber: '23-09-04',
    mapSheet: 'Altis 1:25 000, edição milsim',
    timeZone: 'ZULU (UTC)',
  }
  d.mission = {
    name: 'SERPENTE NEGRA',
    nickname: 'BLACK ADDER',
    subject: 'Assalto ao complexo C2 em Pyrgos e captura do HVT VIPER',
    hHour: '230200ZSEP26',
    ao: 'AO SUL — Pyrgos e adjacências',
    grid: '142-089 (centro); alvo 14208930',
    terrain: 'Urbano litorâneo, vias estreitas, iluminação residual',
  }
  d.body = {
    situationEnemy:
      'Pelotão CSAT reforçado (~24) no complexo administrativo de Pyrgos. 2x técnicos de C2, 1x HVT "VIPER" (oficial de comunicações), 1x BTR em sobreaviso a 400 m N, sentinelas em telhado nos azimutes 040 e 220. Patrulha a pé a cada 20 min na via principal.',
    situationFriendly:
      '2º Pelotão (3x esquadras + SL). Em apoio: 1x UAV, 1x FAC, 1x elemento CASEVAC em PZ RAVEN. QRF (1º Pel) em 8 min a partir de FOB Kamino.',
    situationAttachments:
      'Anexado: 1x médico de Cia, 1x operador UAV. Destacável: nenhum. Prioridade de fogos: 81 mm em grid 142091 sob pedido do FAC.',
    situationWeather:
      'Noite sem lua, teto 800 m, vento 6 kn de 270, visibilidade 4 km. Maré irrelevante. NVG autorizados a partir de H-30.',
    mission:
      'O 2º Pelotão ataca NLT 230200ZSEP26 o complexo CSAT em Pyrgos (grid 14208930) para neutralizar a estação de C2 e capturar o HVT VIPER, a fim de degradar a rede de comando inimiga na AO SUL.',
    executionConcept:
      'Infiltração noturna em LZ HAWK (138086), movimento dissimulado por eixos leste, isolamento do complexo, assalto em TOT 230200Z, consolidação e extração por PZ RAVEN (146092). Critério de êxito: C2 fora de ação e HVT sob custódia ou BDA confirmada.',
    executionTasks:
      '1ª Esq: assalto ao bloco norte (C2). 2ª Esq: isolamento sul e corte da via do BTR. 3ª Esq: reserva / detenção do HVT. UAV: órbita 300 m AGL, PIR em sentinelas e reforço. FAC: prioridade no BTR se sair da garagem.',
    executionCoord:
      'H-30: check-in em LZ HAWK. H-10: isolamento. Hora-H: entrada. Abortar se QRF inimiga > seção antes do isolamento. Sinais: IR strobe no PZ; verde = extração, vermelho = contato no PZ. Não cruzar grid 140 a oeste (campo minado marcado).',
    sustainment:
      'Munição padrão + 1x carga extra 5.56 por esquadra. 2x termite para o rack de rádio. Água para 6 h. CASEVAC: 9 linhas para DUSTOFF na 80.0. FARP em FOB Kamino. Prisioneiros: busca, silêncio, entrega ao S2 no PZ.',
    commandSignal:
      'SL no terreno (RAIDER-1). Sucessão: RAIDER-2, depois 1ª Esq. COMANDO em 50.0 (WATCHTOWER). Tática 60.0. Apoio 70.0. CASEVAC 80.0. Desligar GPS civil. Tráfego mínimo após H-10.',
    roe: 'Armas em HOLD até contato ou PID positivo de ameaça. Proibido fogo em civis e detidos. HVT vivo se viável. Granadas só no interior do bloco C2 após isolamento. Reportar BDA ao WATCHTOWER ao consolidar.',
  }
  d.command = {
    commander: 'A. MENDES',
    rank: 'CAP',
    billet: 'S3 — OPERAÇÕES',
    callsign: 'WATCHTOWER',
  }
  d.comms = {
    nets: [
      { id: 'n1', name: 'COMANDO', freq: '50.0', callsign: 'WATCHTOWER' },
      { id: 'n2', name: 'TÁTICA', freq: '60.0', callsign: 'RAIDER' },
      { id: 'n3', name: 'APOIO', freq: '70.0', callsign: 'HAMMER' },
      { id: 'n4', name: 'CASEVAC', freq: '80.0', callsign: 'DUSTOFF' },
    ],
    challenge: 'TROVÃO',
    password: 'MARTELO',
    succession: 'RAIDER-1 → RAIDER-2 → 1ª ESQUADRA',
  }
  d.intel = [
    {
      id: 'intel-1',
      src: '',
      caption: 'Complexo C2 — fachada norte',
      grid: '14208930',
      source: 'UAV',
      dtg: '211140ZSEP26',
    },
    {
      id: 'intel-2',
      src: '',
      caption: 'Via de reforço / garagem do BTR',
      grid: '142091',
      source: 'SAT',
      dtg: '201600ZSEP26',
    },
    {
      id: 'intel-3',
      src: '',
      caption: 'LZ HAWK — clareira oeste',
      grid: '138086',
      source: 'RECON',
      dtg: '220430ZSEP26',
    },
    {
      id: 'intel-4',
      src: '',
      caption: 'HVT VIPER — retrato de arquivo',
      grid: '—',
      source: 'HUMINT',
      dtg: '180000ZSEP26',
    },
  ]
  d.document.pages.notice = true
  d.document.pages.sitrep = true
  d.document.pages.aar = true
  d.document.pages.casevac = true
  d.document.pages.hvt = true
  d.document.pages.orbat = true
  d.notice = {
    number: '12/2026',
    audience: 'TODO O EFETIVO DO GRUPO FALCÃO',
    subject: 'Emprego 23 SEP 26 — Operação SERPENTE NEGRA',
    body:
      '1. O Comando determina o emprego do 2º Pelotão na AO SUL (Pyrgos) conforme OPORD 23-09-04.\n' +
      '2. O efetivo deve estar em FOB Kamino NLT 230100ZSEP26, com check-in de rádio em WATCHTOWER.\n' +
      '3. Ausências só com justificativa ao SL até 222200Z. Reserva permanece em QRF.',
    orders:
      'Loadout noturno, NVG, munição padrão + 1 carga extra. Sem IR strobe até H-10. Trazer 1x litro de água. Dúvidas no Discord #s3.',
    validFrom: '221800ZSEP26',
    validUntil: '231200ZSEP26',
    distribution: 'Cia Bravo, QRF, S2, Comando',
    eventDtg: '230100ZSEP26',
    server: 'FALCAO-OPS (senha no canal S2)',
    mods: 'ACE, ACRE2, CUP, mapa Altis',
    slotting: 'Discord #slotting — NLT 222200ZSEP26',
    uniform: 'Uniforme noturno, NVG, sem distintivo civil',
    attendance: 'OBRIGATÓRIA para 2º Pel; voluntária para reserva',
    rally: 'TeamSpeak Falcão / sala RAIDER, 230045Z',
  }
  d.sitrep = {
    period: '211800Z a 221800Z SEP 26',
    enemy:
      'Seção CSAT em Pyrgos; BTR na garagem norte; sentinelas de telhado nos azimutes 040 e 220. Sem reforço observado na via principal após 221400Z.',
    friendly: 'QRF (1º Pel) em Kamino, pronto em 8 min. UAV disponível 40 min. FAC destacado.',
    own: '2º Pel em FOB Kamino. Efetivo completo. ACE verde. Sem baixas. Pronto para H-Hour 230200Z.',
    issues: '1ª Esq com 5.56 no limite. Bateria do UAV a 30%. Pedido de ressuprimento ao S4.',
    intent: 'Manter observação. OPORD 23-09-04 permanece em vigor. Próximo SITREP 222000Z ou ao contato.',
  }
  d.aar = {
    dtg: '230430ZSEP26',
    location: 'FOB KAMINO, ALTIS',
    summary:
      '2º Pel infiltrou LZ HAWK, isolou o complexo e entrou no TOT. C2 destruído com termite. HVT VIPER detido vivo pela 3ª Esq. Extração por PZ RAVEN sem contato no PZ.',
    wentWell:
      'Isolamento sul cortou o BTR. UAV identificou sentinela 040 a tempo. Tráfego de rádio mínimo após H-10. HVT vivo.',
    wentWrong:
      '1ª Esq atrasou 4 min na entrada do bloco C2. 5.56 da 1ª Esq no limite antes do consolidar. UAV pousou com 8% de bateria.',
    lessons:
      'Ressuprimento de 5.56 na LZ. UAV com bateria reserva no FAC. Ensaio de entrada no bloco com carga de explosivo já montada.',
    sustain: 'Conceito de isolamento + UAV. PID e HOLD até contato. Extração marcada com IR strobe.',
    improve: 'Controle de munição por esquadra. Timeline de entrada. Plano B se o UAV cair.',
    casualties: '0 KIA · 1 WIA (estilhaço leve, evacuado no PZ) · ACE verde no consolidar',
    bda: 'Estação C2 destruída. 6 EN KIA. 1 HVT capturado. BTR não engajado (ficou na garagem).',
  }
  d.casevac = {
    line1: '146092 (PZ RAVEN)',
    line2: '80.0 / DUSTOFF',
    line3: '1 A (urgente)',
    line4: 'A — nenhum',
    line5: '1 L (maca)',
    line6: 'N — sem inimigo no PZ',
    line7: 'C — fumaça verde + IR strobe',
    line8: 'A — militar da unidade',
    line9: 'Terreno: clareira, vento 6 kn de 270, sem NBC',
    remarks: 'WIA por estilhaço no braço esquerdo, estável, consciente. Escolta 3ª Esq até o PZ.',
  }
  d.hvts = [
    {
      id: 'hvt-1',
      name: 'KAREEM “VIPER” AL-SAID',
      alias: 'VIPER',
      role: 'Oficial de comunicações CSAT · C2 Pyrgos',
      nationality: 'CSAT / desconhecida',
      lastSeen: '221400ZSEP26 · complexo administrativo, bloco norte',
      grid: '14208930',
      description:
        'Homem ~35–40, 1,78 m, barba curta, uniforme de comunicações. Costuma permanecer no segundo piso do bloco C2. Evita patrulha a pé.',
      weapons: 'Pistola de serviço. Acesso ao rack de rádio e códigos de rede.',
      associates: '2x técnicos de C2 no mesmo bloco. BTR de sobreaviso a 400 m N.',
      guidance: 'CAPTURE. Vivo se viável. Não destruir documentos nem o rack antes da busca. Entregar ao S2 no PZ.',
      status: 'CAPTURE',
      photoSrc: '',
    },
  ]
  d.orbat = [
    { id: 'o1', echelon: 'CIA', designation: 'Cia Bravo (HQ)', callsign: 'WATCHTOWER', lead: 'CAP A. Mendes', strength: '—', task: 'C2 em FOB Kamino' },
    { id: 'o2', echelon: 'PEL', designation: '2º Pelotão', callsign: 'RAIDER', lead: 'RAIDER-1', strength: '3 esq + SL', task: 'Força de assalto' },
    { id: 'o3', echelon: 'ESQ', designation: '1ª Esquadra', callsign: 'RAIDER-1', lead: 'SL 1ª', strength: '8', task: 'Assalto bloco C2' },
    { id: 'o4', echelon: 'ESQ', designation: '2ª Esquadra', callsign: 'RAIDER-2', lead: 'SL 2ª', strength: '8', task: 'Isolamento sul / BTR' },
    { id: 'o5', echelon: 'ESQ', designation: '3ª Esquadra', callsign: 'RAIDER-3', lead: 'SL 3ª', strength: '8', task: 'Reserva / detenção HVT' },
    { id: 'o6', echelon: 'APOIO', designation: 'QRF (1º Pel)', callsign: 'HAMMER', lead: 'SL QRF', strength: '8 min', task: 'Reação a partir de Kamino' },
    { id: 'o7', echelon: 'APOIO', designation: 'UAV / FAC', callsign: 'WATCHER', lead: 'Op. UAV', strength: '1+1', task: 'Órbita 300 m AGL' },
    { id: 'o8', echelon: 'APOIO', designation: 'CASEVAC', callsign: 'DUSTOFF', lead: 'Médico de Cia', strength: '1', task: 'PZ RAVEN · 80.0' },
  ]
  d.marks.watermarkMode = 'diagonal'
  d.marks.watermarkText = ''
  return d
}

export function migrateDossier(raw: unknown): Dossier | null {
  if (!raw || typeof raw !== 'object') return null
  const incoming = raw as Partial<Dossier> & { version?: number }
  if (incoming.version !== 1) return null
  const d = structuredClone(blankDossier())
  Object.assign(d, incoming)
  d.clan = { ...blankDossier().clan, ...incoming.clan }
  d.document = { ...blankDossier().document, ...incoming.document }
  d.document.pages = { ...blankDossier().document.pages, ...incoming.document?.pages }
  d.header = { ...blankDossier().header, ...incoming.header }
  d.mission = { ...blankDossier().mission, ...incoming.mission }
  d.body = { ...blankDossier().body, ...incoming.body }
  d.command = { ...blankDossier().command, ...incoming.command }
  d.comms = { ...blankDossier().comms, ...incoming.comms }
  d.notice = { ...blankNotice(), ...incoming.notice }
  d.sitrep = { ...blankSitrep(), ...incoming.sitrep }
  d.aar = { ...blankAar(), ...incoming.aar }
  d.casevac = { ...blankCasevac(), ...incoming.casevac }
  d.hvts = Array.isArray(incoming.hvts) && incoming.hvts.length ? incoming.hvts : emptyHvtSlots()
  d.orbat = Array.isArray(incoming.orbat) && incoming.orbat.length ? incoming.orbat : emptyOrbatLines()
  d.marks = { ...blankDossier().marks, ...incoming.marks }
  const oldMode = String(incoming.marks?.watermarkMode ?? '')
  if (d.marks.watermarkMode !== 'none' && d.marks.watermarkMode !== 'tiled') {
    d.marks.watermarkMode = 'diagonal'
  }
  d.intel = Array.isArray(incoming.intel) ? incoming.intel : emptyIntelSlots()
  d.marks.stamps = incoming.marks?.stamps?.length ? incoming.marks.stamps : defaultStamps()
  if (oldMode === 'both' || oldMode === 'center') {
    const oval = d.marks.stamps.find((s) => s.id === 'confidential')
    if (oval) oval.enabled = false
  }
  return d
}
