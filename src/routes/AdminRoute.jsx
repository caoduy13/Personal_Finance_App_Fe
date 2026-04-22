// Guard for admin-only routes.
import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

function AdminRoute() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  if (user?.role !== 'ADMIN') return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}

export default AdminRoute
