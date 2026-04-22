// Application route map for public/private/admin areas.
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UserManagement from '../pages/admin/UserManagement'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Budget from '../pages/budget/Budget'
import Dashboard from '../pages/dashboard/Dashboard'
import Goals from '../pages/goals/Goals'
import JarDetail from '../pages/jars/JarDetail'
import JarList from '../pages/jars/JarList'
import Reports from '../pages/reports/Reports'
import AddTransaction from '../pages/transactions/AddTransaction'
import TransactionList from '../pages/transactions/TransactionList'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import AdminRoute from './AdminRoute'
import PrivateRoute from './PrivateRoute'

function AppRouter() {
  const { isAuthenticated } = useAuth()

  return (
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
      </Route>

      <Route element={<AdminRoute />}>
        <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
        <Route path={`${ROUTES.ADMIN}/users`} element={<UserManagement />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />} />
    </Routes>
  )
}

export default AppRouter
