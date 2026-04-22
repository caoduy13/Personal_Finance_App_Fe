// Axios client with auth/token wiring and mock gateway.
import axios from 'axios'

export const USE_MOCK = true

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('finjar_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('finjar_token')
      localStorage.removeItem('finjar_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const withMock = async (mockFactory, realRequest) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFactory()), 250)
    })
  }
  return realRequest()
}

export default api
