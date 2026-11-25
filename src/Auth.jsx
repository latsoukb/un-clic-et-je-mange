import React, { useState } from 'react'
import { UserRound, Mail, Lock, ArrowRight } from 'lucide-react'
import { useApp } from './store.jsx'

// Défini hors du composant : sinon React recrée le champ à chaque frappe,
// le champ perd le focus et le clavier se referme après chaque lettre.
const Row = ({ Icon, ...p }) => (
  <div className="relative">
    <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
    <input className="field !pl-11" required {...p} />
  </div>
)

export default function Auth() {
  const { register, login } = useApp()
  const [mode, setMode] = useState('register')
  const [f, setF] = useState({ name: '', email: '', pw: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const m = mode === 'register' ? await register(f.name, f.email, f.pw) : await login(f.email, f.pw)
      if (m) setErr(m)
    } catch (x) { setErr(x.message || 'Erreur inattendue.') }
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 bg-surface">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-3xl" aria-hidden="true">🍽️</div>
      <h1 className="text-[26px] font-extrabold tracking-tight mt-4 text-center">Un clic et je mange</h1>
      <p className="text-ink-soft text-sm text-center max-w-xs mt-2">Ton plan repas du mois, tes courses et ton stock, sans te prendre la tête.</p>

      <div className="w-full max-w-sm mt-8">
        <div className="grid grid-cols-2 bg-surface-mid rounded-2xl p-1 mb-4" role="tablist">
          {[['register', 'Créer un compte'], ['login', 'Se connecter']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setErr('') }}
              className={`py-2.5 rounded-xl text-sm font-semibold ${mode === k ? 'bg-white shadow-card' : 'text-ink-soft'}`}>{l}</button>
          ))}
        </div>
        <form onSubmit={submit} className="card p-5 flex flex-col gap-3">
          {mode === 'register' && <Row Icon={UserRound} placeholder="Ton prénom ou nom" aria-label="Nom" value={f.name} onChange={set('name')} autoComplete="name" />}
          <Row Icon={Mail} type="email" placeholder="ton@courriel.com" aria-label="Courriel" value={f.email} onChange={set('email')} autoComplete="email" />
          <Row Icon={Lock} type="password" placeholder="Mot de passe (8 caractères min.)" aria-label="Mot de passe" value={f.pw} onChange={set('pw')} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
          {err && <p role="alert" className="text-sm text-danger bg-danger-soft rounded-xl px-3 py-2">{err}</p>}
          <button className="btn-primary" disabled={busy}>{mode === 'register' ? 'Créer mon compte' : 'Me connecter'} <ArrowRight size={18} /></button>
        </form>
        <p className="text-xs text-ink-soft text-center mt-4 leading-relaxed">
          Ton compte et tes données restent sur cet appareil (dans ce navigateur). Il n’y a pas de serveur : si tu effaces les données du navigateur, tout disparaît et le mot de passe ne peut pas être récupéré.
        </p>
      </div>
    </div>
  )
}
