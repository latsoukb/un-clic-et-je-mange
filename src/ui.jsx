import React from 'react'
import { Check } from 'lucide-react'
import { recipeById } from './lib.js'

export const Tile = ({ id, size = 'md' }) => {
  const r = typeof id === 'string' ? recipeById(id) : id
  const s = { sm: 'w-16 h-16 text-3xl rounded-2xl', md: 'w-20 h-20 text-4xl rounded-2xl', lg: 'w-full aspect-[16/9] text-7xl rounded-3xl' }[size]
  return (
    <div className={`${s} flex items-center justify-center shrink-0`} style={{ background: r.hue }} role="img" aria-label={r.name}>
      <span aria-hidden="true">{r.emoji}</span>
    </div>
  )
}

export const Box = ({ checked, onChange, label }) => (
  <button type="button" role="checkbox" aria-checked={checked} aria-label={label} onClick={onChange}
    className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center border transition ${checked ? 'bg-sage border-sage text-white' : 'bg-surface-mid border-line'}`}>
    {checked && <Check size={16} strokeWidth={3} />}
  </button>
)

export const Title = ({ children, sub }) => (
  <div className="px-5 pt-5 pb-3">
    <h1 className="text-[26px] leading-8 font-extrabold tracking-tight">{children}</h1>
    {sub && <p className="text-sm text-ink-soft mt-1">{sub}</p>}
  </div>
)

export function Sheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/30" onClick={onClose}>
      <div role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl mx-auto bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="btn-ghost !py-1.5" onClick={onClose}>Fermer</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Toggle = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
    className={`w-12 h-7 rounded-full p-0.5 transition shrink-0 ${on ? 'bg-primary' : 'bg-surface-high'}`}>
    <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
  </button>
)
