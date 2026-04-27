// Application route map for public/private/admin areas.
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import AdminRoute from './AdminRoute'
import PrivateRoute from './PrivateRoute'

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const UserManagement = lazy(() => import('../pages/admin/UserManagement'))
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const Budget = lazy(() => import('../pages/budget/Budget'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Goals = lazy(() => import('../pages/goals/Goals'))
const JarDetail = lazy(() => import('../pages/jars/JarDetail'))
const JarList = lazy(() => import('../pages/jars/JarList'))
const Reports = lazy(() => import('../pages/reports/Reports'))
const AddTransaction = lazy(() => import('../pages/transactions/AddTransaction'))
const TransactionList = lazy(() => import('../pages/transactions/TransactionList'))
const OnboardingPage = lazy(() => import('../pages/onboarding/OnboardingPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))

function AppRouter() {
  const { isAuthenticated } = useAuth()

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.JARS} element={<JarList />} />
          <Route path={`${ROUTES.JARS}/:jarId`} element={<JarDetail />} />
          <Route path={ROUTES.TRANSACTIONS} element={<TransactionList />} />
          <Route path={`${ROUTES.TRANSACTIONS}/add`} element={<AddTransaction />} />
          <Route path={ROUTES.BUDGET} element={<Budget />} />
          <Route path={ROUTES.GOALS} element={<Goals />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
          <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path={`${ROUTES.ADMIN}/users`} element={<UserManagement />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
