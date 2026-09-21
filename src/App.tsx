import { useEffect } from 'react'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { useDossier } from './store'

export function App() {
  const hydrate = useDossier((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <div className="app">
      <Editor />
      <Preview />
    </div>
  )
}
