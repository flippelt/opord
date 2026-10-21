import { useEffect, useState, type CSSProperties } from 'react'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { useDossier } from './store'

const WIDTH_KEY = 'opord.desk.width'
const COLLAPSED_KEY = 'opord.desk.collapsed'
const MIN_WIDTH = 340
const DEFAULT_WIDTH = 460

function readNumber(key: string, fallback: number) {
  try {
    const value = Number(localStorage.getItem(key))
    return Number.isFinite(value) && value > 0 ? value : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sem armazenamento: o menu volta ao padrão na próxima visita */
  }
}

function maxWidth() {
  return Math.max(MIN_WIDTH, Math.round(window.innerWidth * 0.6))
}

export function App() {
  const hydrate = useDossier((s) => s.hydrate)
  const [width, setWidth] = useState(() => Math.min(readNumber(WIDTH_KEY, DEFAULT_WIDTH), maxWidth()))
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  function toggle(next: boolean) {
    setCollapsed(next)
    save(COLLAPSED_KEY, next ? '1' : '0')
  }

  function startResize(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    const handle = e.currentTarget
    handle.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => setWidth(Math.min(maxWidth(), Math.max(MIN_WIDTH, ev.clientX)))
    const stop = (ev: PointerEvent) => {
      handle.releasePointerCapture(ev.pointerId)
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', stop)
      setWidth((w) => {
        save(WIDTH_KEY, String(w))
        return w
      })
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', stop)
  }

  function nudge(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 60 : 20
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = Math.min(maxWidth(), Math.max(MIN_WIDTH, width + (e.key === 'ArrowRight' ? step : -step)))
    setWidth(next)
    save(WIDTH_KEY, String(next))
  }

  return (
    <div
      className={collapsed ? 'app is-collapsed' : 'app'}
      style={{ '--desk-w': `${width}px` } as CSSProperties}
    >
      {collapsed ? null : <Editor onCollapse={() => toggle(true)} />}
      {collapsed ? null : (
        <div
          className="desk-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label="Largura do menu"
          aria-valuenow={width}
          aria-valuemin={MIN_WIDTH}
          tabIndex={0}
          onPointerDown={startResize}
          onKeyDown={nudge}
          onDoubleClick={() => {
            setWidth(DEFAULT_WIDTH)
            save(WIDTH_KEY, String(DEFAULT_WIDTH))
          }}
        />
      )}
      <Preview collapsed={collapsed} onExpand={() => toggle(false)} />
    </div>
  )
}
