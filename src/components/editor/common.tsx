import type { ReactNode } from 'react'
import { useDossier } from '../../store'
import { Field } from '../ImageField'

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
  return (
    <Group title="Assinatura" hint="A mesma em todas as folhas que a levam.">
      <Field
        label="Comandante / signatário"
        edit="command"
        value={dossier.command.commander}
        onChange={(commander) => patch((d) => void (d.command.commander = commander))}
      />
      <div className="row2">
        <Field
          label="Posto"
          edit="command"
          value={dossier.command.rank}
          onChange={(rank) => patch((d) => void (d.command.rank = rank))}
        />
        <Field
          label="Indicativo"
          edit="command"
          value={dossier.command.callsign}
          onChange={(callsign) => patch((d) => void (d.command.callsign = callsign))}
        />
      </div>
      <Field
        label="Função"
        edit="command"
        value={dossier.command.billet}
        onChange={(billet) => patch((d) => void (d.command.billet = billet))}
      />
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
