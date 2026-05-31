'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRingStore } from '@/lib/store'

export default function AuthModal() {
  const { authModal, setAuthModal, setUser, setSavedDesigns } = useRingStore()
  const isOpen = authModal !== 'none'
  const isLogin = authModal === 'login'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) document.body.classList.add('modal-open')
    else document.body.classList.remove('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin ? { email, password } : { name, email, password }
    const res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setUser(data.user)
    // Load designs after login
    fetch('/api/designs').then(r => r.json()).then(d => { if (d.designs) setSavedDesigns(d.designs) })
    setAuthModal('none')
    setName(''); setEmail(''); setPassword('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setAuthModal('none')}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-lg border-t sm:border border-aurel-border p-7 sm:p-8"
            style={{ background: '#0e0d0b' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar for mobile sheet */}
            <div className="sm:hidden w-10 h-1 bg-gold-faint rounded-full mx-auto mb-6" />

            <p className="font-serif text-[10px] tracking-[4px] text-gold uppercase text-center mb-1">Aurel</p>
            <h2 className="font-serif text-2xl font-light text-center text-[#f0ead8] mb-6">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div>
                  <label className="text-[9px] tracking-[2px] text-gold-muted uppercase block mb-1.5">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-aurel-card border border-aurel-border rounded px-3 py-3 text-sm
                               text-[#f0ead8] outline-none focus:border-gold transition-colors"
                    placeholder="Your name" />
                </div>
              )}
              <div>
                <label className="text-[9px] tracking-[2px] text-gold-muted uppercase block mb-1.5">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-aurel-card border border-aurel-border rounded px-3 py-3 text-sm
                             text-[#f0ead8] outline-none focus:border-gold transition-colors"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] text-gold-muted uppercase block mb-1.5">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-aurel-card border border-aurel-border rounded px-3 py-3 text-sm
                             text-[#f0ead8] outline-none focus:border-gold transition-colors"
                  placeholder="••••••••" />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 border border-gold text-gold text-[11px] tracking-[3px]
                           uppercase rounded-sm transition-all hover:bg-gold hover:text-aurel-bg disabled:opacity-50 mt-1">
                {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-gold-muted mt-5">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button className="text-gold underline underline-offset-2"
                onClick={() => setAuthModal(isLogin ? 'register' : 'login')}>
                {isLogin ? 'Register' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
