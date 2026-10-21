import type { ReactNode } from 'react'
import { useDossier } from '../../store'
import { readClanMark } from '../../lib/image'
import { findInsignia, INSIGNIA_SETS, insigniaUrl } from '../../lib/insignia'
import { SIGNATURE_FONTS } from '../../lib/signature'
import type { SignatureMode, SignMark } from '../../types'
import { Field, ImageField, SelectField } from '../ImageField'

export function usePatch() {
  const dossier = useDossier((s) => s.dossier)
  const patch = useDossier((s) => s.patch)
  return { dossier, patch }
}

/** Um bloco do painel, com o nome do trecho da folha que ele edita. Começa fechado. */
export function Group({
  title,
  sub,
  hint,
  children,
}: {
  title: string
  /** O que tem dentro, visível com o bloco fechado. */
  sub?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <details className="panel-group">
      <summary>
        {title}
        {sub ? <small className="panel-sub">{sub}</small> : null}
      </summary>
      {hint ? <p className="field-hint">{hint}</p> : null}
      {children}
    </details>
  )
}

/** Assinatura no pé da folha. É a mesma em todas as folhas que a levam. */
export function SignatureGroup() {
  const { dossier, patch } = usePatch()
  const c = dossier.command
  const [setId] = c.insignia.split('/')
  const set = INSIGNIA_SETS.find((s) => s.id === setId) ?? INSIGNIA_SETS[0]
  const chosen = findInsignia(c.insignia)
  return (
    <Group title="Assinatura" sub="Quem assina, insígnia ou foto, e a assinatura" hint="A mesma em todas as folhas que a levam.">
      <Field
        label="Comandante / signatário"
        edit="command"
        value={c.commander}
        onChange={(commander) => patch((d) => void (d.command.commander = commander))}
      />
      <div className="row2">
        <Field
          label="Posto"
          edit="command"
          value={c.rank}
          onChange={(rank) => patch((d) => void (d.command.rank = rank))}
        />
        <Field
          label="Indicativo"
          edit="command"
          value={c.callsign}
          onChange={(callsign) => patch((d) => void (d.command.callsign = callsign))}
        />
      </div>
      <Field
        label="Função"
        edit="command"
        value={c.billet}
        onChange={(billet) => patch((d) => void (d.command.billet = billet))}
      />

      <SelectField
        label="Ao lado da assinatura"
        edit="command.mark"
        value={c.mark}
        onChange={(mark: SignMark) => patch((d) => void (d.command.mark = mark))}
        options={[
          { id: 'clan', label: 'Logo do clã' },
          { id: 'insignia', label: 'Insígnia da patente' },
          { id: 'avatar', label: 'Foto do signatário' },
        ]}
      />
      {c.mark === 'insignia' ? (
        INSIGNIA_SETS.length && set ? (
          <div data-edit="command.mark">
            <SelectField
              label="Força"
              value={set.id}
              onChange={(id) => patch((d) => void (d.command.insignia = `${id}/`))}
              options={INSIGNIA_SETS.map((s) => ({ id: s.id, label: s.label }))}
            />
            {(['enlisted', 'officer'] as const).map((group) => (
              <div key={group} className="insignia-grid-wrap">
                <p className="field-label">{group === 'officer' ? 'Oficiais' : 'Praças'}</p>
                <div className="insignia-grid">
                  {set.ranks
                    .filter((r) => r.group === group)
                    .sort((a, b) => a.order - b.order)
                    .map((rank) => {
                      const ref = `${set.id}/${rank.id}`
                      return (
                        <button
                          key={rank.id}
                          type="button"
                          className={c.insignia === ref ? 'insignia-pick on' : 'insignia-pick'}
                          title={rank.label}
                          onClick={() =>
                            patch((d) => {
                              d.command.insignia = ref
                              if (!d.command.rank.trim()) d.command.rank = rank.abbr
                            })
                          }
                        >
                          <img src={insigniaUrl(rank)} alt="" />
                          <span>{rank.abbr}</span>
                        </button>
                      )
                    })}
                </div>
              </div>
            ))}
            {chosen ? (
              <p className="field-hint">
                {chosen.rank.label} · {chosen.rank.author}, {chosen.rank.license}, via{' '}
                <a href={chosen.rank.source} target="_blank" rel="noreferrer">
                  Wikimedia Commons
                </a>
              </p>
            ) : (
              <p className="field-hint">Escolha a patente. Sem escolha, a folha mostra o logo do clã.</p>
            )}
          </div>
        ) : (
          <p className="field-hint">As insígnias ainda não estão no pacote. Por enquanto a folha mostra o logo do clã.</p>
        )
      ) : null}
      {c.mark === 'avatar' ? (
        <ImageField
          label="Foto do signatário"
          edit="command.mark"
          hint="Sai quadrada, ao lado da assinatura. Avatar do jogo ou foto do perfil."
          src={c.avatarSrc}
          readFile={readClanMark}
          onChange={(avatarSrc) => patch((d) => void (d.command.avatarSrc = avatarSrc))}
        />
      ) : null}

      <SelectField
        label="Assinatura"
        edit="command.signature"
        value={c.signature}
        onChange={(signature: SignatureMode) => patch((d) => void (d.command.signature = signature))}
        options={[
          { id: 'none', label: 'Sem assinatura (só a linha)' },
          { id: 'font', label: 'Nome em letra cursiva' },
          { id: 'image', label: 'Imagem da assinatura' },
        ]}
      />
      {c.signature === 'font' ? (
        <div data-edit="command.signature">
          <Field
            label="Texto da assinatura"
            hint="Vazio usa o nome do signatário."
            value={c.signatureText}
            placeholder={c.commander || 'A. Mendes'}
            onChange={(signatureText) => patch((d) => void (d.command.signatureText = signatureText))}
          />
          <div className="font-picks">
            {SIGNATURE_FONTS.map((font) => (
              <button
                key={font.id}
                type="button"
                className={c.signatureFont === font.id ? 'font-pick on' : 'font-pick'}
                title={font.label}
                style={{ fontFamily: `${font.family}, cursive`, fontSize: `${Math.round(24 * font.scale)}px` }}
                onClick={() => patch((d) => void (d.command.signatureFont = font.id))}
              >
                {c.signatureText.trim() || c.commander.trim() || 'A. Mendes'}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {c.signature === 'image' ? (
        <ImageField
          label="Imagem da assinatura"
          edit="command.signature"
          hint="PNG com fundo transparente fica melhor: assine num papel branco, fotografe e recorte."
          src={c.signatureSrc}
          readFile={readClanMark}
          onChange={(signatureSrc) => patch((d) => void (d.command.signatureSrc = signatureSrc))}
        />
      ) : null}
    </Group>
  )
}

/** Origem e destino aparecem na OPORD, no SITREP e no comunicado. */
export function RoutingFields({ destination = true }: { destination?: boolean }) {
  const { dossier, patch } = usePatch()
  return (
    <div className="row2">
      <Field
        label="Origem (FROM)"
        edit="header.origin"
        value={dossier.header.origin}
        onChange={(origin) => patch((d) => void (d.header.origin = origin))}
        placeholder="S3 / 2º BATALHÃO"
      />
      {destination ? (
        <Field
          label="Destino (TO)"
          edit="header.destination"
          value={dossier.header.destination}
          onChange={(destination) => patch((d) => void (d.header.destination = destination))}
          placeholder="2º PELOTÃO / CIA BRAVO"
        />
      ) : null}
    </div>
  )
}
