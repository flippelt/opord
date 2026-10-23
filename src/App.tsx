import { useEffect, type CSSProperties } from 'react'
import { useResizableWidth } from 'rpg-prop-kit'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { useDossier } from './store'

export function App() {
  const hydrate = useDossier((s) => s.hydrate)
  const { width, collapsed, setCollapsed, handleProps } = useResizableWidth({ storageKey: 'opord.desk', minWidth: 340 })

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <div
      className={collapsed ? 'app is-collapsed' : 'app'}
      style={{ '--desk-w': `${width}px` } as CSSProperties}
    >
      {collapsed ? null : <Editor onCollapse={() => setCollapsed(true)} />}
      {collapsed ? null : (
        <div className="desk-resizer" {...handleProps} />
      )}
      <Preview collapsed={collapsed} onExpand={() => setCollapsed(false)} />
    </div>
  )
}
