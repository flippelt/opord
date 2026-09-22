import {
  CAVEAT_OPTIONS,
  CLASSIFICATIONS,
  DOC_TYPES,
  CASEVAC_LINES,
  PAGE_LABELS,
  PRECEDENCE,
  TYPE_PAGE,
} from '../lib/classification'
import { nowDtg } from '../lib/dtg'
import { readClanMark, readIntelPhoto } from '../lib/image'
import { applyTemplate, TEMPLATE_CHOICES } from '../lib/templates'
import { blankDossier, defaultDossier, emptyHvtSlots, emptyOrbatLines, emptyRoster, emptyTimeline } from '../defaults'
import { useDossier } from '../store'
import type {
  Classification,
  DocType,
  PageId,
  Precedence,
  WatermarkColorMode,
  WatermarkFigure,
  WatermarkMode,
} from '../types'
import { Field, ImageField, SelectField } from './ImageField'
import { SheetOrder } from './SheetOrder'

export function Editor() {
  const dossier = useDossier((s) => s.dossier)
  const patch = useDossier((s) => s.patch)
  const setDossier = useDossier((s) => s.setDossier)
  const pageIds = Object.keys(PAGE_LABELS) as PageId[]
  const pagesOn = pageIds.filter((id) => dossier.document.pages[id])
  const pagesOff = pageIds.filter((id) => !dossier.document.pages[id])

  const showCommand =
    dossier.document.pages.opord ||
    dossier.document.pages.notice ||
    dossier.document.pages.radio ||
    dossier.document.pages.roster ||
    dossier.document.pages.sitrep ||
    dossier.document.pages.aar ||
    dossier.document.pages.orbat ||
    dossier.document.pages.casevac ||
    dossier.document.pages.hvt

  return (
    <aside className="desk">
      <header className="desk-brand">
        <p className="desk-kicker">Estação de operações</p>
        <h1>OPORD</h1>
        <p>Briefing classificado para milsim</p>
        <button
          type="button"
          className="btn-ghost desk-jump"
          onClick={() => document.querySelector('.workspace')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver dossiê
        </button>
      </header>

      <details open>
        <summary>Identidade do clã</summary>
        <Field
          label="Nome da unidade / clã"
          value={dossier.clan.name}
          onChange={(name) => patch((d) => void (d.clan.name = name))}
          placeholder="Grupo de Operações…"
        />
        <Field
          label="Sigla"
          value={dossier.clan.shortName}
          onChange={(shortName) => patch((d) => void (d.clan.shortName = shortName))}
          placeholder="FALCÃO"
        />
        <Field
          label="Lema"
          value={dossier.clan.motto}
          onChange={(motto) => patch((d) => void (d.clan.motto = motto))}
        />
        <ImageField
          label="Logo do clã"
          hint="Vai na capa, no cabeçalho e na assinatura."
          src={dossier.clan.sealSrc}
          readFile={readClanMark}
          onChange={(sealSrc) => patch((d) => void (d.clan.sealSrc = sealSrc))}
        />
        <ImageField
          label="Distintivo / patch"
          hint="Canto direito do OPORD."
          src={dossier.clan.patchSrc}
          readFile={readClanMark}
          onChange={(patchSrc) => patch((d) => void (d.clan.patchSrc = patchSrc))}
        />
      </details>

      <details open>
        <summary>Documento</summary>
        <SelectField
          label="Tipo"
          value={dossier.document.type}
          onChange={(type: DocType) =>
            patch((d) => {
              d.document.type = type
              const page = TYPE_PAGE[type]
              if (page) d.document.pages[page] = true
            })
          }
          options={DOC_TYPES.map((t) => ({ id: t.id, label: `${t.short} — ${t.label}` }))}
        />
        <SelectField
          label="Classificação"
          value={dossier.document.classification}
          onChange={(classification: Classification) =>
            patch((d) => void (d.document.classification = classification))
          }
          options={CLASSIFICATIONS.map((c) => ({
            id: c.id,
            label: `${c.label} (${c.nato})`,
          }))}
        />
        <div className="row2">
          <SelectField
            label="Sentido"
            value={dossier.document.orientation}
            onChange={(orientation: 'portrait' | 'landscape') =>
              patch((d) => void (d.document.orientation = orientation))
            }
            options={[
              { id: 'portrait', label: 'Retrato' },
              { id: 'landscape', label: 'Paisagem' },
            ]}
          />
          <SelectField
            label="Idioma do papel"
            value={dossier.document.language}
            onChange={(language: 'pt' | 'en') => patch((d) => void (d.document.language = language))}
            options={[
              { id: 'pt', label: 'Português' },
              { id: 'en', label: 'English' },
            ]}
          />
        </div>
        <fieldset className="chips">
          <legend>Modelo pronto</legend>
          {TEMPLATE_CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="chip"
              onClick={() => patch((d) => applyTemplate(d, choice.id))}
            >
              {dossier.document.language === 'en' ? choice.en : choice.pt}
            </button>
          ))}
        </fieldset>
        <p className="field-hint">O modelo preenche a missão e liga as folhas daquele tipo. O logo do clã fica.</p>
        <fieldset className="chips">
          <legend>Restrições / caveats</legend>
          {CAVEAT_OPTIONS.map((c) => {
            const on = dossier.document.caveats.includes(c)
            return (
              <label key={c} className={on ? 'chip on' : 'chip'}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    patch((d) => {
                      d.document.caveats = on
                        ? d.document.caveats.filter((x) => x !== c)
                        : [...d.document.caveats, c]
                    })
                  }
                />
                {c}
              </label>
            )
          })}
        </fieldset>
        <div className="row2">
          <Field
            label="Cópia nº"
            value={dossier.document.copyNumber}
            onChange={(copyNumber) => patch((d) => void (d.document.copyNumber = copyNumber))}
          />
          <Field
            label="De"
            hint="A exportação numera de 01 até este total."
            value={dossier.document.copyTotal}
            onChange={(copyTotal) => patch((d) => void (d.document.copyTotal = copyTotal))}
          />
        </div>
        <Field
          label="Nº de controle"
          value={dossier.document.controlNumber}
          onChange={(controlNumber) => patch((d) => void (d.document.controlNumber = controlNumber))}
        />
        <fieldset className="chips">
          <legend>No pacote</legend>
          {pagesOn.map((p) => (
            <button
              key={p}
              type="button"
              className="chip on"
              onClick={() => patch((d) => void (d.document.pages[p] = false))}
            >
              {PAGE_LABELS[p]} · tirar
            </button>
          ))}
        </fieldset>
        <fieldset className="chips">
          <legend>Adicionar modelo</legend>
          {pagesOff.map((p) => (
            <button
              key={p}
              type="button"
              className="chip"
              onClick={() => patch((d) => void (d.document.pages[p] = true))}
            >
              + {PAGE_LABELS[p]}
            </button>
          ))}
        </fieldset>
        <details open className="nested">
          <summary>Ordem e títulos</summary>
          <p className="field-hint">
            O título vazio deixa o nome de sempre. A página em branco entra antes das fotos, e as
            setas mudam o lugar dela no pacote.
          </p>
          <SheetOrder />
        </details>
      </details>

      <details open>
        <summary>Origem, destino e tempo</summary>
        <Field
          label="Origem (FROM)"
          value={dossier.header.origin}
          onChange={(origin) => patch((d) => void (d.header.origin = origin))}
          placeholder="S3 / 2º BATALHÃO"
        />
        <Field
          label="Destino (TO)"
          value={dossier.header.destination}
          onChange={(destination) => patch((d) => void (d.header.destination = destination))}
          placeholder="2º PELOTÃO / CIA BRAVO"
        />
        <Field
          label="Info (CC)"
          value={dossier.header.info}
          onChange={(info) => patch((d) => void (d.header.info = info))}
        />
        <SelectField
          label="Precedência"
          value={dossier.header.precedence}
          onChange={(precedence: Precedence) => patch((d) => void (d.header.precedence = precedence))}
          options={PRECEDENCE.map((p) => ({ id: p.id, label: `${p.label} (${p.nato})` }))}
        />
        <Field
          label="DTG de emissão"
          hint="Formato NATO, ex. 221845ZSEP26"
          value={dossier.header.dtg}
          onChange={(dtg) => patch((d) => void (d.header.dtg = dtg))}
        />
        <button
          type="button"
          className="btn-ghost"
          onClick={() => patch((d) => void (d.header.dtg = nowDtg()))}
        >
          Carimbar DTG agora (Zulu)
        </button>
        <Field
          label="Local de emissão"
          value={dossier.header.place}
          onChange={(place) => patch((d) => void (d.header.place = place))}
          placeholder="FOB, mapa, grid"
        />
        <Field
          label="Nº da ordem"
          value={dossier.header.orderNumber}
          onChange={(orderNumber) => patch((d) => void (d.header.orderNumber = orderNumber))}
        />
        <Field
          label="Carta / mapa"
          value={dossier.header.mapSheet}
          onChange={(mapSheet) => patch((d) => void (d.header.mapSheet = mapSheet))}
        />
        <Field
          label="Fuso"
          value={dossier.header.timeZone}
          onChange={(timeZone) => patch((d) => void (d.header.timeZone = timeZone))}
        />
      </details>

      <details open>
        <summary>Missão</summary>
        <Field
          label="Nome da operação"
          value={dossier.mission.name}
          onChange={(name) => patch((d) => void (d.mission.name = name))}
          placeholder="SERPENTE NEGRA"
        />
        <Field
          label="Codinome"
          value={dossier.mission.nickname}
          onChange={(nickname) => patch((d) => void (d.mission.nickname = nickname))}
        />
        <Field
          label="Assunto"
          value={dossier.mission.subject}
          onChange={(subject) => patch((d) => void (d.mission.subject = subject))}
          multiline
          rows={2}
        />
        <Field
          label="Hora-H"
          hint="NLT / TOT em DTG"
          value={dossier.mission.hHour}
          onChange={(hHour) => patch((d) => void (d.mission.hHour = hHour))}
        />
        <Field
          label="Área de operações (AO)"
          value={dossier.mission.ao}
          onChange={(ao) => patch((d) => void (d.mission.ao = ao))}
        />
        <Field
          label="Grid"
          value={dossier.mission.grid}
          onChange={(grid) => patch((d) => void (d.mission.grid = grid))}
        />
        <Field
          label="Terreno"
          value={dossier.mission.terrain}
          onChange={(terrain) => patch((d) => void (d.mission.terrain = terrain))}
        />
      </details>

{(dossier.document.pages.notice) ? (
      <details open>
        <summary>Comunicado / convocação</summary>
        <Field
          label="Nº do comunicado"
          value={dossier.notice.number}
          onChange={(number) => patch((d) => void (d.notice.number = number))}
          placeholder="12/2026"
        />
        <Field
          label="Para (audiência)"
          value={dossier.notice.audience}
          onChange={(audience) => patch((d) => void (d.notice.audience = audience))}
          placeholder="TODO O EFETIVO"
        />
        <Field
          label="Assunto"
          value={dossier.notice.subject}
          onChange={(subject) => patch((d) => void (d.notice.subject = subject))}
        />
        <Field
          label="Texto"
          value={dossier.notice.body}
          onChange={(body) => patch((d) => void (d.notice.body = body))}
          multiline
          rows={6}
        />
        <Field
          label="Determinações"
          value={dossier.notice.orders}
          onChange={(orders) => patch((d) => void (d.notice.orders = orders))}
          multiline
          rows={3}
        />
        <div className="row2">
          <Field
            label="Vigência de"
            value={dossier.notice.validFrom}
            onChange={(validFrom) => patch((d) => void (d.notice.validFrom = validFrom))}
          />
          <Field
            label="Até"
            value={dossier.notice.validUntil}
            onChange={(validUntil) => patch((d) => void (d.notice.validUntil = validUntil))}
          />
        </div>
        <Field
          label="Distribuição"
          value={dossier.notice.distribution}
          onChange={(distribution) => patch((d) => void (d.notice.distribution = distribution))}
        />
        <p className="field-hint">Campos de convocação (op night) — preenchidos, entram no documento.</p>
        <Field
          label="Apresentação (DTG)"
          value={dossier.notice.eventDtg}
          onChange={(eventDtg) => patch((d) => void (d.notice.eventDtg = eventDtg))}
        />
        <Field
          label="Comparecimento"
          value={dossier.notice.attendance}
          onChange={(attendance) => patch((d) => void (d.notice.attendance = attendance))}
        />
        <Field
          label="Servidor"
          value={dossier.notice.server}
          onChange={(server) => patch((d) => void (d.notice.server = server))}
        />
        <Field
          label="Ponto de reunião / TS"
          value={dossier.notice.rally}
          onChange={(rally) => patch((d) => void (d.notice.rally = rally))}
        />
        <Field
          label="Mods / mapa"
          value={dossier.notice.mods}
          onChange={(mods) => patch((d) => void (d.notice.mods = mods))}
        />
        <Field
          label="Slotting"
          value={dossier.notice.slotting}
          onChange={(slotting) => patch((d) => void (d.notice.slotting = slotting))}
        />
        <Field
          label="Uniforme / loadout"
          value={dossier.notice.uniform}
          onChange={(uniform) => patch((d) => void (d.notice.uniform = uniform))}
        />
      </details>
      ) : null}

{(dossier.document.pages.sitrep) ? (
      <details>
        <summary>SITREP</summary>
        <Field
          label="Período coberto"
          value={dossier.sitrep.period}
          onChange={(period) => patch((d) => void (d.sitrep.period = period))}
        />
        <Field
          label="1. Inimigo"
          value={dossier.sitrep.enemy}
          onChange={(enemy) => patch((d) => void (d.sitrep.enemy = enemy))}
          multiline
        />
        <Field
          label="2. Forças amigas"
          value={dossier.sitrep.friendly}
          onChange={(friendly) => patch((d) => void (d.sitrep.friendly = friendly))}
          multiline
          rows={3}
        />
        <Field
          label="3. Situação própria (ACE)"
          value={dossier.sitrep.own}
          onChange={(own) => patch((d) => void (d.sitrep.own = own))}
          multiline
          rows={3}
        />
        <Field
          label="4. Pendências"
          value={dossier.sitrep.issues}
          onChange={(issues) => patch((d) => void (d.sitrep.issues = issues))}
          multiline
          rows={3}
        />
        <Field
          label="5. Intenção / próximos passos"
          value={dossier.sitrep.intent}
          onChange={(intent) => patch((d) => void (d.sitrep.intent = intent))}
          multiline
          rows={3}
        />
      </details>
      ) : null}

{(dossier.document.pages.aar) ? (
      <details>
        <summary>AAR</summary>
        <Field
          label="DTG da revisão"
          value={dossier.aar.dtg}
          onChange={(dtg) => patch((d) => void (d.aar.dtg = dtg))}
        />
        <Field
          label="Local"
          value={dossier.aar.location}
          onChange={(location) => patch((d) => void (d.aar.location = location))}
        />
        <Field
          label="O que aconteceu"
          value={dossier.aar.summary}
          onChange={(summary) => patch((d) => void (d.aar.summary = summary))}
          multiline
        />
        <Field
          label="O que funcionou"
          value={dossier.aar.wentWell}
          onChange={(wentWell) => patch((d) => void (d.aar.wentWell = wentWell))}
          multiline
          rows={3}
        />
        <Field
          label="O que falhou"
          value={dossier.aar.wentWrong}
          onChange={(wentWrong) => patch((d) => void (d.aar.wentWrong = wentWrong))}
          multiline
          rows={3}
        />
        <Field
          label="Lições"
          value={dossier.aar.lessons}
          onChange={(lessons) => patch((d) => void (d.aar.lessons = lessons))}
          multiline
          rows={3}
        />
        <Field
          label="Manter"
          value={dossier.aar.sustain}
          onChange={(sustain) => patch((d) => void (d.aar.sustain = sustain))}
          multiline
          rows={2}
        />
        <Field
          label="Melhorar"
          value={dossier.aar.improve}
          onChange={(improve) => patch((d) => void (d.aar.improve = improve))}
          multiline
          rows={2}
        />
        <Field
          label="Baixas / ACE"
          value={dossier.aar.casualties}
          onChange={(casualties) => patch((d) => void (d.aar.casualties = casualties))}
        />
        <Field
          label="BDA"
          value={dossier.aar.bda}
          onChange={(bda) => patch((d) => void (d.aar.bda = bda))}
        />
      </details>
      ) : null}

{(dossier.document.pages.casevac) ? (
      <details>
        <summary>CASEVAC (9 linhas)</summary>
        {CASEVAC_LINES.map((line) => (
          <Field
            key={line.key}
            label={`${line.n}. ${line.label}`}
            hint={line.hint}
            value={dossier.casevac[line.key]}
            onChange={(v) => patch((d) => void (d.casevac[line.key] = v))}
          />
        ))}
        <Field
          label="Observações"
          value={dossier.casevac.remarks}
          onChange={(remarks) => patch((d) => void (d.casevac.remarks = remarks))}
          multiline
          rows={3}
        />
      </details>
      ) : null}

{(dossier.document.pages.hvt) ? (
      <details>
        <summary>HVT</summary>
        {dossier.hvts.map((card, i) => (
          <div key={card.id} className="intel-edit">
            <p className="intel-edit-title">HVT-{String(i + 1).padStart(2, '0')}</p>
            <ImageField
              label="Retrato"
              src={card.photoSrc}
              readFile={readIntelPhoto}
              onChange={(photoSrc) => patch((d) => void (d.hvts[i].photoSrc = photoSrc))}
            />
            <div className="row2">
              <Field
                label="Nome"
                value={card.name}
                onChange={(name) => patch((d) => void (d.hvts[i].name = name))}
              />
              <Field
                label="Alias"
                value={card.alias}
                onChange={(alias) => patch((d) => void (d.hvts[i].alias = alias))}
              />
            </div>
            <Field
              label="Status (CAPTURE / KILL / WANTED)"
              value={card.status}
              onChange={(status) => patch((d) => void (d.hvts[i].status = status))}
            />
            <Field
              label="Função"
              value={card.role}
              onChange={(role) => patch((d) => void (d.hvts[i].role = role))}
            />
            <div className="row2">
              <Field
                label="Nacionalidade"
                value={card.nationality}
                onChange={(nationality) => patch((d) => void (d.hvts[i].nationality = nationality))}
              />
              <Field
                label="Grid"
                value={card.grid}
                onChange={(grid) => patch((d) => void (d.hvts[i].grid = grid))}
              />
            </div>
            <Field
              label="Último avistamento"
              value={card.lastSeen}
              onChange={(lastSeen) => patch((d) => void (d.hvts[i].lastSeen = lastSeen))}
            />
            <Field
              label="Descrição"
              value={card.description}
              onChange={(description) => patch((d) => void (d.hvts[i].description = description))}
              multiline
              rows={3}
            />
            <Field
              label="Armamento"
              value={card.weapons}
              onChange={(weapons) => patch((d) => void (d.hvts[i].weapons = weapons))}
            />
            <Field
              label="Associados"
              value={card.associates}
              onChange={(associates) => patch((d) => void (d.hvts[i].associates = associates))}
            />
            <Field
              label="Orientação"
              value={card.guidance}
              onChange={(guidance) => patch((d) => void (d.hvts[i].guidance = guidance))}
              multiline
              rows={2}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => patch((d) => void d.hvts.splice(i, 1))}
            >
              Remover HVT
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.hvts.push({ ...emptyHvtSlots()[0], id: `hvt-${crypto.randomUUID()}` })
            })
          }
        >
          + Cartão de HVT
        </button>
      </details>
      ) : null}

{(dossier.document.pages.orbat) ? (
      <details>
        <summary>ORBAT</summary>
        {dossier.orbat.map((row, i) => (
          <div key={row.id} className="intel-edit">
            <div className="row2">
              <Field
                label="Escalão"
                value={row.echelon}
                onChange={(echelon) => patch((d) => void (d.orbat[i].echelon = echelon))}
              />
              <Field
                label="Designação"
                value={row.designation}
                onChange={(designation) => patch((d) => void (d.orbat[i].designation = designation))}
              />
            </div>
            <div className="row2">
              <Field
                label="Indicativo"
                value={row.callsign}
                onChange={(callsign) => patch((d) => void (d.orbat[i].callsign = callsign))}
              />
              <Field
                label="Chefe"
                value={row.lead}
                onChange={(lead) => patch((d) => void (d.orbat[i].lead = lead))}
              />
            </div>
            <div className="row2">
              <Field
                label="Efetivo"
                value={row.strength}
                onChange={(strength) => patch((d) => void (d.orbat[i].strength = strength))}
              />
              <Field
                label="Tarefa"
                value={row.task}
                onChange={(task) => patch((d) => void (d.orbat[i].task = task))}
              />
            </div>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => patch((d) => void d.orbat.splice(i, 1))}
            >
              Remover linha
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.orbat.push({ ...emptyOrbatLines()[0], id: `orbat-${crypto.randomUUID()}` })
            })
          }
        >
          + Linha no ORBAT
        </button>
      </details>
      ) : null}

{(dossier.document.pages.timeline) ? (
      <details>
        <summary>Linha do tempo</summary>
        {dossier.timeline.map((row, i) => (
          <div key={row.id} className="intel-edit">
            <div className="row2">
              <Field
                label="Marca"
                value={row.mark}
                placeholder="H-30"
                onChange={(mark) => patch((d) => void (d.timeline[i].mark = mark))}
              />
              <Field
                label="DTG"
                value={row.dtg}
                onChange={(dtg) => patch((d) => void (d.timeline[i].dtg = dtg))}
              />
            </div>
            <Field
              label="O que acontece"
              value={row.what}
              onChange={(what) => patch((d) => void (d.timeline[i].what = what))}
            />
            <button type="button" className="btn-ghost" onClick={() => patch((d) => void d.timeline.splice(i, 1))}>
              Remover marco
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.timeline.push({ ...emptyTimeline()[0], id: `t-${crypto.randomUUID()}` })
            })
          }
        >
          + Marco
        </button>
      </details>
      ) : null}

{(dossier.document.pages.roster) ? (
      <details>
        <summary>Escalação</summary>
        <p className="field-hint">Quem ocupa cada vaga. O cartão de rádio e o de ROE usam as redes e as regras já preenchidas.</p>
        {dossier.roster.map((row, i) => (
          <div key={row.id} className="intel-edit">
            <div className="row2">
              <Field
                label="Elemento"
                value={row.element}
                onChange={(element) => patch((d) => void (d.roster[i].element = element))}
              />
              <Field
                label="Vaga"
                value={row.billet}
                onChange={(billet) => patch((d) => void (d.roster[i].billet = billet))}
              />
            </div>
            <div className="row2">
              <Field
                label="Indicativo"
                value={row.callsign}
                onChange={(callsign) => patch((d) => void (d.roster[i].callsign = callsign))}
              />
              <Field
                label="Nome"
                value={row.name}
                onChange={(name) => patch((d) => void (d.roster[i].name = name))}
              />
            </div>
            <button type="button" className="btn-ghost" onClick={() => patch((d) => void d.roster.splice(i, 1))}>
              Remover vaga
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.roster.push({ ...emptyRoster()[0], id: `r-${crypto.randomUUID()}` })
            })
          }
        >
          + Vaga
        </button>
      </details>
      ) : null}

{(dossier.document.pages.opord || dossier.document.pages.roe) ? (
      <details>
        <summary>Corpo (SMEAC)</summary>
        <Field
          label="1.a Forças inimigas"
          value={dossier.body.situationEnemy}
          onChange={(situationEnemy) => patch((d) => void (d.body.situationEnemy = situationEnemy))}
          multiline
        />
        <Field
          label="1.b Forças amigas"
          value={dossier.body.situationFriendly}
          onChange={(situationFriendly) =>
            patch((d) => void (d.body.situationFriendly = situationFriendly))
          }
          multiline
        />
        <Field
          label="1.c Destacamentos"
          value={dossier.body.situationAttachments}
          onChange={(situationAttachments) =>
            patch((d) => void (d.body.situationAttachments = situationAttachments))
          }
          multiline
          rows={3}
        />
        <Field
          label="1.d Tempo e terreno"
          value={dossier.body.situationWeather}
          onChange={(situationWeather) =>
            patch((d) => void (d.body.situationWeather = situationWeather))
          }
          multiline
          rows={3}
        />
        <Field
          label="2. Missão (quem, o quê, quando, onde, para quê)"
          value={dossier.body.mission}
          onChange={(mission) => patch((d) => void (d.body.mission = mission))}
          multiline
        />
        <Field
          label="3.a Conceito da operação"
          value={dossier.body.executionConcept}
          onChange={(executionConcept) =>
            patch((d) => void (d.body.executionConcept = executionConcept))
          }
          multiline
        />
        <Field
          label="3.b Tarefas"
          value={dossier.body.executionTasks}
          onChange={(executionTasks) => patch((d) => void (d.body.executionTasks = executionTasks))}
          multiline
        />
        <Field
          label="3.c Coordenação"
          value={dossier.body.executionCoord}
          onChange={(executionCoord) => patch((d) => void (d.body.executionCoord = executionCoord))}
          multiline
        />
        <Field
          label="4. Logística"
          value={dossier.body.sustainment}
          onChange={(sustainment) => patch((d) => void (d.body.sustainment = sustainment))}
          multiline
        />
        <Field
          label="5. Comando e comunicações"
          value={dossier.body.commandSignal}
          onChange={(commandSignal) => patch((d) => void (d.body.commandSignal = commandSignal))}
          multiline
        />
        <Field
          label="ROE"
          value={dossier.body.roe}
          onChange={(roe) => patch((d) => void (d.body.roe = roe))}
          multiline
          rows={3}
        />
      </details>
      ) : null}

{(showCommand) ? (
      <details>
        <summary>Comando e redes</summary>
        <Field
          label="Comandante / signatário"
          value={dossier.command.commander}
          onChange={(commander) => patch((d) => void (d.command.commander = commander))}
        />
        <div className="row2">
          <Field
            label="Posto"
            value={dossier.command.rank}
            onChange={(rank) => patch((d) => void (d.command.rank = rank))}
          />
          <Field
            label="Indicativo"
            value={dossier.command.callsign}
            onChange={(callsign) => patch((d) => void (d.command.callsign = callsign))}
          />
        </div>
        <Field
          label="Função"
          value={dossier.command.billet}
          onChange={(billet) => patch((d) => void (d.command.billet = billet))}
        />
        {dossier.comms.nets.map((net, i) => (
          <div key={net.id} className="net-row">
            <Field
              label={i === 0 ? 'Rede' : ''}
              value={net.name}
              onChange={(name) => patch((d) => void (d.comms.nets[i].name = name))}
            />
            <Field
              label={i === 0 ? 'Freq.' : ''}
              value={net.freq}
              onChange={(freq) => patch((d) => void (d.comms.nets[i].freq = freq))}
            />
            <Field
              label={i === 0 ? 'Indicativo' : ''}
              value={net.callsign}
              onChange={(callsign) => patch((d) => void (d.comms.nets[i].callsign = callsign))}
            />
          </div>
        ))}
        <div className="row2">
          <Field
            label="Desafio"
            value={dossier.comms.challenge}
            onChange={(challenge) => patch((d) => void (d.comms.challenge = challenge))}
          />
          <Field
            label="Senha"
            value={dossier.comms.password}
            onChange={(password) => patch((d) => void (d.comms.password = password))}
          />
        </div>
        <Field
          label="Sucessão de comando"
          value={dossier.comms.succession}
          onChange={(succession) => patch((d) => void (d.comms.succession = succession))}
        />
      </details>
      ) : null}

{(dossier.document.pages.intel) ? (
      <details open>
        <summary>Anexo de intel</summary>
        {dossier.intel.map((photo, i) => (
          <div key={photo.id} className="intel-edit">
            <p className="intel-edit-title">Placa B-{String(i + 1).padStart(2, '0')}</p>
            <ImageField
              label="Imagem"
              src={photo.src}
              readFile={readIntelPhoto}
              onChange={(src) => patch((d) => void (d.intel[i].src = src))}
            />
            <Field
              label="Legenda"
              value={photo.caption}
              onChange={(caption) => patch((d) => void (d.intel[i].caption = caption))}
            />
            <div className="row2">
              <Field
                label="Grid"
                value={photo.grid}
                onChange={(grid) => patch((d) => void (d.intel[i].grid = grid))}
              />
              <Field
                label="Fonte"
                value={photo.source}
                onChange={(source) => patch((d) => void (d.intel[i].source = source))}
                placeholder="UAV / SAT / RECON / HUMINT"
              />
            </div>
            <Field
              label="DTG da imagem"
              value={photo.dtg}
              onChange={(dtg) => patch((d) => void (d.intel[i].dtg = dtg))}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => patch((d) => void d.intel.splice(i, 1))}
            >
              Remover placa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            patch((d) => {
              d.intel.push({
                id: `intel-${crypto.randomUUID()}`,
                src: '',
                caption: '',
                grid: '',
                source: 'UAV',
                dtg: '',
              })
            })
          }
        >
          + Placa de intel
        </button>
      </details>
      ) : null}

      {dossier.document.pages.map ? (
        <details open>
          <summary>Mapa</summary>
          <ImageField
            label="Imagem do mapa"
            hint="Se o mapa do jogo já tem grade, deixe a opção abaixo desligada."
            src={dossier.map.src}
            readFile={readIntelPhoto}
            onChange={(src) => patch((d) => void (d.map.src = src))}
          />
          <label className={dossier.map.grid ? 'chip on' : 'chip'}>
            <input
              type="checkbox"
              checked={dossier.map.grid}
              onChange={() => patch((d) => void (d.map.grid = !d.map.grid))}
            />
            Grade por cima
          </label>
          {dossier.map.grid ? (
          <div className="row2">
            <Field
              label="Colunas da grade"
              value={String(dossier.map.cols)}
              onChange={(value) => patch((d) => void (d.map.cols = Number(value) || 1))}
            />
            <Field
              label="Linhas da grade"
              value={String(dossier.map.rows)}
              onChange={(value) => patch((d) => void (d.map.rows = Number(value) || 1))}
            />
          </div>
          ) : null}
          <Field
            label="Legenda"
            value={dossier.map.caption}
            onChange={(caption) => patch((d) => void (d.map.caption = caption))}
          />
        </details>
      ) : null}
      <details open>
        <summary>Carimbos e marca d’água</summary>
        <SelectField
          label="Marca d’água"
          value={dossier.marks.watermarkMode}
          onChange={(watermarkMode: WatermarkMode) =>
            patch((d) => void (d.marks.watermarkMode = watermarkMode))
          }
          options={[
            { id: 'none', label: 'Nenhuma' },
            { id: 'diagonal', label: 'Texto grande na diagonal' },
            { id: 'tiled', label: 'Mosaico repetido' },
          ]}
        />
        <Field
          label="Texto da marca d’água"
          hint="Vazio = usa a classificação (CONFIDENCIAL, SECRETO…)"
          value={dossier.marks.watermarkText}
          onChange={(watermarkText) => patch((d) => void (d.marks.watermarkText = watermarkText))}
        />
        <SelectField
          label="Figura por baixo"
          value={dossier.marks.watermarkFigure}
          onChange={(watermarkFigure: WatermarkFigure) =>
            patch((d) => void (d.marks.watermarkFigure = watermarkFigure))
          }
          options={[
            { id: 'none', label: 'Nenhuma' },
            { id: 'logo', label: 'Logo do clã' },
            { id: 'image', label: 'Outra imagem' },
          ]}
        />
        {dossier.marks.watermarkFigure === 'logo' && !dossier.clan.sealSrc ? (
          <p className="field-hint">Sobe o logo do clã na identidade para ele aparecer aqui.</p>
        ) : null}
        {dossier.marks.watermarkFigure === 'image' ? (
          <ImageField
            label="Imagem da marca d’água"
            hint="Fica grande e clara, no meio da folha. Não troca o logo do cabeçalho."
            src={dossier.marks.watermarkImageSrc}
            readFile={readClanMark}
            onChange={(watermarkImageSrc) =>
              patch((d) => void (d.marks.watermarkImageSrc = watermarkImageSrc))
            }
          />
        ) : null}
        <label className={dossier.marks.watermarkTextOnTop ? 'chip on stamp-chip' : 'chip stamp-chip'}>
          <input
            type="checkbox"
            checked={dossier.marks.watermarkTextOnTop}
            onChange={() =>
              patch((d) => void (d.marks.watermarkTextOnTop = !d.marks.watermarkTextOnTop))
            }
          />
          Texto confidencial por cima
        </label>
        <SelectField
          label="Cor do texto"
          value={dossier.marks.watermarkColorMode}
          onChange={(watermarkColorMode: WatermarkColorMode) =>
            patch((d) => void (d.marks.watermarkColorMode = watermarkColorMode))
          }
          options={[
            { id: 'classification', label: 'Cor da classificação' },
            { id: 'custom', label: 'Cor escolhida' },
          ]}
        />
        {dossier.marks.watermarkColorMode === 'custom' ? (
          <label className="field">
            <span className="field-label">Cor</span>
            <span className="color-row">
              <input
                type="color"
                value={
                  /^#[0-9a-fA-F]{6}$/.test(dossier.marks.watermarkColor)
                    ? dossier.marks.watermarkColor
                    : '#c9a227'
                }
                onChange={(e) => patch((d) => void (d.marks.watermarkColor = e.target.value))}
              />
              {['#c9a227', '#14532d', '#1a1714', '#b42318', '#1e3a8a'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className="color-swatch"
                  style={{ background: color }}
                  aria-label={color}
                  onClick={() => patch((d) => void (d.marks.watermarkColor = color))}
                />
              ))}
            </span>
          </label>
        ) : null}
        {dossier.marks.stamps.map((stamp) => (
          <label key={stamp.id} className={stamp.enabled ? 'chip on stamp-chip' : 'chip stamp-chip'}>
            <input
              type="checkbox"
              checked={stamp.enabled}
              onChange={() =>
                patch((d) => {
                  const s = d.marks.stamps.find((x) => x.id === stamp.id)
                  if (s) s.enabled = !s.enabled
                })
              }
            />
            {stamp.title}
            <small>
              {stamp.page === 'all' ? 'todas' : PAGE_LABELS[stamp.page]}
            </small>
          </label>
        ))}
      </details>

      <div className="desk-foot">
        <button type="button" className="btn-ghost" onClick={() => setDossier(defaultDossier())}>
          Restaurar exemplo
        </button>
        <button type="button" className="btn-ghost" onClick={() => setDossier(blankDossier())}>
          Novo dossiê
        </button>
      </div>
    </aside>
  )
}
