/**
 * Authentication: login, register, and profile update; mock branches use demoUsers rules.
 */
import { AUTH_ERROR_CODES } from '../constants/authMessages'
import { DEMO_LOGIN_PASSWORD, MOCK_EMAIL_ACCOUNT_LOCKED } from '../constants/demoUsers'
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import api, { USE_MOCK, withMock } from './api'
import { mockUser } from './mockData'

const rejectLogin = (code) => {
  const err = new Error(code)
  err.code = code
  err.response = { data: { code } }
  return Promise.reject(err)
}

export const authService = {
  login: (payload) => {
    if (USE_MOCK) {
      return (async () => {
        if (payload?.email === MOCK_EMAIL_ACCOUNT_LOCKED) {
          return rejectLogin(AUTH_ERROR_CODES.ACCOUNT_LOCKED)
        }
        if (!payload?.email || !payload?.password) {
          return rejectLogin(AUTH_ERROR_CODES.INVALID_CREDENTIALS)
        }
        if (payload.password !== DEMO_LOGIN_PASSWORD) {
          return rejectLogin(AUTH_ERROR_CODES.INVALID_CREDENTIALS)
        }
        return withMock(
          () => {
            const email = String(payload.email).toLowerCase()
            return {
              user: {
                ...mockUser,
                email: payload.email,
                is_onboarding_completed: !email.includes('onboarding@'),
              },
              token: 'mock-finjar-token',
            }
          },
          () => api.post(API_ENDPOINTS.LOGIN, payload),
        )
      })()
    }
    return api.post(API_ENDPOINTS.LOGIN, payload)
  },
  register: (payload) =>
    withMock(
      () => ({
        user: {
          ...mockUser,
          id: 'u_new',
          name: payload.name || mockUser.name,
          email: payload.email,
          phone: payload.phone || '',
          role: 'USER',
          is_onboarding_completed: false,
          preferred_currency: mockUser.preferred_currency,
        },
        token: 'mock-finjar-token',
      }),
      () => api.post(API_ENDPOINTS.REGISTER, payload),
    ),
  updateProfile: (data) => {
    if (data != null && (typeof data !== 'object' || Array.isArray(data))) {
      return Promise.reject(new Error('Invalid profile data'))
    }
    return withMock(
      () => {
        let prev = mockUser
        try {
          const raw = localStorage.getItem('finjar_user')
          if (raw) prev = { ...mockUser, ...JSON.parse(raw) }
        } catch {
          /* use mockUser */
        }
        return {
          ...prev,
          ...(data || {}),
        }
      },
      () => api.put(API_ENDPOINTS.PROFILE_UPDATE, data),
    )
  },
}
