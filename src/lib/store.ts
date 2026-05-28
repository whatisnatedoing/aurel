import { create } from 'zustand'

export type MetalType = 'yellow' | 'rose' | 'white' | 'platinum' | 'black'
export type BandStyle = 'Plain' | 'Pavé' | 'Twisted' | 'Milgrain'
export type StoneShape = 'round' | 'oval' | 'princess' | 'emerald' | 'pear' | 'heart'
export type StoneColor = 'diamond' | 'sapphire' | 'ruby' | 'emerald' | 'amethyst' | 'none'
export type RingType = 'Engagement Ring' | 'Wedding Band' | 'Promise Ring'

export interface RingConfig {
  ringType: RingType
  metal: MetalType
  bandStyle: BandStyle
  bandWidth: number       // 1–5 mm
  stoneShape: StoneShape
  stoneColor: StoneColor
  engraving: string
}

interface RingStore extends RingConfig {
  setRingType: (v: RingType) => void
  setMetal: (v: MetalType) => void
  setBandStyle: (v: BandStyle) => void
  setBandWidth: (v: number) => void
  setStoneShape: (v: StoneShape) => void
  setStoneColor: (v: StoneColor) => void
  setEngraving: (v: string) => void
}

export const useRingStore = create<RingStore>((set) => ({
  ringType: 'Engagement Ring',
  metal: 'yellow',
  bandStyle: 'Plain',
  bandWidth: 2,
  stoneShape: 'round',
  stoneColor: 'diamond',
  engraving: '',

  setRingType: (ringType) => set({ ringType }),
  setMetal: (metal) => set({ metal }),
  setBandStyle: (bandStyle) => set({ bandStyle }),
  setBandWidth: (bandWidth) => set({ bandWidth }),
  setStoneShape: (stoneShape) => set({ stoneShape }),
  setStoneColor: (stoneColor) => set({ stoneColor }),
  setEngraving: (engraving) => set({ engraving }),
}))

export const METAL_COLORS: Record<MetalType, {
  base: string; mid: string; dark: string; shine: string; name: string
}> = {
  yellow:   { base: '#c9a84c', mid: '#e8c84a', dark: '#8a6a18', shine: '#f5e090', name: 'Yellow Gold' },
  rose:     { base: '#c97858', mid: '#e8a880', dark: '#8a4828', shine: '#f5c8a8', name: 'Rose Gold' },
  white:    { base: '#c0c0c0', mid: '#e0e0e0', dark: '#888888', shine: '#f8f8f8', name: 'White Gold' },
  platinum: { base: '#b0b4bc', mid: '#cdd0d8', dark: '#808488', shine: '#eceef2', name: 'Platinum' },
  black:    { base: '#2a2a2a', mid: '#404040', dark: '#0a0a0a', shine: '#606060', name: 'Black Gold' },
}

export const STONE_COLORS: Record<StoneColor, {
  inner: string | null; outer: string | null; highlight: string | null; name: string
}> = {
  diamond:  { inner: '#e8f0ff', outer: '#c0d4f0', highlight: '#ffffff',  name: 'Diamond'  },
  sapphire: { inner: '#4a7cc9', outer: '#1a3a78', highlight: '#88aaee',  name: 'Sapphire' },
  ruby:     { inner: '#e84040', outer: '#8a0a0a', highlight: '#ff8888',  name: 'Ruby'     },
  emerald:  { inner: '#40b060', outer: '#0a5820', highlight: '#80e0a0',  name: 'Emerald'  },
  amethyst: { inner: '#a070d0', outer: '#502888', highlight: '#d0a8f8',  name: 'Amethyst' },
  none:     { inner: null,      outer: null,      highlight: null,        name: 'No Stone' },
}
