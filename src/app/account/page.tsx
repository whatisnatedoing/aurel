'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRingStore } from '@/lib/store'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AuthModal from '@/components/ui/AuthModal'

export default function AccountPage() {
  const { user, setUser, savedDesigns, setSavedDesigns, setAuthModal } = useRingStore()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) { setName(user.name); setLoading(false) }
    else setLoading(false)
  }, [user])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null); setSavedDesigns([])
  }

  const stats = [
    { label: 'Designs Saved', value: savedDesigns.length },
    { label: 'Ring Types', value: new Set(savedDesigns.map(d => d.config.ringType)).size },
    { label: 'Metals Tried', value: new Set(savedDesigns.map(d => d.config.metal)).size },
  ]

  return (
    <main className="min-h-screen bg-aurel-bg flex flex-col">
      <Navbar />
      <AuthModal />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mb-8 md:mb-12">
          <p className="text-[9px] tracking-[4px] text-gold-muted uppercase mb-2">Profile</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#f0ead8]">My Account</h1>
        </div>

        {!user && !loading ? (
          <div className="flex flex-col items-center py-24 text-center">
            <p className="font-serif text-xl text-[#f0ead8] mb-6">You're not signed in</p>
            <div className="flex gap-3">
              <button onClick={() => setAuthModal('login')}
                className="px-6 py-2.5 border border-gold text-gold text-[11px] tracking-[3px]
                           uppercase rounded-sm transition-all hover:bg-gold hover:text-aurel-bg">
                Sign In
              </button>
              <button onClick={() => setAuthModal('register')}
                className="px-6 py-2.5 bg-gold text-aurel-bg text-[11px] tracking-[3px] uppercase rounded-sm">
                Register
              </button>
            </div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Avatar + greeting */}
            <div className="flex items-center gap-5 p-6 border border-aurel-border rounded-lg"
              style={{ background: '#0e0d0b' }}>
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                <span className="font-serif text-2xl text-gold font-light">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-serif text-xl text-[#f0ead8]">{user.name}</p>
                <p className="text-xs text-gold-muted mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(s => (
                <div key={s.label} className="p-4 border border-aurel-border rounded-lg text-center"
                  style={{ background: '#0e0d0b' }}>
                  <p className="font-serif text-3xl text-gold font-light">{s.value}</p>
                  <p className="text-[9px] tracking-[2px] text-gold-muted uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/designs"
                className="flex items-center justify-between p-4 border border-aurel-border rounded-lg
                           hover:border-gold transition-colors group" style={{ background: '#0e0d0b' }}>
                <div>
                  <p className="text-sm text-[#f0ead8] group-hover:text-gold transition-colors">My Designs</p>
                  <p className="text-[10px] text-gold-muted mt-0.5">{savedDesigns.length} saved</p>
                </div>
                <span className="text-gold-muted group-hover:text-gold transition-colors">→</span>
              </Link>
              <Link href="/"
                className="flex items-center justify-between p-4 border border-aurel-border rounded-lg
                           hover:border-gold transition-colors group" style={{ background: '#0e0d0b' }}>
                <div>
                  <p className="text-sm text-[#f0ead8] group-hover:text-gold transition-colors">Ring Configurator</p>
                  <p className="text-[10px] text-gold-muted mt-0.5">Design a new ring</p>
                </div>
                <span className="text-gold-muted group-hover:text-gold transition-colors">→</span>
              </Link>
            </div>

            {/* Sign out */}
            <div className="pt-2">
              <button onClick={handleLogout}
                className="text-[11px] tracking-[2px] text-gold-muted uppercase border border-gold-faint
                           px-5 py-2.5 rounded-sm hover:border-red-700 hover:text-red-400 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </main>
  )
}
