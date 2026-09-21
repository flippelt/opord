import type { Dossier, StampConfig } from './types'
import { nowDtg } from './lib/dtg'

export function defaultStamps(): StampConfig[] {
  return [
    {
      id: 'confidential',
      kind: 'oval',
      title: 'CONFIDENCIAL',
      subtitle: 'CLASSIFIED',
      enabled: true,
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
      pages: { cover: true, opord: true, intel: true },
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
    marks: {
      watermarkMode: 'both',
      watermarkText: '',
      stamps: defaultStamps(),
    },
  }
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
  d.marks.watermarkMode = 'both'
  d.marks.watermarkText = ''
  return d
}
