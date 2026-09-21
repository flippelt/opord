import { create } from 'zustand'
import { defaultDossier, migrateDossier } from './defaults'
import { idbGet, idbSet } from './lib/idb'
import type { Dossier } from './types'

const KEY = 'dossier'

let persistTimer: ReturnType<typeof setTimeout> | undefined

function persist(dossier: Dossier) {
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    void idbSet(KEY, dossier)
  }, 280)
}

interface Store {
  dossier: Dossier
  zoom: number
  exporting: string
  hydrate: () => Promise<void>
  setDossier: (dossier: Dossier) => void
  patch: (recipe: (draft: Dossier) => void) => void
  setZoom: (zoom: number) => void
  setExporting: (msg: string) => void
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('idb timeout')), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      },
    )
  })
}

export const useDossier = create<Store>((set, get) => ({
  dossier: defaultDossier(),
  zoom: 0.78,
  exporting: '',
  async hydrate() {
    try {
      const saved = await withTimeout(idbGet<Dossier>(KEY), 1200)
      const migrated = migrateDossier(saved)
      if (migrated) set({ dossier: migrated })
    } catch {
      /* keep the in-memory default */
    }
  },
  setDossier(dossier) {
    const next = migrateDossier(dossier)
    if (!next) return
    set({ dossier: next })
    persist(next)
  },
  patch(recipe) {
    const next = structuredClone(get().dossier)
    recipe(next)
    set({ dossier: next })
    persist(next)
  },
  setZoom(zoom) {
    set({ zoom })
  },
  setExporting(msg) {
    set({ exporting: msg })
  },
}))
