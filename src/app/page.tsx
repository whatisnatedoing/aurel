'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRingStore, METAL_COLORS, STONE_COLORS } from '@/lib/store'
import ConfigPanel from '@/components/ConfigPanel'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AuthModal from '@/components/ui/AuthModal'
import SaveDesignModal from '@/components/ui/SaveDesignModal'

const RingCanvas = dynamic(() => import('@/components/RingCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border border-gold-faint border-t-gold rounded-full animate-spin" />
        <p className="text-[10px] tracking-[3px] text-gold-faint uppercase">Loading…</p>
      </div>
    </div>
  )
})

function CanvasArea() {
  const { ringType, metal, stoneShape, stoneColor } = useRingStore()
  const stoneName = STONE_COLORS[stoneColor].name
  const shapeName = stoneShape.charAt(0).toUpperCase() + stoneShape.slice(1)

  return (
    <div className="relative w-full h-full bg-aurel-surface flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <motion.p key={ringType} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-[9px] md:text-[10px] tracking-[3px] text-gold-muted uppercase">
          {ringType}
        </motion.p>
        <motion.p key={`${stoneShape}-${stoneColor}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-xs md:text-sm text-gold/70 italic mt-0.5">
          {shapeName} {stoneName}
        </motion.p>
      </div>

      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ background: METAL_COLORS[metal].mid }} />
        <span className="text-[9px] md:text-[10px] tracking-[2px] text-gold-muted uppercase hidden sm:block">
          {METAL_COLORS[metal].name}
        </span>
      </div>

      <div className="w-full h-full"><RingCanvas /></div>

      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-10">
        <p className="text-[8px] md:text-[9px] tracking-[2px] text-gold-faint uppercase text-center whitespace-nowrap">
          Drag to rotate · Scroll to zoom
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const [mobileTab, setMobileTab] = useState<'ring' | 'config'>('ring')

  return (
    <main className="min-h-screen bg-aurel-bg flex flex-col">
      <Navbar />
      <AuthModal />
      <SaveDesignModal />

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b border-aurel-border shrink-0">
        {(['ring', 'config'] as const).map(tab => (
          <button key={tab} onClick={() => setMobileTab(tab)}
            className={`flex-1 py-3 text-[10px] tracking-[3px] uppercase font-medium transition-colors
              ${mobileTab === tab ? 'text-gold border-b-2 border-gold' : 'text-gold-muted'}`}>
            {tab === 'ring' ? '3D Preview' : 'Customise'}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden"
        style={{ minHeight: 'calc(100svh - 73px - 41px)' }}>

        {/* ── Mobile: 3D view tab ── */}
        <div className={`md:hidden flex-1 ${mobileTab === 'ring' ? 'flex' : 'hidden'} flex-col`}
          style={{ minHeight: '62vw', maxHeight: '72vw' }}>
          <CanvasArea />
        </div>

        {/* ── Mobile: config tab ── */}
        <div className={`md:hidden flex-1 overflow-y-auto ${mobileTab === 'config' ? 'block' : 'hidden'}`}>
          <ConfigPanel onViewRing={() => setMobileTab('ring')} />
        </div>

        {/* ── Desktop: always side by side ── */}
        <div className="hidden md:flex flex-1 border-r border-aurel-border">
          <CanvasArea />
        </div>
        <div className="hidden md:block w-[340px] shrink-0 overflow-y-auto border-l border-aurel-border">
          <ConfigPanel />
        </div>
      </div>

      <Footer />
    </main>
  )
}
