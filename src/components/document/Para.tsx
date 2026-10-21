/** Parágrafo numerado das folhas de relatório (SITREP, AAR). */
export function Para({ label, text, edit }: { label: string; text: string; edit?: string }) {
  return (
    <section className="sitrep-para" data-edit={edit}>
      <h2>{label}</h2>
      <p>{text || '—'}</p>
    </section>
  )
}

/** Linha "rótulo · valor" do cabeçalho das folhas de relatório. */
export function MetaLine({ label, value, edit }: { label: string; value: string; edit?: string }) {
  return (
    <div className="notice-line" data-edit={edit}>
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  )
}
