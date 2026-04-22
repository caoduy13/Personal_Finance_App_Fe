// Zustand auth state with login/logout actions.
import { create } from 'zustand'
import { authService } from '../services/authService'

const tokenKey = 'finjar_token'
const userKey = 'finjar_user'

const persistedToken = localStorage.getItem(tokenKey)
const persistedUser = localStorage.getItem(userKey)

export const useAuthStore = create((set) => ({
  user: persistedUser ? JSON.parse(persistedUser) : null,
  token: persistedToken || null,
  isAuthenticated: Boolean(persistedToken),
  login: async (credentials) => {
    const result = await authService.login(credentials)
    localStorage.setItem(tokenKey, result.token)
    localStorage.setItem(userKey, JSON.stringify(result.user))
    set({ user: result.user, token: result.token, isAuthenticated: true })
    return result
  },
  logout: () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
