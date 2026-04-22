// Auth hook facade over Zustand auth store.
import { useAuthStore } from '../store'

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()
  return { user, token, isAuthenticated, login, logout }
}
