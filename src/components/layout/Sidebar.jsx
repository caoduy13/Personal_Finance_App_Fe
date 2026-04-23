// Sidebar navigation for desktop app layout.
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const navItems = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: DashboardIcon },
  { label: 'Jars', to: ROUTES.JARS, icon: JarIcon },
  { label: 'Transactions', to: ROUTES.TRANSACTIONS, icon: TransactionIcon },
  { label: 'Budget', to: ROUTES.BUDGET, icon: BudgetIcon },
  { label: 'Goals', to: ROUTES.GOALS, icon: GoalIcon },
  { label: 'Reports', to: ROUTES.REPORTS, icon: ReportIcon },
  { label: 'Admin', to: ROUTES.ADMIN, icon: AdminIcon },
]

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#5a7125] bg-[#415312] p-5 text-[#eef4d7] lg:block">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#eef4d7]">FinJar</h1>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl border px-3 py-3 text-sm transition ${
                isActive
                  ? 'border-[#d7e5af] bg-[#cde092] font-medium text-[#304207]'
                  : 'border-[#657f2b] bg-[#5a7125] text-[#eef4d7] hover:bg-[#6b8430]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon />
              <span className="font-medium">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>
      <div className="mt-10 flex flex-wrap gap-3 text-xs text-[#d7e3b0]">
        <span>Contact</span>
        <span>Socials</span>
        <span>Address</span>
      </div>
    </aside>
  )
}

function IconFrame({ children }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#b8cf7c]/50 bg-[#8eae43]/35">
      {children}
    </span>
  )
}

function DashboardIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="3.5" width="7" height="5" rx="1.2" />
        <rect x="13.5" y="11.5" width="7" height="9" rx="1.2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      </svg>
    </IconFrame>
  )
}

function JarIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8M9 7h6" />
        <rect x="6.5" y="7" width="11" height="13" rx="3" />
      </svg>
    </IconFrame>
  )
}

function TransactionIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 7h12M7 12h10M7 17h8" />
        <path d="M4 7h.01M4 12h.01M4 17h.01" />
      </svg>
    </IconFrame>
  )
}

function BudgetIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    </IconFrame>
  )
}

function GoalIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    </IconFrame>
  )
}

function ReportIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 18V9M12 18V6M18 18v-4" />
      </svg>
    </IconFrame>
  )
}

function AdminIcon() {
  return (
    <IconFrame>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
      </svg>
    </IconFrame>
  )
}

export default Sidebar
