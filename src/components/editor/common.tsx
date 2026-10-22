import { useRef, useState, type ReactNode } from 'react'
import { useDossier } from '../../store'
import { readClanMark, readRankPin } from '../../lib/image'
import { findInsignia, FORCES, NATO_RANKS, natoInsigniaUrl, rankName, type Force, type InsigniaGroup } from '../../lib/insignia'
import { SIGNATURE_FONTS } from '../../lib/signature'
import type { Dossier, SignatureMode, SignMark } from '../../types'
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
  const key = useDossier((s) => s.active)
  const own = Boolean(dossier.signatures[key])
  const c = dossier.signatures[key] ?? dossier.command
  /** Edita a assinatura desta folha se ela tiver a própria; senão, a comum. */
  const update = (recipe: (t: Dossier['command']) => void) => patch((d) => recipe(d.signatures[key] ?? d.command))
  return (
    <Group
      title="Assinatura"
      sub="Quem assina, insígnia ou foto, e a assinatura"
    >
      <label className={own ? 'chip' : 'chip on'} data-edit="command">
        <input
          type="checkbox"
          checked={!own}
          onChange={() =>
            patch((d) => {
              if (d.signatures[key]) delete d.signatures[key]
              else d.signatures[key] = structuredClone(d.command)
            })
          }
        />
        Repetir a mesma assinatura em todas as folhas que assinam
      </label>
      <p className="field-hint">
        {own
          ? 'Esta folha tem assinatura própria. Marque para voltar a usar a comum.'
          : 'Mudar aqui muda todas. Desmarque para esta folha ter assinatura própria, a partir de uma cópia da comum.'}
      </p>
      <Field
        label="Comandante / signatário"
        edit="command"
        value={c.commander}
        onChange={(commander) => update((t) => void (t.commander = commander))}
      />
      <div className="row2">
        <Field
          label="Posto"
          edit="command"
          value={c.rank}
          onChange={(rank) => update((t) => void (t.rank = rank))}
        />
        <Field
          label="Indicativo"
          edit="command"
          value={c.callsign}
          onChange={(callsign) => update((t) => void (t.callsign = callsign))}
        />
      </div>
      <Field
        label="Função"
        edit="command"
        value={c.billet}
        onChange={(billet) => update((t) => void (t.billet = billet))}
      />

      <SelectField
        label="Ao lado da assinatura"
        edit="command.mark"
        value={c.mark}
        onChange={(mark: SignMark) => update((t) => void (t.mark = mark))}
        options={[
          { id: 'clan', label: 'Logo do clã' },
          { id: 'insignia', label: 'Insígnia da patente' },
          { id: 'avatar', label: 'Foto do signatário' },
        ]}
      />
      {c.mark === 'insignia' ? (
        <InsigniaPicker
          value={c.insignia}
          onPick={(ref, label) =>
            update((t) => {
              // O posto acompanha a insígnia enquanto ninguém escreveu outro.
              const before = findInsignia(t.insignia, dossier.clan.pins, dossier.document.language)?.label
              if (!t.rank.trim() || t.rank === before) t.rank = label
              t.insignia = ref
            })
          }
        />
      ) : null}
      {c.mark === 'avatar' ? (
        <ImageField
          label="Foto do signatário"
          edit="command.mark"
          hint="Sai quadrada, ao lado da assinatura. Avatar do jogo ou foto do perfil."
          src={c.avatarSrc}
          readFile={readClanMark}
          onChange={(avatarSrc) => update((t) => void (t.avatarSrc = avatarSrc))}
        />
      ) : null}

      <SelectField
        label="Assinatura"
        edit="command.signature"
        value={c.signature}
        onChange={(signature: SignatureMode) => update((t) => void (t.signature = signature))}
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
            onChange={(signatureText) => update((t) => void (t.signatureText = signatureText))}
          />
          <div className="font-picks">
            {SIGNATURE_FONTS.map((font) => (
              <button
                key={font.id}
                type="button"
                className={c.signatureFont === font.id ? 'font-pick on' : 'font-pick'}
                title={font.label}
                style={{ fontFamily: `${font.family}, cursive`, fontSize: `${Math.round(24 * font.scale)}px` }}
                onClick={() => update((t) => void (t.signatureFont = font.id))}
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
          onChange={(signatureSrc) => update((t) => void (t.signatureSrc = signatureSrc))}
        />
      ) : null}
    </Group>
  )
}

const GROUP_LABEL: Record<InsigniaGroup, string> = {
  enlisted: 'Praças',
  warrant: 'Oficiais técnicos',
  officer: 'Oficiais',
}

/** Patentes pelo código OTAN e os pins que o clã enviou, que valem para todas as assinaturas. */
function InsigniaPicker({ value, onPick }: { value: string; onPick: (ref: string, label: string) => void }) {
  const { dossier, patch } = usePatch()
  const input = useRef<HTMLInputElement>(null)
  const pins = dossier.clan.pins
  const language = dossier.document.language
  const chosen = findInsignia(value, pins, language)
  const [force, setForce] = useState<Force>(chosen?.force ?? 'army')
  const ownPin = value.startsWith('clan/') ? pins.find((p) => `clan/${p.id}` === value) : undefined

  async function addPins(files: FileList | null) {
    if (!files?.length) return
    const added = await Promise.all(
      [...files].map(async (file) => ({
        id: `pin-${crypto.randomUUID()}`,
        label: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim(),
        src: await readRankPin(file),
      })),
    )
    patch((d) => void d.clan.pins.push(...added))
    onPick(`clan/${added[0].id}`, added[0].label)
  }

  function removePin(id: string) {
    const ref = `clan/${id}`
    patch((d) => {
      d.clan.pins = d.clan.pins.filter((p) => p.id !== id)
      for (const c of [d.command, ...Object.values(d.signatures)]) if (c.insignia === ref) c.insignia = ''
    })
  }

  return (
    <div data-edit="command.mark">
      <SelectField
        label="Força"
        value={force}
        onChange={(next: Force) => {
          setForce(next)
          // A mesma patente na outra força: o pin é igual, muda só o nome.
          const rank = chosen?.code ? NATO_RANKS.find((r) => r.code === chosen.code) : undefined
          if (rank) onPick(`${next}/${rank.code}`, rankName(rank, next, language))
        }}
        options={FORCES}
      />
      {(['enlisted', 'warrant', 'officer'] as const).map((group) => (
        <div key={group} className="insignia-grid-wrap">
          <p className="field-label">{GROUP_LABEL[group]}</p>
          <div className="insignia-grid">
            {NATO_RANKS.filter((r) => r.group === group).map((rank) => {
              const ref = `${force}/${rank.code}`
              const label = rankName(rank, force, language)
              return (
                <button
                  key={rank.code}
                  type="button"
                  className={value === ref ? 'insignia-pick on' : 'insignia-pick'}
                  title={`${rank.code} · ${label}`}
                  onClick={() => onPick(ref, label)}
                >
                  <img src={natoInsigniaUrl(rank.code)} alt="" />
                  <span>{rank.code}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="insignia-grid-wrap">
        <p className="field-label">Pins do clã</p>
        <div className="insignia-grid">
          {pins.map((pin) => {
            const ref = `clan/${pin.id}`
            return (
              <button
                key={pin.id}
                type="button"
                className={value === ref ? 'insignia-pick on' : 'insignia-pick'}
                title={pin.label}
                onClick={() => onPick(ref, pin.label)}
              >
                <img src={pin.src} alt="" />
                <span>{pin.label || 'Pin'}</span>
              </button>
            )
          })}
          <button type="button" className="insignia-pick insignia-add" onClick={() => input.current?.click()}>
            <span className="insignia-add-plus">+</span>
            <span>Enviar</span>
          </button>
        </div>
        <input
          ref={input}
          type="file"
          hidden
          multiple
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            void addPins(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {ownPin ? (
        <div className="row2 insignia-own">
          <Field
            label="Nome do pin"
            value={ownPin.label}
            placeholder="Capitão"
            onChange={(label) =>
              patch((d) => {
                const p = d.clan.pins.find((x) => x.id === ownPin.id)
                if (p) p.label = label
              })
            }
          />
          <button type="button" className="btn-ghost" onClick={() => removePin(ownPin.id)}>
            Apagar pin
          </button>
        </div>
      ) : null}

      <p className="field-hint">
        {chosen
          ? chosen.code
            ? `${chosen.code} · ${chosen.label}. Desenho genérico pelo código OTAN, sem a cor de nenhum país.`
            : `${chosen.label || 'Pin do clã'}. Os pins enviados ficam no dossiê e servem para todas as assinaturas.`
          : 'Escolha a patente ou envie os pins do clã (PNG com fundo transparente). Sem escolha, a folha mostra o logo do clã.'}
      </p>
    </div>
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
