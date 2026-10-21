import { isNoticeType } from '../../lib/classification'
import { nowDtg } from '../../lib/dtg'
import { readClanMark } from '../../lib/image'
import { Field, ImageField } from '../ImageField'
import { Group, usePatch } from './common'

export function CoverPanel() {
  const { dossier, patch } = usePatch()
  const notice = isNoticeType(dossier.document.type)
  return (
    <>
      <Group
        title="Identidade do clã"
        sub="Nome, sigla, lema, logo e distintivo"
        hint="Nome, sigla e logo entram no cabeçalho de todas as folhas. Clicar no logo da capa também abre o seletor de imagem."
      >
        <Field
          label="Nome da unidade / clã"
          edit="clan.name"
          value={dossier.clan.name}
          onChange={(name) => patch((d) => void (d.clan.name = name))}
          placeholder="Grupo de Operações…"
        />
        <Field
          label="Sigla"
          edit="clan.name"
          hint="Entra ao lado do nome. Também no selo e no patch, quando não há imagem."
          value={dossier.clan.shortName}
          onChange={(shortName) => patch((d) => void (d.clan.shortName = shortName))}
          placeholder="FALCÃO"
        />
        <Field
          label="Lema"
          edit="clan.motto"
          value={dossier.clan.motto}
          onChange={(motto) => patch((d) => void (d.clan.motto = motto))}
        />
        <ImageField
          label="Logo do clã"
          edit="clan.seal"
          hint="Vai na capa, no cabeçalho e na assinatura."
          src={dossier.clan.sealSrc}
          readFile={readClanMark}
          onChange={(sealSrc) => patch((d) => void (d.clan.sealSrc = sealSrc))}
        />
        <ImageField
          label="Distintivo / patch"
          edit="clan.patch"
          hint="Canto do cabeçalho, nas folhas que levam o distintivo."
          src={dossier.clan.patchSrc}
          readFile={readClanMark}
          onChange={(patchSrc) => patch((d) => void (d.clan.patchSrc = patchSrc))}
        />
      </Group>

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

      <Group title="Controle e emissão" sub="Cópias, nº de controle, DTG e local" hint="O DTG e o local também saem no cabeçalho das outras folhas.">
        <div className="row2">
          <Field
            label="Cópia nº"
            edit="document.copy"
            value={dossier.document.copyNumber}
            onChange={(copyNumber) => patch((d) => void (d.document.copyNumber = copyNumber))}
          />
          <Field
            label="De"
            edit="document.copy"
            hint="A exportação numera de 01 até este total."
            value={dossier.document.copyTotal}
            onChange={(copyTotal) => patch((d) => void (d.document.copyTotal = copyTotal))}
          />
        </div>
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
    </>
  )
}
