import { useRef } from 'react'

type Props = {
  label: string
  hint?: string
  src: string
  onChange: (dataUrl: string) => void
  readFile: (file: File) => Promise<string>
}

export function ImageField({ label, hint, src, onChange, readFile }: Props) {
  const input = useRef<HTMLInputElement>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    const data = await readFile(file)
    onChange(data)
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div
        className="drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          void onFile(e.dataTransfer.files[0])
        }}
      >
        {src ? <img src={src} alt="" /> : <span>Solte a imagem ou clique para subir</span>}
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>
      <div className="drop-actions">
        <button type="button" className="btn-ghost" onClick={() => input.current?.click()}>
          Escolher arquivo
        </button>
        {src ? (
          <button type="button" className="btn-ghost" onClick={() => onChange('')}>
            Remover
          </button>
        ) : null}
      </div>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  )
}

type TextProps = {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
}

export function Field({ label, hint, value, onChange, placeholder, multiline, rows = 4 }: TextProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  )
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string }[]
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
