import React, { useEffect, useState } from 'react'
import { Home, CalendarDays, ShoppingBasket, Refrigerator, Settings as Cog } from 'lucide-react'
import { useApp } from './store.jsx'
import { stockRows, lowCount } from './lib.js'
import Auth from './Auth.jsx'
import { Today, RecipeScreen, Week } from './Plan.jsx'
import { Courses, Stock } from './Shop.jsx'
import Reglages from './Reglages.jsx'

// Mini routeur par hash (compatible GitHub Pages, aucune dépendance).
const useHash = () => {
  const [h, setH] = useState(location.hash || '#/')
  useEffect(() => {
    const f = () => { setH(location.hash || '#/'); window.scrollTo(0, 0) }
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return h.replace(/^#/, '')
}

const NAV = [
  { to: '/', label: 'Aujourd’hui', Icon: Home },
  { to: '/semaine', label: 'Semaine', Icon: CalendarDays },
  { to: '/courses', label: 'Courses', Icon: ShoppingBasket },
  { to: '/stock', label: 'Stock', Icon: Refrigerator },
  { to: '/reglages', label: 'Réglages', Icon: Cog }
]

export default function App() {
  const { user, data } = useApp()
  const path = useHash()
  if (!user || !data) return <Auth />

  const alerts = lowCount(stockRows(data))
  let screen
  if (path.startsWith('/recette/')) screen = <RecipeScreen id={path.split('/')[2]} />
  else if (path === '/semaine') screen = <Week />
  else if (path === '/courses') screen = <Courses />
  else if (path === '/stock') screen = <Stock />
  else if (path === '/reglages') screen = <Reglages />
  else screen = <Today />

  const active = path.startsWith('/recette/') ? '/semaine' : NAV.some((n) => n.to === path) ? path : '/'
  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-xl mx-auto pb-28 pt-[env(safe-area-inset-top)]">{screen}</main>
      <nav aria-label="Navigation principale" className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <ul className="max-w-xl mx-auto grid grid-cols-5 px-1 py-1.5 list-none m-0">
          {NAV.map(({ to, label, Icon }) => (
            <li key={to}>
              <a href={`#${to}`} aria-current={active === to ? 'page' : undefined}
                className={`relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-semibold no-underline ${active === to ? 'bg-[#fff0e6] text-flame' : 'text-ink-soft'}`}>
                <Icon size={22} />
                {label}
                {to === '/stock' && alerts > 0 && (
                  <span className="absolute top-0.5 right-[22%] min-w-[16px] h-4 px-1 rounded-full bg-flame text-white text-[10px] flex items-center justify-center">{alerts}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
