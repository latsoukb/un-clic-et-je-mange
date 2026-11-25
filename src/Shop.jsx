import React, { useState } from 'react'
import { ExternalLink, Copy, PackageCheck, Info, Plus, Minus, AlertTriangle } from 'lucide-react'
import { useApp } from './store.jsx'
import { RAYONS, REFERENCE_BASKET } from './data.js'
import { fmtQty, stockRows, stepFor } from './lib.js'
import { Title, Box } from './ui.jsx'

// Quantité à acheter pour couvrir le mois (on arrondit au-dessus ; paquets entiers si applicable).
const buyQty = (ing, need) => {
  const q = Math.ceil(need - 1e-9)
  return ing.pack ? Math.ceil(q / ing.pack.size) * ing.pack.size : q
}
const packNote = (ing, need) => (ing.pack ? `${Math.ceil(need / ing.pack.size)} ${ing.pack.label}${Math.ceil(need / ing.pack.size) > 1 ? 's' : ''} de ${ing.pack.size} g` : null)

export function Courses() {
  const { data, update } = useApp()
  const s = data.settings
  const all = stockRows(data) // contient ing + need
  const checked = (id) => !data.unchecked[id]
  const nbChecked = all.filter((r) => checked(r.id)).length
  const [copied, setCopied] = useState(false)

  const url = s.storeUrl.trim() || `https://www.ubereats.com/search?q=${encodeURIComponent(s.store || 'Walmart')}`
  const total = parseFloat(String(data.total).replace(',', '.'))
  const pct = total > 0 && s.budget > 0 ? Math.round((total / s.budget) * 100) : null

  const toggle = (id) => update((d) => { d.unchecked[id] ? delete d.unchecked[id] : (d.unchecked[id] = true); return d })
  const copy = async () => {
    const lines = all.filter((r) => checked(r.id)).map((r) => `- ${r.ing.name} : ${fmtQty(buyQty(r.ing, r.need.q), r.ing.unit)}`)
    try { await navigator.clipboard.writeText(`Courses du mois\n${lines.join('\n')}`); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { alert(lines.join('\n')) }
  }
  const received = () => {
    if (!confirm(`Ajouter ${nbChecked} article(s) coché(s) à ton stock ?`)) return
    update((d) => { all.filter((r) => !d.unchecked[r.id]).forEach((r) => { d.bought[r.id] = (d.bought[r.id] || 0) + buyQty(r.ing, r.need.q) }); return d })
  }

  return (
    <div>
      <Title sub={`Générée depuis ton plan · ${s.persons} ${s.persons > 1 ? 'personnes' : 'personne'}`}>Courses du mois</Title>

      <section className="card mx-5 p-5" aria-label="Budget">
        <p className="text-sm text-ink-soft">Budget du mois : <strong className="text-ink">{s.budget} $</strong></p>
        <label className="block mt-3 text-sm font-semibold" htmlFor="total">Total réel de ton panier ($)</label>
        <input id="total" className="field mt-1" inputMode="decimal" placeholder="Saisis le total affiché sur Uber Eats" value={data.total} onChange={(e) => update((d) => { d.total = e.target.value; return d })} />
        {pct !== null && (
          <div className="mt-3">
            <div className="h-2.5 rounded-full bg-surface-mid overflow-hidden"><div className={`h-full ${pct > 100 ? 'bg-danger' : 'bg-sage'}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
            <p className={`text-sm font-semibold mt-1.5 ${pct > 100 ? 'text-danger' : 'text-sage'}`}>{total.toFixed(2).replace('.', ',')} $ — {pct} % du budget{pct > 100 ? ` (+${(total - s.budget).toFixed(2).replace('.', ',')} $)` : ''}</p>
          </div>
        )}
        <p className="text-xs text-ink-soft mt-3">Aucun prix n’est inventé : l’app ne connaît pas les prix de ton magasin. Pour info, le brief mentionne ≈ {REFERENCE_BASKET.amount} $ ({REFERENCE_BASKET.label}) — une estimation, pas un total garanti.</p>
      </section>

      {RAYONS.map((ray) => {
        const list = all.filter((r) => r.ing.rayon === ray.id)
        if (!list.length) return null
        return (
          <section key={ray.id} className="mt-5 px-5" aria-label={ray.label}>
            <h2 className="text-sm font-bold text-ink-soft mb-2">{ray.label} <span className="font-medium">· {list.length}</span></h2>
            <ul className="card divide-y divide-line list-none p-0 m-0 overflow-hidden">
              {list.map((r) => (
                <li key={r.id} className="flex items-center gap-3 p-4">
                  <Box checked={checked(r.id)} onChange={() => toggle(r.id)} label={`Garder ${r.ing.name} dans le panier`} />
                  <div className={`flex-1 min-w-0 ${checked(r.id) ? '' : 'opacity-50 line-through'}`}>
                    <p className="font-semibold leading-snug">{r.ing.name}</p>
                    <p className="text-xs text-ink-soft">{r.need.uses} repas{r.need.approx ? ' · quantité estimée' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{fmtQty(buyQty(r.ing, r.need.q), r.ing.unit)}</p>
                    {packNote(r.ing, r.need.q) && <p className="text-xs text-ink-soft">{packNote(r.ing, r.need.q)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      <section className="card mx-5 mt-6 p-5">
        <div className="flex gap-3 rounded-2xl bg-amber-soft text-amber p-3 text-sm leading-relaxed">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p>Le panier <strong>n’est pas pré-rempli</strong> : Uber Eats et Walmart n’ont pas d’API publique pour ça. Le bouton ouvre Uber Eats ({s.storeUrl.trim() ? 'lien de ton magasin' : 'recherche du magasin « ' + (s.store || 'Walmart') + ' »'}) ; ajoute les articles cochés ci-dessus un par un, puis valide et paie toi-même. Tu peux décocher ce que tu as déjà.</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-sage w-full mt-4 !py-4 no-underline"><ExternalLink size={18} /> Ouvrir dans Uber Eats</a>
        <button onClick={copy} className="btn-ghost w-full mt-2"><Copy size={18} /> {copied ? 'Liste copiée ✓' : `Copier la liste (${nbChecked} articles)`}</button>
        <button onClick={received} className="btn-ghost w-full mt-2"><PackageCheck size={18} /> J’ai reçu ma commande</button>
        <p className="text-xs text-ink-soft mt-2 text-center">« J’ai reçu ma commande » ajoute les articles cochés à ton stock.</p>
      </section>
    </div>
  )
}

const BADGE = {
  rupture: ['Rupture', 'bg-danger-soft text-danger'],
  bas: ['Bientôt épuisé', 'bg-amber-soft text-amber'],
  achat: ['À acheter', 'bg-surface-mid text-ink-soft'],
  ok: ['En stock', 'bg-sage-soft/50 text-sage']
}
const ORDER = { rupture: 0, bas: 1, achat: 2, ok: 3 }

export function Stock() {
  const { data, update } = useApp()
  const rows = stockRows(data).sort((a, b) => ORDER[a.status] - ORDER[b.status])
  const alerts = rows.filter((r) => r.status === 'rupture' || r.status === 'bas')
  const adjust = (id, delta) => update((d) => { d.bought[id] = Math.max(0, (d.bought[id] || 0) + delta); return d })

  return (
    <div>
      <Title sub={alerts.length ? `${alerts.length} à racheter bientôt` : 'Acheté − consommé = restant'}>Mon stock</Title>
      {alerts.length > 0 && (
        <div className="mx-5 mb-3 flex items-start gap-3 rounded-2xl bg-amber-soft text-amber px-4 py-3 text-sm font-semibold">
          <AlertTriangle size={20} className="shrink-0" />
          <p>À racheter : {alerts.map((r) => r.ing.name).join(', ')}.</p>
        </div>
      )}
      <ul className="px-5 flex flex-col gap-3 list-none m-0">
        {rows.map((r) => {
          const [label, cls] = BADGE[r.status]
          const pct = r.bought ? Math.min(100, Math.round((r.rest / r.bought) * 100)) : 0
          const u = r.ing.unit, st = stepFor(u)
          return (
            <li key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-bold leading-snug">{r.ing.name}</p><p className="text-xs text-ink-soft">{RAYONS.find((x) => x.id === r.ing.rayon).label}</p></div>
                <span className={`rounded-full text-xs font-bold px-2.5 py-1 whitespace-nowrap ${cls}`}>{label}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-mid mt-3 overflow-hidden" aria-hidden="true"><div className={`h-full ${r.status === 'rupture' || r.status === 'bas' ? 'bg-flame' : 'bg-sage'}`} style={{ width: `${pct}%` }} /></div>
              <dl className="grid grid-cols-3 gap-2 mt-3 text-center text-xs text-ink-soft">
                <div><dt>Acheté</dt><dd className="m-0 text-sm font-bold text-ink">{fmtQty(r.bought, u)}</dd></div>
                <div><dt>Consommé</dt><dd className="m-0 text-sm font-bold text-ink">{fmtQty(r.cons, u)}</dd></div>
                <div><dt>Restant</dt><dd className="m-0 text-sm font-bold text-primary">{fmtQty(r.rest, u)}</dd></div>
              </dl>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center bg-surface-mid rounded-full p-1">
                  <button aria-label={`Moins de ${r.ing.name}`} onClick={() => adjust(r.id, -st)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center"><Minus size={16} /></button>
                  <span className="px-3 text-xs font-semibold min-w-[3.5rem] text-center">{st > 1 ? `±${st} ${u}` : '±1'}</span>
                  <button aria-label={`Plus de ${r.ing.name}`} onClick={() => adjust(r.id, st)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center"><Plus size={16} /></button>
                </div>
                <button onClick={() => adjust(r.id, buyQty(r.ing, r.need.q))} className="btn-ghost !py-2">J’ai acheté ({fmtQty(buyQty(r.ing, r.need.q), u)})</button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
