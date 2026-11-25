import React from 'react'
import { LogOut, Trash2, RotateCcw } from 'lucide-react'
import { useApp } from './store.jsx'
import { BREAKFASTS, DEFAULT_PLAN } from './data.js'
import { todayISO } from './lib.js'
import { Title, Toggle } from './ui.jsx'

const Sec = ({ title, sub, children }) => (
  <section className="mx-5 mt-5"><h2 className="text-lg font-bold">{title}</h2>{sub && <p className="text-sm text-ink-soft">{sub}</p>}<div className="card mt-2 p-4 flex flex-col gap-4">{children}</div></section>
)
const Row = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{label}</p>{hint && <p className="text-xs text-ink-soft">{hint}</p>}</div>{children}</div>
)

export default function Reglages() {
  const { user, data, update, logout, deleteAccount } = useApp()
  const s = data.settings
  const set = (k, v) => update((d) => { d.settings[k] = v; return d })
  const toggleBf = (id) => {
    const on = s.breakfastOpts.includes(id)
    if (on && s.breakfastOpts.length === 1) return // au moins un petit-déjeuner
    set('breakfastOpts', on ? s.breakfastOpts.filter((x) => x !== id) : [...s.breakfastOpts, id])
  }

  return (
    <div>
      <Title sub={`Connecté : ${user.name} (${user.email})`}>Réglages</Title>

      <Sec title="Budget & personnes">
        <div>
          <div className="flex justify-between"><label htmlFor="budget" className="font-semibold">Budget mensuel</label><span className="font-extrabold text-primary">{s.budget} $</span></div>
          <input id="budget" type="range" min="100" max="400" step="10" value={s.budget} onChange={(e) => set('budget', +e.target.value)} className="w-full accent-[#9f3d00] mt-2" />
        </div>
        <Row label="Nombre de personnes" hint="Multiplie les quantités">
          <div className="flex items-center bg-surface-mid rounded-full p-1">
            <button aria-label="Moins de personnes" className="w-9 h-9 rounded-full bg-white" onClick={() => set('persons', Math.max(1, s.persons - 1))}>−</button>
            <span className="px-4 font-bold">{s.persons}</span>
            <button aria-label="Plus de personnes" className="w-9 h-9 rounded-full bg-white" onClick={() => set('persons', Math.min(6, s.persons + 1))}>+</button>
          </div>
        </Row>
      </Sec>

      <Sec title="Magasin" sub="Pour le bouton « Ouvrir dans Uber Eats »">
        <div><label htmlFor="store" className="font-semibold text-sm">Magasin préféré</label><input id="store" className="field mt-1" value={s.store} onChange={(e) => set('store', e.target.value)} placeholder="Walmart" /></div>
        <div><label htmlFor="surl" className="font-semibold text-sm">Lien Uber Eats du magasin (facultatif)</label>
          <input id="surl" className="field mt-1" value={s.storeUrl} onChange={(e) => set('storeUrl', e.target.value)} placeholder="https://www.ubereats.com/…" inputMode="url" />
          <p className="text-xs text-ink-soft mt-1">Colle ici le lien de la page de ton magasin sur Uber Eats pour y arriver directement. Sans lien, l’app lance une recherche du nom du magasin.</p></div>
      </Sec>

      <Sec title="Alimentation" sub="Le plan de départ respecte déjà ces contraintes.">
        {[['halal', 'Halal'], ['noPork', 'Sans porc'], ['noFish', 'Sans poisson'], ['noRice', 'Sans riz'], ['vegLimit', 'Légumes : tomate et concombre seulement']].map(([k, l]) => (
          <Row key={k} label={l}><Toggle on={s[k]} onChange={(v) => set(k, v)} label={l} /></Row>
        ))}
      </Sec>

      <Sec title="Équipement">
        <Row label="Air fryer" hint="Sinon, les recettes affichent poêle / four"><Toggle on={s.airfryer} onChange={(v) => set('airfryer', v)} label="Air fryer" /></Row>
      </Sec>

      <Sec title="Petits-déjeuners" sub="Rotation entre ceux que tu gardes (1 minimum)">
        {BREAKFASTS.map((b) => (
          <Row key={b.id} label={`${b.emoji} ${b.name}`}><Toggle on={s.breakfastOpts.includes(b.id)} onChange={() => toggleBf(b.id)} label={b.name} /></Row>
        ))}
        <Row label="Inclure dans les courses"><Toggle on={s.breakfastInCart} onChange={(v) => set('breakfastInCart', v)} label="Inclure les petits-déjeuners dans les courses" /></Row>
      </Sec>

      <Sec title="Plan">
        <div><label htmlFor="start" className="font-semibold text-sm">Premier jour du plan (semaine 1)</label>
          <input id="start" type="date" className="field mt-1" value={data.start} onChange={(e) => e.target.value && update((d) => { d.start = e.target.value; return d })} /></div>
        <button className="btn-ghost" onClick={() => update((d) => { d.start = todayISO(); return d })}><RotateCcw size={16} /> Recommencer le plan aujourd’hui</button>
        <button className="btn-ghost" onClick={() => confirm('Remettre le plan de départ de Lat ?') && update((d) => { d.plan = [...DEFAULT_PLAN]; return d })}>Remettre le plan de départ</button>
      </Sec>

      <Sec title="Compte" sub="Données stockées uniquement sur cet appareil.">
        <button className="btn-ghost" onClick={logout}><LogOut size={16} /> Se déconnecter</button>
        <button className="btn bg-danger-soft text-danger" onClick={() => confirm('Supprimer ton compte et toutes tes données sur cet appareil ?') && deleteAccount()}><Trash2 size={16} /> Supprimer mon compte</button>
      </Sec>
      <p className="text-center text-xs text-ink-soft mt-6 px-5">Un clic et je mange</p>
    </div>
  )
}
