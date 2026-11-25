import React, { useState } from 'react'
import { Clock, Flame, Users, Check, ArrowLeft, ChevronRight, MoreHorizontal, AlertTriangle, Wind } from 'lucide-react'
import { useApp } from './store.jsx'
import { INGREDIENTS, STAPLES, RECIPES } from './data.js'
import { recipeById, recipeForDate, breakfastFor, todayISO, addDays, cycleStart, planIndex, fmtDate, ingredientText, stockRows, lowCount, PLAN_DAYS } from './lib.js'
import { Tile, Title, Sheet } from './ui.jsx'

// ── Recette complète : ingrédients exacts, portions, temps, étapes ──
export function RecipeView({ recipe, children }) {
  const { data } = useApp()
  const { persons, airfryer } = data.settings
  return (
    <article>
      <div className="px-5"><Tile id={recipe} size="lg" /></div>
      <div className="px-5 mt-4">
        <h2 className="text-[26px] leading-8 font-extrabold tracking-tight">{recipe.name}</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="chip"><Clock size={14} /> Prép. {recipe.prep} min</span>
          <span className="chip"><Flame size={14} /> Cuisson {recipe.cook} min</span>
          <span className="chip"><Users size={14} /> {persons} {persons > 1 ? 'personnes' : 'personne'}</span>
          {airfryer && <span className="chip"><Wind size={14} /> Air fryer</span>}
        </div>
      </div>
      {children}
      <section className="card mx-5 mt-5 p-5" aria-label="Ingrédients">
        <h3 className="text-lg font-bold">Ingrédients</h3>
        <ul className="mt-3 divide-y divide-line list-none p-0 m-0">
          {recipe.ing.map((l) => (
            <li key={l.i} className="flex justify-between gap-3 py-2.5">
              <span>{INGREDIENTS[l.i].name}</span>
              <span className="font-semibold text-primary text-right">
                {ingredientText(l, persons)}
                {l.approx && <span className="block text-[11px] font-medium text-ink-soft">quantité estimée</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-ink-soft mt-3">À la maison : {recipe.staples.join(', ')}.</p>
      </section>
      <section className="card mx-5 mt-4 p-5" aria-label="Étapes">
        <h3 className="text-lg font-bold">Étapes</h3>
        <ol className="mt-3 flex flex-col gap-3 list-none p-0 m-0">
          {recipe.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 shrink-0 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <span className="leading-relaxed">{s.t} {s.af || s.alt ? <strong className="font-semibold">{airfryer ? s.af : s.alt}</strong> : null}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}

// ── Accueil : le plat du jour, recette visible tout de suite (0 clic) ──
export function Today() {
  const { user, data, update } = useApp()
  const date = todayISO()
  const recipe = recipeForDate(data, date)
  const tomorrow = recipeForDate(data, addDays(date, 1))
  const done = !!data.done[date]
  const bf = breakfastFor(data, date)
  const bDone = !!data.bdone[date]
  const alerts = lowCount(stockRows(data))
  const p = data.settings.persons

  const toggleDinner = () => update((d) => { d.done[date] ? delete d.done[date] : (d.done[date] = { r: recipe.id, p }); return d })
  const toggleBf = () => update((d) => { d.bdone[date] ? delete d.bdone[date] : (d.bdone[date] = { b: bf.id, p }); return d })

  return (
    <div>
      <Title sub={fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}>Salut {user.name.split(' ')[0]} 👋</Title>

      {alerts > 0 && (
        <a href="#/stock" className="mx-5 mb-4 flex items-center gap-3 rounded-2xl bg-amber-soft text-amber px-4 py-3 text-sm font-semibold no-underline">
          <AlertTriangle size={20} /> {alerts} {alerts > 1 ? 'ingrédients bientôt épuisés' : 'ingrédient bientôt épuisé'} <ChevronRight size={18} className="ml-auto" />
        </a>
      )}

      {bf && (
        <div className="card mx-5 mb-4 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center text-2xl" aria-hidden="true">{bf.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-soft">Petit-déjeuner</p>
            <p className="font-semibold leading-snug">{bf.name}</p>
          </div>
          <button onClick={toggleBf} className={bDone ? 'btn-sage !px-4' : 'btn-ghost !px-4'} aria-pressed={bDone}>{bDone ? <><Check size={16} /> Fait</> : 'Fait'}</button>
        </div>
      )}

      <RecipeView recipe={recipe}>
        <div className="px-5 mt-4">
          <button onClick={toggleDinner} aria-pressed={done} className={`${done ? 'btn-sage' : 'btn-primary'} w-full !py-4 text-base`}>
            <Check size={20} /> {done ? 'Repas fait (toucher pour annuler)' : 'J’ai cuisiné ce repas'}
          </button>
          <p className="text-xs text-ink-soft text-center mt-2">Cocher « fait » retire les ingrédients de ton stock.</p>
        </div>
      </RecipeView>

      <a href={`#/recette/${tomorrow.id}`} className="card mx-5 mt-5 p-4 flex items-center gap-3 no-underline text-ink">
        <Tile id={tomorrow} size="sm" />
        <div className="flex-1"><p className="text-xs text-ink-soft">Demain</p><p className="font-semibold leading-snug">{tomorrow.name}</p></div>
        <ChevronRight size={20} className="text-ink-soft" />
      </a>
    </div>
  )
}

export function RecipeScreen({ id }) {
  const r = recipeById(id)
  if (!r) return <Title>Recette introuvable</Title>
  return (
    <div>
      <div className="px-5 pt-4 pb-3"><a href="#/semaine" className="btn-ghost !px-3 no-underline text-ink"><ArrowLeft size={18} /> Semaine</a></div>
      <RecipeView recipe={r} />
    </div>
  )
}

// ── Semaine : 4 semaines × 7 soirs, déplacer / remplacer ──
export function Week() {
  const { data, update } = useApp()
  const today = todayISO()
  const cycle = cycleStart(data.start, today)
  const [w, setW] = useState(Math.floor(planIndex(data.start, today) / 7))
  const [menu, setMenu] = useState(null) // { i, mode }
  const dateOf = (i) => addDays(cycle, i)
  const daysDone = Object.keys(data.done).filter((d) => d >= cycle && d < addDays(cycle, PLAN_DAYS)).length
  const weekDone = Array.from({ length: 7 }, (_, k) => w * 7 + k).filter((i) => data.done[dateOf(i)]).length

  const replace = (i, id) => { update((d) => { d.plan[i] = id; return d }); setMenu(null) }
  const swap = (i, j) => { update((d) => { [d.plan[i], d.plan[j]] = [d.plan[j], d.plan[i]]; return d }); setMenu(null) }

  return (
    <div>
      <Title sub={`${data.settings.persons} ${data.settings.persons > 1 ? 'personnes' : 'personne'} · ${daysDone}/28 repas faits ce mois`}>Plan du mois</Title>
      <div className="flex gap-2 px-5 overflow-x-auto pb-1" role="tablist">
        {[0, 1, 2, 3].map((k) => (
          <button key={k} role="tab" aria-selected={w === k} onClick={() => setW(k)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${w === k ? 'bg-primary text-white' : 'bg-white border border-line text-ink-soft'}`}>Semaine {k + 1}</button>
        ))}
      </div>
      <p className="px-5 mt-3 text-sm text-ink-soft">{fmtDate(dateOf(w * 7), { day: 'numeric', month: 'long' })} au {fmtDate(dateOf(w * 7 + 6), { day: 'numeric', month: 'long' })} · {weekDone}/7 faits</p>

      <ul className="px-5 mt-3 flex flex-col gap-3 list-none m-0">
        {Array.from({ length: 7 }, (_, k) => w * 7 + k).map((i) => {
          const date = dateOf(i), r = recipeById(data.plan[i]), isToday = date === today, done = !!data.done[date]
          return (
            <li key={i} className={`card p-4 ${isToday ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold capitalize">{fmtDate(date)}</span>
                <span className="flex items-center gap-2">
                  {isToday && <span className="rounded-full bg-primary text-white text-xs font-bold px-2.5 py-0.5">Ce soir</span>}
                  {done && <span className="rounded-full bg-sage-soft text-sage text-xs font-bold px-2.5 py-0.5">Fait</span>}
                  <button aria-label={`Options pour ${fmtDate(date)}`} onClick={() => setMenu({ i, mode: 'main' })} className="p-1.5 rounded-full text-ink-soft"><MoreHorizontal size={20} /></button>
                </span>
              </div>
              <a href={`#/recette/${r.id}`} className="flex items-center gap-3 no-underline text-ink">
                <Tile id={r} size="sm" />
                <div className="min-w-0">
                  <p className="font-bold leading-snug">{r.name}</p>
                  <span className="chip mt-1.5"><Clock size={13} /> {r.prep} + {r.cook} min</span>
                </div>
              </a>
            </li>
          )
        })}
      </ul>

      <Sheet open={!!menu} onClose={() => setMenu(null)} title={menu?.mode === 'replace' ? 'Remplacer par…' : menu?.mode === 'swap' ? 'Échanger avec…' : 'Que veux-tu faire ?'}>
        {menu?.mode === 'main' && (
          <div className="flex flex-col gap-2">
            <a className="btn-ghost no-underline text-ink" href={`#/recette/${data.plan[menu.i]}`} onClick={() => setMenu(null)}>Voir la recette</a>
            <button className="btn-ghost" onClick={() => setMenu({ ...menu, mode: 'replace' })}>Remplacer ce plat</button>
            <button className="btn-ghost" onClick={() => setMenu({ ...menu, mode: 'swap' })}>Déplacer (échanger avec un autre jour)</button>
          </div>
        )}
        {menu?.mode === 'replace' && (
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {RECIPES.map((r) => (
              <li key={r.id}><button onClick={() => replace(menu.i, r.id)} className="w-full flex items-center gap-3 text-left rounded-2xl border border-line p-2 active:bg-surface-low">
                <Tile id={r} size="sm" /><span className="font-semibold">{r.name}</span></button></li>
            ))}
          </ul>
        )}
        {menu?.mode === 'swap' && (
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {Array.from({ length: PLAN_DAYS }, (_, j) => j).filter((j) => j !== menu.i).map((j) => (
              <li key={j}><button onClick={() => swap(menu.i, j)} className="w-full flex items-center gap-3 text-left rounded-2xl border border-line p-3 active:bg-surface-low">
                <span className="flex-1"><span className="block text-xs text-ink-soft capitalize">Sem. {Math.floor(j / 7) + 1} · {fmtDate(dateOf(j))}</span><span className="font-semibold">{recipeById(data.plan[j]).name}</span></span></button></li>
            ))}
          </ul>
        )}
      </Sheet>
    </div>
  )
}
