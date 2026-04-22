// Dashboard data service aggregates summary and goals.
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import api, { withMock } from './api'
import { mockDashboard, mockGoals } from './mockData'

export const dashboardService = {
  getSummary: () =>
    withMock(() => mockDashboard, () => api.get(`${API_ENDPOINTS.DASHBOARD}/summary`)),
  getGoals: () => withMock(() => mockGoals, () => api.get(API_ENDPOINTS.GOALS)),
}
