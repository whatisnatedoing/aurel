'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useRingStore, METAL_COLORS, STONE_COLORS } from '@/lib/store'
import type { SavedDesign, RingConfig } from '@/lib/store'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AuthModal from '@/components/ui/AuthModal'

const RingCanvas = dynamic(() => import('@/components/RingCanvas'), { ssr: false })

function DesignPreviewCanvas({ config }: { config: RingConfig }) {
  const { loadConfig } = useRingStore()
  useEffect(() => { loadConfig(config) }, [config])
  return <RingCanvas />
}

function DesignCard({
  design, onLoad, onDelete, isActive
}: {
  design: SavedDesign
  onLoad: () => void
  onDelete: () => void
  isActive: boolean
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const mc = METAL_COLORS[design.config.metal]
  const sc = STONE_COLORS[design.config.stoneColor]
  const date = new Date(design.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer group
        ${isActive ? 'border-gold' : 'border-aurel-border hover:border-gold-muted'}`}
      style={{ background: '#0e0d0b' }}
      onClick={onLoad}
    >
      {/* Ring preview thumbnail */}
      <div className="relative h-40 bg-aurel-surface flex items-center justify-center overflow-hidden">
        {/* Colour swatch preview instead of full canvas for perf */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Band circle */}
          <div className="absolute w-28 h-28 rounded-full border-[10px]"
            style={{
              borderColor: mc.base,
              background: 'transparent',
              boxShadow: `0 0 20px ${mc.base}40, inset 0 0 10px ${mc.dark}60`
            }} />
          {/* Stone dot */}
          {sc.inner && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${sc.highlight ?? sc.inner}, ${sc.outer ?? sc.inner})`,
                boxShadow: `0 0 8px ${sc.inner}80`
              }} />
          )}
        </div>
        {/* Active badge */}
        {isActive && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-gold rounded-full">
            <span className="text-[8px] tracking-[2px] text-aurel-bg uppercase font-medium">Active</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-base text-[#f0ead8] mb-1 truncate">{design.name}</h3>
        <p className="text-[10px] tracking-wider text-gold-muted mb-0.5">
          {design.config.ringType}
        </p>
        <p className="text-[10px] text-gold-faint">
          {mc.name} · {design.config.stoneShape.charAt(0).toUpperCase()+design.config.stoneShape.slice(1)} {sc.name}
        </p>
        <p className="text-[9px] text-gold-faint mt-2">{date}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
          <Link href="/"
            onClick={onLoad}
            className="flex-1 py-1.5 border border-gold text-gold text-[10px] tracking-[2px]
                       uppercase text-center rounded-sm transition-all hover:bg-gold hover:text-aurel-bg">
            Edit
          </Link>
          {confirmDelete ? (
            <div className="flex gap-1 flex-1">
              <button onClick={onDelete}
                className="flex-1 py-1.5 bg-red-900/50 border border-red-800 text-red-400
                           text-[9px] tracking-[1px] uppercase rounded-sm transition-colors hover:bg-red-900">
                Confirm
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 py-1.5 border border-gold-faint text-gold-muted
                           text-[9px] tracking-[1px] uppercase rounded-sm">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 border border-gold-faint text-gold-muted text-[10px]
                         tracking-[2px] uppercase rounded-sm transition-colors hover:border-red-700 hover:text-red-400">
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function DesignsPage() {
  const router = useRouter()
  const { user, savedDesigns, setSavedDesigns, loadConfig, setAuthModal } = useRingStore()
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetch('/api/designs')
      .then(r => r.json())
      .then(d => { if (d.designs) setSavedDesigns(d.designs) })
      .finally(() => setLoading(false))
  }, [user])

  function handleLoad(design: SavedDesign) {
    loadConfig(design.config)
    setActiveId(design.id)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/designs/${id}`, { method: 'DELETE' })
    setSavedDesigns(savedDesigns.filter(d => d.id !== id))
    if (activeId === id) setActiveId(null)
  }

  return (
    <main className="min-h-screen bg-aurel-bg flex flex-col">
      <Navbar />
      <AuthModal />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-[9px] tracking-[4px] text-gold-muted uppercase mb-2">Your Collection</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#f0ead8]">Saved Designs</h1>
        </div>

        {/* Not logged in */}
        {!user && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full border border-gold-faint flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                className="w-7 h-7 text-gold-muted">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z"/>
                <path d="M2.4 21.6c0-5.3 4.3-9.6 9.6-9.6s9.6 4.3 9.6 9.6"/>
              </svg>
            </div>
            <p className="font-serif text-xl text-[#f0ead8] mb-2">Sign in to see your designs</p>
            <p className="text-sm text-gold-muted mb-8">Create an account to save and revisit your ring designs.</p>
            <div className="flex gap-3">
              <button onClick={() => setAuthModal('login')}
                className="px-6 py-2.5 border border-gold text-gold text-[11px] tracking-[3px]
                           uppercase rounded-sm transition-all hover:bg-gold hover:text-aurel-bg">
                Sign In
              </button>
              <button onClick={() => setAuthModal('register')}
                className="px-6 py-2.5 bg-gold text-aurel-bg text-[11px] tracking-[3px]
                           uppercase rounded-sm font-medium">
                Register
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border border-gold-faint border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {user && !loading && savedDesigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full border border-gold-faint flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                className="w-7 h-7 text-gold-muted">
                <circle cx="12" cy="12" r="8"/>
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="6"/>
              </svg>
            </div>
            <p className="font-serif text-xl text-[#f0ead8] mb-2">No designs yet</p>
            <p className="text-sm text-gold-muted mb-8">Start designing your perfect ring and save it here.</p>
            <Link href="/"
              className="px-6 py-2.5 bg-gold text-aurel-bg text-[11px] tracking-[3px]
                         uppercase rounded-sm font-medium hover:bg-gold-light transition-colors">
              Start Designing
            </Link>
          </div>
        )}

        {/* Grid */}
        {user && !loading && savedDesigns.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-gold-muted tracking-wider">
                {savedDesigns.length} design{savedDesigns.length !== 1 ? 's' : ''} saved
              </p>
              <Link href="/"
                className="text-[11px] tracking-[2px] text-gold uppercase border border-gold-faint
                           px-4 py-1.5 rounded-sm hover:border-gold transition-colors">
                + New Design
              </Link>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {savedDesigns.map(design => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    isActive={activeId === design.id}
                    onLoad={() => handleLoad(design)}
                    onDelete={() => handleDelete(design.id)}
                  />
                ))}
              </div>
            </AnimatePresence>

            {activeId && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 border border-gold/30 rounded-lg bg-gold/5 flex items-center justify-between"
              >
                <p className="text-sm text-gold-muted">
                  Design loaded — <span className="text-gold">continue customising in the configurator</span>
                </p>
                <Link href="/"
                  className="px-5 py-2 bg-gold text-aurel-bg text-[11px] tracking-[3px]
                             uppercase rounded-sm font-medium hover:bg-gold-light transition-colors">
                  Configure →
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
