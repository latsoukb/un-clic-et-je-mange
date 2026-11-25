import { INGREDIENTS, RECIPES, BREAKFASTS } from './data.js'

export const recipeById = (id) => RECIPES.find((r) => r.id === id)
export const PLAN_DAYS = 28

// ── Dates (locales, format ISO AAAA-MM-JJ) ──
export const iso = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d) }
export const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 86400000)
export const mondayOf = (d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(x) }
export const todayISO = () => iso(new Date())
export const mod = (n, m) => ((n % m) + m) % m
export const fmtDate = (s, o = { weekday: 'long', day: 'numeric', month: 'short' }) => parse(s).toLocaleDateString('fr-CA', o)

// Début du cycle de 28 jours qui contient `date` (le plan se répète tous les 28 jours).
export const cycleStart = (start, date) => addDays(start, Math.floor(diffDays(start, date) / PLAN_DAYS) * PLAN_DAYS)
export const planIndex = (start, date) => mod(diffDays(start, date), PLAN_DAYS)
export const recipeForDate = (data, date) => recipeById(data.plan[planIndex(data.start, date)])

// ── Quantités ──
const UNIT = { g: 'g', ml: 'ml', pc: '', tr: 'tr.', cs: 'c. à soupe', noix: 'noix' }
const halves = (n) => {
  const w = Math.floor(n), f = n - w
  if (Math.abs(f - 0.5) < 0.01) return w ? `${w}½` : '½'
  return String(Math.round(n * 10) / 10).replace('.', ',')
}
export function fmtQty(q, unit) {
  if (unit === 'g' && q >= 1000) return `${(Math.round(q / 10) / 100).toString().replace('.', ',')} kg`
  if (unit === 'ml' && q >= 1000) return `${(Math.round(q / 10) / 100).toString().replace('.', ',')} l`
  const n = unit === 'g' || unit === 'ml' ? String(Math.round(q)) : halves(q)
  const u = UNIT[unit]
  return u ? `${n} ${u}` : n
}

// Quantité d'une ligne de recette pour N personnes (texte « exact » ou fourchette du brief).
export function ingredientText(line, persons) {
  const ing = INGREDIENTS[line.i]
  if (line.r && persons === 1) return line.r
  return fmtQty(line.q * persons, ing.unit)
}

// ── Besoins du mois ──
export function breakfastFor(data, date) {
  const opts = BREAKFASTS.filter((b) => data.settings.breakfastOpts.includes(b.id))
  if (!opts.length) return null
  return opts[mod(diffDays(data.start, date), opts.length)]
}

function add(map, line, persons, uses) {
  map[line.i] ||= { q: 0, uses: 0, approx: false }
  map[line.i].q += line.q * persons
  map[line.i].uses += uses
  if (line.approx) map[line.i].approx = true
}

// Besoins pour une période de dates (inclusives) selon le plan courant.
export function needsFor(data, dates) {
  const m = {}
  const p = data.settings.persons
  for (const d of dates) {
    recipeForDate(data, d).ing.forEach((l) => add(m, l, p, 1))
    if (data.settings.breakfastInCart) breakfastFor(data, d)?.ing.forEach((l) => add(m, l, p, 1))
  }
  return m
}
export const cycleDates = (data, from = todayISO()) => {
  const c = cycleStart(data.start, from)
  return Array.from({ length: PLAN_DAYS }, (_, i) => addDays(c, i))
}
export const monthNeeds = (data) => needsFor(data, cycleDates(data))

// ── Consommation (dérivée des repas cochés « fait ») ──
export function consumed(data) {
  const m = {}
  Object.entries(data.done).forEach(([, v]) => recipeById(v.r)?.ing.forEach((l) => add(m, l, v.p, 1)))
  Object.entries(data.bdone).forEach(([, v]) => BREAKFASTS.find((b) => b.id === v.b)?.ing.forEach((l) => add(m, l, v.p, 1)))
  return m
}

// Statut de stock d'un ingrédient. rest = acheté − consommé.
export function stockRows(data) {
  const need = monthNeeds(data)
  const used = consumed(data)
  const today = todayISO()
  const future = cycleDates(data).filter((d) => d >= today && !data.done[d])
  const futureNeed = needsFor(data, future)
  return Object.keys(need)
    .filter((id) => need[id])
    .map((id) => {
      const ing = INGREDIENTS[id]
      const bought = data.bought[id] || 0
      const cons = used[id]?.q || 0
      const rest = bought - cons
      const fn = futureNeed[id]
      const perUse = fn && fn.uses ? fn.q / fn.uses : 0
      let status = 'ok'
      if (!bought) status = 'achat'
      else if (fn && rest <= 0) status = 'rupture'
      else if (fn && rest < perUse * 2) status = 'bas'
      return { id, ing, need: need[id], bought, cons, rest: Math.max(0, rest), status, futureQ: fn?.q || 0 }
    })
}
export const lowCount = (rows) => rows.filter((r) => r.status === 'rupture' || r.status === 'bas').length

export const stepFor = (unit) => ({ g: 100, ml: 100 }[unit] || 1)
