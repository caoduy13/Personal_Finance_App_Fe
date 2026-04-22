// Zustand jar store managing list and selected jar.
import { create } from 'zustand'
import { jarService } from '../services/jarService'

export const useJarStore = create((set, get) => ({
  jars: [],
  selectedJar: null,
  isLoading: false,
  fetchJars: async () => {
    set({ isLoading: true })
    const jars = await jarService.getJars()
    set({ jars, selectedJar: jars[0] || null, isLoading: false })
    return jars
  },
  updateJar: async (jarId, payload) => {
    const updated = await jarService.updateJar(jarId, payload)
    const jars = get().jars.map((jar) => (jar.id === jarId ? { ...jar, ...updated } : jar))
    const selectedJar = get().selectedJar?.id === jarId ? { ...get().selectedJar, ...updated } : get().selectedJar
    set({ jars, selectedJar })
    return updated
  },
  setSelectedJar: (jar) => set({ selectedJar: jar }),
}))
