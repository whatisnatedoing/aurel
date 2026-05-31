'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRingStore } from '@/lib/store'

export default function SaveDesignModal() {
  const { saveModal, setSaveModal, user, setAuthModal, setSavedDesigns, savedDesigns } = useRingStore()
  const config = useRingStore(s => ({
    ringType: s.ringType, metal: s.metal, bandStyle: s.bandStyle,
    bandWidth: s.bandWidth, stoneShape: s.stoneShape,
    stoneColor: s.stoneColor, engraving: s.engraving,
  }))
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (saveModal) document.body.classList.add('modal-open')
    else document.body.classList.remove('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [saveModal])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { setSaveModal(false); setAuthModal('login'); return }
    setSaving(true)
    const res = await fetch('/api/designs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || 'My Design', config }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setSavedDesigns([data.design, ...savedDesigns])
      setDone(true)
      setTimeout(() => { setSaveModal(false); setDone(false); setName('') }, 1600)
    }
  }

  return (
    <AnimatePresence>
      {saveModal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSaveModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full sm:max-w-xs rounded-t-2xl sm:rounded-lg border-t sm:border border-aurel-border p-7"
            style={{ background: '#0e0d0b' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1 bg-gold-faint rounded-full mx-auto mb-6" />
            {done ? (
              <div className="text-center py-6">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <p className="text-gold font-serif text-2xl italic mb-2">Saved ✓</p>
                  <p className="text-xs text-gold-muted">Your design has been saved</p>
                </motion.div>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-xl font-light text-[#f0ead8] mb-5">Save Design</h2>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[9px] tracking-[2px] text-gold-muted uppercase block mb-1.5">Design Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Our Forever Ring"
                      className="w-full bg-aurel-card border border-aurel-border rounded px-3 py-3 text-sm
                                 text-[#f0ead8] outline-none focus:border-gold transition-colors" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full py-3.5 border border-gold text-gold text-[11px] tracking-[3px]
                               uppercase rounded-sm transition-all hover:bg-gold hover:text-aurel-bg disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save Design'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
