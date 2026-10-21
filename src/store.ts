import { create } from 'zustand'
import { defaultDossier, migrateDossier } from './defaults'
import { idbGet, idbSet } from './lib/idb'
import type { DocType, Dossier, PageId } from './types'

/** Novo dossiê em criação: nada é gravado até a pessoa confirmar. */
export type Wizard = { step: 'type' | 'pages'; type: DocType; pages: PageId[] }

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
  /** Passo do editor: `setup` ou a chave de uma folha (ver lib/sheets). */
  active: string
  /** Campo com foco no menu; o palco realça o que tem o mesmo `data-edit`. */
  focus: string
  previewOpen: boolean
  wizard: Wizard | null
  setWizard: (wizard: Wizard | null) => void
  setActive: (key: string) => void
  setFocus: (key: string) => void
  setPreviewOpen: (open: boolean) => void
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
  active: 'setup',
  focus: '',
  previewOpen: false,
  wizard: null,
  setWizard(wizard) {
    set({ wizard, focus: '' })
  },
  setActive(active) {
    set({ active, focus: '' })
  },
  setFocus(focus) {
    set({ focus })
  },
  setPreviewOpen(previewOpen) {
    set({ previewOpen })
  },
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
