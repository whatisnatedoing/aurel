'use client'

import { motion } from 'framer-motion'
import { useRingStore, METAL_COLORS, STONE_COLORS } from '@/lib/store'
import type { RingType, MetalType, BandStyle, StoneShape, StoneColor } from '@/lib/store'
import clsx from 'clsx'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[9px] tracking-[3px] text-gold-muted uppercase mb-2 block">{children}</span>
}
function Divider() {
  return <div className="h-px bg-aurel-subtle mb-5" />
}
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={clsx(
        'px-3 py-1.5 rounded-full text-[11px] tracking-wide border transition-all duration-200',
        active ? 'border-gold bg-gold text-aurel-bg font-medium'
               : 'border-gold-faint text-gold-muted hover:border-gold hover:text-gold'
      )}>
      {label}
    </button>
  )
}

const METAL_SWATCHES: { key: MetalType; gradient: string }[] = [
  { key: 'yellow',   gradient: 'linear-gradient(135deg,#e8c84a,#c9a84c,#a8882e)' },
  { key: 'rose',     gradient: 'linear-gradient(135deg,#e8b4a0,#d4896e,#b86b50)' },
  { key: 'white',    gradient: 'linear-gradient(135deg,#e8e8e8,#c8c8c8,#a8a8a8)' },
  { key: 'platinum', gradient: 'linear-gradient(135deg,#d0d4dc,#b0b4bc,#909498)' },
  { key: 'black',    gradient: 'linear-gradient(135deg,#3a3a3a,#1e1e1e,#0a0a0a)' },
]
const STONE_SWATCHES: { key: StoneColor; gradient: string }[] = [
  { key: 'diamond',  gradient: 'linear-gradient(135deg,#f0f4ff,#d8e4f8,#c0d0e8)' },
  { key: 'sapphire', gradient: 'linear-gradient(135deg,#4a7cc9,#2856a0,#1a3a78)' },
  { key: 'ruby',     gradient: 'linear-gradient(135deg,#e84040,#c02020,#8a0a0a)' },
  { key: 'emerald',  gradient: 'linear-gradient(135deg,#40b060,#208040,#0a5820)' },
  { key: 'amethyst', gradient: 'linear-gradient(135deg,#a070d0,#7848b0,#502888)' },
  { key: 'none',     gradient: '#1a1a1a' },
]
const SHAPE_ICONS: Record<StoneShape, React.ReactNode> = {
  round:    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><circle cx="10" cy="10" r="7" strokeWidth="1.2"/><circle cx="10" cy="10" r="3.5" strokeWidth="0.8" strokeDasharray="1.5 1.5"/></svg>,
  oval:     <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><ellipse cx="10" cy="10" rx="5" ry="7.5" strokeWidth="1.2"/></svg>,
  princess: <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="4" y="4" width="12" height="12" strokeWidth="1.2"/><line x1="4" y1="4" x2="16" y2="16" strokeWidth="0.6"/><line x1="16" y1="4" x2="4" y2="16" strokeWidth="0.6"/></svg>,
  emerald:  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><rect x="5" y="3.5" width="10" height="13" rx="1.5" strokeWidth="1.2"/><rect x="7" y="5.5" width="6" height="9" rx="0.5" strokeWidth="0.7"/></svg>,
  pear:     <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 3 C13.5 3 16 5.5 16 9 C16 13 13 16.5 10 17 C7 16.5 4 13 4 9 C4 5.5 6.5 3 10 3Z" strokeWidth="1.2"/></svg>,
  heart:    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 16 C10 16 3 11 3 6.5 A3.5 3.5 0 0 1 10 5.5 A3.5 3.5 0 0 1 17 6.5 C17 11 10 16 10 16Z" strokeWidth="1.2"/></svg>,
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[11px] mb-1 tracking-wide">
      <span className="text-gold-muted">{label}</span>
      <span className="text-gold truncate ml-2 text-right max-w-[160px]">{value}</span>
    </div>
  )
}

interface ConfigPanelProps {
  onViewRing?: () => void
}

export default function ConfigPanel({ onViewRing }: ConfigPanelProps) {
  const {
    ringType, setRingType, metal, setMetal,
    bandStyle, setBandStyle, bandWidth, setBandWidth,
    stoneShape, setStoneShape, stoneColor, setStoneColor,
    engraving, setEngraving, user, setAuthModal, setSaveModal,
  } = useRingStore()

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5 md:p-6 bg-aurel-panel">
      <div className="text-center pb-4 border-b border-aurel-border mb-5">
        <p className="font-serif text-xs tracking-[4px] text-gold uppercase">Configure Your Ring</p>
      </div>

      {/* Ring Type */}
      <div className="mb-5">
        <SectionLabel>Ring Type</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {(['Engagement Ring','Wedding Band','Promise Ring'] as RingType[]).map(t => (
            <Pill key={t} label={t} active={ringType===t} onClick={() => setRingType(t)} />
          ))}
        </div>
      </div>
      <Divider />

      {/* Metal */}
      <div className="mb-5">
        <SectionLabel>Metal</SectionLabel>
        <div className="flex gap-3 flex-wrap">
          {METAL_SWATCHES.map(({ key, gradient }) => (
            <button key={key} title={METAL_COLORS[key].name} onClick={() => setMetal(key)}
              className={clsx('w-8 h-8 rounded-full transition-all hover:scale-110',
                metal===key ? 'ring-2 ring-gold ring-offset-2 ring-offset-aurel-panel' : '')}
              style={{ background: gradient }} />
          ))}
        </div>
        <p className="text-[10px] text-gold-muted mt-2 tracking-wider">{METAL_COLORS[metal].name}</p>
      </div>
      <Divider />

      {/* Band Style */}
      <div className="mb-4">
        <SectionLabel>Band Style</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {(['Plain','Pavé','Twisted','Milgrain'] as BandStyle[]).map(s => (
            <Pill key={s} label={s} active={bandStyle===s} onClick={() => setBandStyle(s)} />
          ))}
        </div>
      </div>

      {/* Band Width */}
      <div className="mb-5">
        <SectionLabel>Band Width</SectionLabel>
        <div className="flex items-center gap-3">
          <input type="range" min={1} max={5} step={1} value={bandWidth}
            onChange={e => setBandWidth(Number(e.target.value))} className="flex-1" />
          <span className="text-gold text-xs min-w-[32px] text-right">{bandWidth}mm</span>
        </div>
      </div>
      <Divider />

      {/* Stone Shape */}
      <div className="mb-4">
        <SectionLabel>Stone Shape</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(SHAPE_ICONS) as StoneShape[]).map(shape => (
            <button key={shape} title={shape} onClick={() => setStoneShape(shape)}
              className={clsx('w-10 h-10 border rounded-md flex items-center justify-center transition-all',
                stoneShape===shape
                  ? 'border-gold bg-aurel-card [&_svg]:stroke-gold'
                  : 'border-gold-faint hover:border-gold [&_svg]:stroke-gold-muted hover:[&_svg]:stroke-gold')}>
              {SHAPE_ICONS[shape]}
            </button>
          ))}
        </div>
      </div>

      {/* Stone Color */}
      <div className="mb-5">
        <SectionLabel>Stone</SectionLabel>
        <div className="flex gap-3 flex-wrap">
          {STONE_SWATCHES.map(({ key, gradient }) => (
            <button key={key} title={STONE_COLORS[key].name} onClick={() => setStoneColor(key)}
              className={clsx('w-8 h-8 rounded-full transition-all hover:scale-110',
                stoneColor===key ? 'ring-2 ring-gold ring-offset-2 ring-offset-aurel-panel' : '')}
              style={{ background: gradient, border: key==='none' ? '1px solid #333' : 'none' }} />
          ))}
        </div>
        <p className="text-[10px] text-gold-muted mt-2 tracking-wider">{STONE_COLORS[stoneColor].name}</p>
      </div>
      <Divider />

      {/* Engraving */}
      <div className="mb-5">
        <SectionLabel>Engraving</SectionLabel>
        <input type="text" maxLength={20} placeholder="Your message…" value={engraving}
          onChange={e => setEngraving(e.target.value)}
          className="w-full border-b border-gold-faint focus:border-gold pb-1.5 px-0.5
                     text-base font-serif italic tracking-widest transition-colors placeholder:text-gold-faint" />
        <p className="text-[10px] text-gold-faint mt-1 text-right">{engraving.length}/20</p>
      </div>
      <Divider />

      {/* Summary */}
      <div className="bg-aurel-card border border-aurel-subtle rounded-lg p-3 mb-5">
        <SummaryRow label="Type"      value={ringType} />
        <SummaryRow label="Metal"     value={METAL_COLORS[metal].name} />
        <SummaryRow label="Band"      value={`${bandStyle} · ${bandWidth}mm`} />
        <SummaryRow label="Stone"     value={`${stoneShape.charAt(0).toUpperCase()+stoneShape.slice(1)} ${STONE_COLORS[stoneColor].name}`} />
        <SummaryRow label="Engraving" value={engraving.trim() || '—'} />
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2 mt-auto">
        {/* Mobile: "View Ring" shortcut */}
        {onViewRing && (
          <button onClick={onViewRing}
            className="md:hidden w-full py-2.5 border border-aurel-border text-gold-muted
                       text-[10px] tracking-[3px] uppercase rounded-sm transition-colors hover:border-gold hover:text-gold">
            ← View Ring in 3D
          </button>
        )}
        <button onClick={() => setSaveModal(true)}
          className="w-full py-3 border border-gold text-gold text-[11px] tracking-[3px]
                     uppercase rounded-sm transition-all hover:bg-gold hover:text-aurel-bg"
          style={{ background: 'transparent' }}>
          Save Design
        </button>
        {!user && (
          <button onClick={() => setAuthModal('login')}
            className="text-[10px] tracking-[2px] text-gold-muted uppercase transition-colors hover:text-gold text-center py-1">
            Sign in to save designs →
          </button>
        )}
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gold text-aurel-bg text-[11px] tracking-[3px] uppercase rounded-sm font-medium">
          Request a Quote
        </motion.button>
      </div>

      {/* Bottom spacing for mobile scroll */}
      <div className="h-6 md:hidden" />
    </div>
  )
}
