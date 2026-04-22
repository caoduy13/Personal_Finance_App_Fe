// Authentication service that isolates all auth API calls.
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import api, { withMock } from './api'
import { mockUser } from './mockData'

export const authService = {
  login: (payload) =>
    withMock(
      () => ({
        user: mockUser,
        token: 'mock-finjar-token',
      }),
      () => api.post(API_ENDPOINTS.LOGIN, payload),
    ),
  register: (payload) =>
    withMock(
      () => ({
        user: { ...mockUser, email: payload.email },
        token: 'mock-finjar-token',
      }),
      () => api.post(API_ENDPOINTS.REGISTER, payload),
    ),
}
