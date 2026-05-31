'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRingStore } from '@/lib/store'

export default function Navbar() {
  const { user, setUser, setAuthModal, setSavedDesigns } = useRingStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) {
        setUser(d.user)
        fetch('/api/designs').then(r => r.json()).then(dd => {
          if (dd.designs) setSavedDesigns(dd.designs)
        })
      }
    })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null); setSavedDesigns([])
    setMobileMenuOpen(false)
  }

  return (
    <nav className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 border-b border-aurel-border relative z-30">
      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
        <div>
          <p className="font-serif text-lg md:text-xl tracking-[5px] md:tracking-[6px] text-gold uppercase font-light">Aurel</p>
          <p className="text-[8px] md:text-[9px] tracking-[3px] text-gold-muted uppercase mt-0.5">Bespoke Fine Jewellery</p>
        </div>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[2px] text-gold-muted uppercase">
        <Link href="/" className="hover:text-gold transition-colors">Configure</Link>
        {user && <Link href="/designs" className="hover:text-gold transition-colors">My Designs</Link>}
        <Link href="#" className="hover:text-gold transition-colors">Collections</Link>
        <Link href="#" className="hover:text-gold transition-colors">Atelier</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/account" className="text-gold">{user.name.split(' ')[0]}</Link>
            <button onClick={handleLogout}
              className="px-4 py-2 border border-gold-faint text-gold-muted text-[10px] tracking-[2px]
                         rounded-sm hover:border-gold hover:text-gold transition-colors">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => setAuthModal('login')} className="hover:text-gold transition-colors">Sign In</button>
            <button onClick={() => setAuthModal('register')}
              className="px-4 py-2 border border-gold text-gold text-[10px] tracking-[2px]
                         rounded-sm hover:bg-gold hover:text-aurel-bg transition-all">
              Register
            </button>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMobileMenuOpen(v => !v)}
        aria-label="Menu">
        <span className={`block w-5 h-px bg-gold transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-px bg-gold transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-px bg-gold transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-aurel-border z-50"
          style={{ background: '#0c0b09' }}>
          <div className="flex flex-col px-5 py-4 gap-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}
              className="text-[11px] tracking-[3px] text-gold-muted uppercase hover:text-gold transition-colors">
              Configure
            </Link>
            {user && (
              <Link href="/designs" onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] tracking-[3px] text-gold-muted uppercase hover:text-gold transition-colors">
                My Designs
              </Link>
            )}
            <Link href="#" onClick={() => setMobileMenuOpen(false)}
              className="text-[11px] tracking-[3px] text-gold-muted uppercase hover:text-gold transition-colors">
              Collections
            </Link>
            {user ? (
              <div className="flex flex-col gap-3 pt-2 border-t border-aurel-border">
                <Link href="/account" onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] tracking-[3px] text-gold uppercase">
                  {user.name}
                </Link>
                <button onClick={handleLogout}
                  className="text-left text-[11px] tracking-[3px] text-gold-muted uppercase hover:text-gold transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2 border-t border-aurel-border">
                <button onClick={() => { setAuthModal('login'); setMobileMenuOpen(false) }}
                  className="flex-1 py-2.5 border border-gold text-gold text-[11px] tracking-[2px]
                             uppercase rounded-sm hover:bg-gold hover:text-aurel-bg transition-all">
                  Sign In
                </button>
                <button onClick={() => { setAuthModal('register'); setMobileMenuOpen(false) }}
                  className="flex-1 py-2.5 bg-gold text-aurel-bg text-[11px] tracking-[2px] uppercase rounded-sm">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
