import { NavLink } from 'react-router-dom'
import { HomeIcon, DumbbellIcon, UserIcon } from './icons'

const tabs = [
  { to: '/painel', label: 'Painel', icon: HomeIcon },
  { to: '/treinos', label: 'Treinos', icon: DumbbellIcon },
  { to: '/perfil', label: 'Perfil', icon: UserIcon },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-bloom-600' : 'text-ink-500'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
