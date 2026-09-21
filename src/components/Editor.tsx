import { CAVEAT_OPTIONS, CLASSIFICATIONS, DOC_TYPES, PRECEDENCE } from '../lib/classification'
import { nowDtg } from '../lib/dtg'
import { readClanMark, readIntelPhoto } from '../lib/image'
import { blankDossier, defaultDossier } from '../defaults'
import { useDossier } from '../store'
import type { Classification, DocType, PageId, Precedence, WatermarkMode } from '../types'
import { Field, ImageField, SelectField } from './ImageField'

export function Editor() {
  const dossier = useDossier((s) => s.dossier)
  const patch = useDossier((s) => s.patch)
  const setDossier = useDossier((s) => s.setDossier)

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
          label="Selo do clã"
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
          onChange={(type: DocType) => patch((d) => void (d.document.type = type))}
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
          <legend>Páginas</legend>
          {(['cover', 'opord', 'intel'] as PageId[]).map((p) => {
            const labels: Record<PageId, string> = {
              cover: 'Capa',
              opord: 'OPORD',
              intel: 'Anexo intel',
            }
            return (
              <label key={p} className={dossier.document.pages[p] ? 'chip on' : 'chip'}>
                <input
                  type="checkbox"
                  checked={dossier.document.pages[p]}
                  onChange={() => patch((d) => void (d.document.pages[p] = !d.document.pages[p]))}
                />
                {labels[p]}
              </label>
            )
          })}
        </fieldset>
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

      <details open>
        <summary>Selos e marca d’água</summary>
        <SelectField
          label="Marca d’água"
          value={dossier.marks.watermarkMode}
          onChange={(watermarkMode: WatermarkMode) =>
            patch((d) => void (d.marks.watermarkMode = watermarkMode))
          }
          options={[
            { id: 'none', label: 'Nenhuma' },
            { id: 'diagonal', label: 'Palavra diagonal (clássica)' },
            { id: 'center', label: 'Selo oval no centro' },
            { id: 'tiled', label: 'Mosaico repetido' },
            { id: 'both', label: 'Diagonal + selo central' },
          ]}
        />
        <Field
          label="Texto da marca d’água"
          hint="Vazio = usa a classificação (CONFIDENCIAL, SECRETO…)"
          value={dossier.marks.watermarkText}
          onChange={(watermarkText) => patch((d) => void (d.marks.watermarkText = watermarkText))}
        />
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
              {stamp.page === 'all' ? 'todas' : stamp.page === 'cover' ? 'capa' : stamp.page === 'opord' ? 'OPORD' : 'intel'}
            </small>
          </label>
        ))}
      </details>

      <div className="desk-foot">
        <button type="button" className="btn-ghost" onClick={() => setDossier(defaultDossier())}>
          Restaurar exemplo
        </button>
        <button type="button" className="btn-ghost" onClick={() => setDossier(blankDossier())}>
          Dossiê em branco
        </button>
      </div>
    </aside>
  )
}
