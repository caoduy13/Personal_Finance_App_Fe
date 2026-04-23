// Top navbar showing current user information.
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-[#d7dfc2] bg-[#f3f7e6] px-6 py-4">
      <p className="text-sm font-medium text-[#5f7727]">Quản lý chi tiêu đa hũ</p>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#304207]">{user?.name || 'Guest'}</span>
        <Button variant="secondary" className="border-[#5f7727] bg-[#fcfdf8] text-[#3f5313] hover:bg-[#e7efcf]" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Navbar
