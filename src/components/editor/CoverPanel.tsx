import { isNoticeType } from '../../lib/classification'
import { nowDtg } from '../../lib/dtg'
import { Field } from '../ImageField'
import { Group, usePatch } from './common'
import { StampsGroup, WatermarkGroup } from './MarksGroups'

export function CoverPanel() {
  const { dossier, patch } = usePatch()
  const notice = isNoticeType(dossier.document.type)
  return (
    <>
      <Group
        title="Operação"
        sub="Nome e codinome"
        hint={notice ? 'No comunicado, a capa mostra o assunto do comunicado.' : 'O nome entra na capa e no título das folhas.'}
      >
        <Field
          label="Nome da operação"
          edit="mission.name"
          value={dossier.mission.name}
          onChange={(name) => patch((d) => void (d.mission.name = name))}
          placeholder="SERPENTE NEGRA"
        />
        <Field
          label="Codinome"
          edit="mission.nickname"
          value={dossier.mission.nickname}
          onChange={(nickname) => patch((d) => void (d.mission.nickname = nickname))}
        />
      </Group>

      <Group title="Controle e emissão" sub="Controle, DTG e local" hint="O DTG e o local também saem no cabeçalho das outras folhas. As cópias ficam em Geral.">
        <Field
          label="Nº de controle"
          edit="document.control"
          value={dossier.document.controlNumber}
          onChange={(controlNumber) => patch((d) => void (d.document.controlNumber = controlNumber))}
        />
        <Field
          label="DTG de emissão"
          edit="header.dtg"
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
          edit="header.place"
          value={dossier.header.place}
          onChange={(place) => patch((d) => void (d.header.place = place))}
          placeholder="FOB, mapa, grid"
        />
      </Group>
      <WatermarkGroup />
      <StampsGroup />
    </>
  )
}
