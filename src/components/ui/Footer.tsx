'use client'

import Link from 'next/link'

const SOCIAL = [
  {
    name: 'Instagram', href: 'https://instagram.com/aurelrings',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  },
  {
    name: 'Pinterest', href: 'https://pinterest.com/aurelrings',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.15 1.22-5.15s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.28-1.95 3.28-4.77 0-2.49-1.79-4.23-4.35-4.23-2.96 0-4.7 2.22-4.7 4.51 0 .89.34 1.85.77 2.37a.31.31 0 0 1 .07.3c-.08.32-.25 1.04-.28 1.18-.04.19-.14.23-.32.14C5.75 14.59 5 13.05 5 11.25 5 8.1 7.36 5.2 11.7 5.2c3.51 0 6.24 2.5 6.24 5.84 0 3.48-2.19 6.28-5.24 6.28-1.02 0-1.98-.53-2.31-1.16l-.63 2.35c-.23.88-.84 1.98-1.25 2.65.94.29 1.94.44 2.99.44 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
  },
  {
    name: 'TikTok', href: 'https://tiktok.com/@aurelrings',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
  },
  {
    name: 'Facebook', href: 'https://facebook.com/aurelrings',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#080807', borderTop: '0.5px solid #1e1c16' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {/* Brand — full width on smallest screens */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-lg tracking-[6px] text-gold uppercase font-light mb-1">Aurel</p>
          <p className="text-[9px] tracking-[3px] text-gold-muted uppercase mb-4">Bespoke Fine Jewellery</p>
          <p className="text-xs text-gold-muted leading-relaxed max-w-[220px]">
            Handcrafted rings designed by you, brought to life by master jewellers.
          </p>
          <div className="flex gap-3 mt-5">
            {SOCIAL.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-gold-muted hover:text-gold transition-colors" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[9px] tracking-[3px] text-gold-muted uppercase mb-4">Collections</p>
          <ul className="space-y-2.5">
            {['Engagement Rings','Wedding Bands','Promise Rings','Eternity Rings','Bespoke'].map(l => (
              <li key={l}><Link href="#" className="text-xs text-gold-muted hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[9px] tracking-[3px] text-gold-muted uppercase mb-4">Company</p>
          <ul className="space-y-2.5">
            {['About Aurel','Our Atelier','Sustainability','Press','Careers'].map(l => (
              <li key={l}><Link href="#" className="text-xs text-gold-muted hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[9px] tracking-[3px] text-gold-muted uppercase mb-4">Help</p>
          <ul className="space-y-2.5">
            {['Ring Size Guide','Shipping & Returns','Care Guide','Book Consultation','Contact Us'].map(l => (
              <li key={l}><Link href="#" className="text-xs text-gold-muted hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '0.5px solid #1a1810' }} className="px-5 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-[10px] text-gold-faint tracking-wide order-2 sm:order-1">
            © {new Date().getFullYear()} Aurel. All rights reserved.
          </p>
          <p className="text-[10px] text-gold-faint tracking-wide order-1 sm:order-2">
            Built by{' '}
            <a href="https://danbury.studio" target="_blank" rel="noopener noreferrer"
              className="text-gold-muted hover:text-gold transition-colors underline underline-offset-2">
              Danbury
            </a>
          </p>
          <div className="flex gap-4 order-3">
            {['Privacy','Terms','Cookies'].map(l => (
              <Link key={l} href="#" className="text-[10px] text-gold-faint hover:text-gold-muted transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
