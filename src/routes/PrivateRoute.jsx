// Guard for authenticated-only routes; redirects incomplete onboarding users to survey.
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../features/auth'

function PrivateRoute() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const isAdmin = user?.role === 'ADMIN'
  const onboardingCompleted = user?.is_onboarding_completed === true

  if (!isAdmin && !onboardingCompleted && location.pathname !== ROUTES.ONBOARDING) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return <Outlet />
}

export default PrivateRoute
