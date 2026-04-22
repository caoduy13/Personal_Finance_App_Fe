// Top navbar showing current user information.
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <p className="text-sm text-slate-500">Multi-jar spending management</p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">{user?.name || 'Guest'}</span>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>
    </header>
  )
}

export default Navbar
