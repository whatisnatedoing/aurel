'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useRingStore, METAL_COLORS, STONE_COLORS } from '@/lib/store'
import ConfigPanel from '@/components/ConfigPanel'

// Dynamically import canvas so it doesn't SSR (Three.js is client-only)
const RingCanvas = dynamic(() => import('@/components/RingCanvas'), { ssr: false })

export default function Home() {
  const { ringType, metal, stoneShape, stoneColor } = useRingStore()
  const stoneName = STONE_COLORS[stoneColor].name
  const shapeName = stoneShape.charAt(0).toUpperCase() + stoneShape.slice(1)

  return (
    <main className="min-h-screen bg-aurel-bg flex flex-col">
      {/* ── Top nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-aurel-border">
        <div>
          <p className="font-serif text-xl tracking-[6px] text-gold uppercase font-light">Aurel</p>
          <p className="text-[9px] tracking-[3px] text-gold-muted uppercase mt-0.5">Bespoke Fine Jewellery</p>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[2px] text-gold-muted uppercase">
          <a href="#" className="hover:text-gold transition-colors">Collections</a>
          <a href="#" className="hover:text-gold transition-colors">About</a>
          <a href="#" className="hover:text-gold transition-colors">Atelier</a>
          <button className="px-4 py-2 border border-gold-faint text-gold text-[10px] tracking-[2px] rounded-sm hover:border-gold transition-colors">
            Book Consultation
          </button>
        </div>
      </nav>

      {/* ── Main configurator ── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 'calc(100vh - 73px)' }}>

        {/* Canvas area */}
        <div className="flex-1 relative bg-aurel-surface flex flex-col items-center justify-center border-r border-aurel-border">

          {/* Ambient label top-left */}
          <div className="absolute top-6 left-6">
            <motion.p
              key={ringType}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] tracking-[3px] text-gold-muted uppercase"
            >
              {ringType}
            </motion.p>
            <motion.p
              key={`${stoneShape}-${stoneColor}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-sm text-gold/70 italic mt-0.5"
            >
              {shapeName} {stoneName}
            </motion.p>
          </div>

          {/* Metal badge top-right */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: METAL_COLORS[metal].mid }}
            />
            <span className="text-[10px] tracking-[2px] text-gold-muted uppercase">
              {METAL_COLORS[metal].name}
            </span>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full" style={{ minHeight: '500px' }}>
            <RingCanvas />
          </div>

          {/* Bottom hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <p className="text-[9px] tracking-[3px] text-gold-faint uppercase text-center">
              Drag to rotate · Scroll to zoom
            </p>
          </div>
        </div>

        {/* Config panel */}
        <div className="w-[340px] shrink-0">
          <ConfigPanel />
        </div>
      </div>
    </main>
  )
}
