// Sidebar navigation for desktop app layout.
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const navItems = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
  { label: 'Jars', to: ROUTES.JARS },
  { label: 'Transactions', to: ROUTES.TRANSACTIONS },
  { label: 'Budget', to: ROUTES.BUDGET },
  { label: 'Goals', to: ROUTES.GOALS },
  { label: 'Reports', to: ROUTES.REPORTS },
  { label: 'Admin', to: ROUTES.ADMIN },
]

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <h1 className="mb-6 text-xl font-bold text-[#0F6E56]">FinJar</h1>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-emerald-50 text-[#0F6E56]' : 'text-slate-600 hover:bg-slate-50'}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
