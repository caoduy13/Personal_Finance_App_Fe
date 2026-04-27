// Auth hook facade over Zustand auth store.
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, register, setUser } = useAuthStore()
  return { user, token, isAuthenticated, login, logout, register, setUser }
}
