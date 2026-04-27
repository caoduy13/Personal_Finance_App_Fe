/**
 * Onboarding survey: complete survey and fetch jar suggestions by budgeting method.
 * Supports mock and real API via withMock in api.js.
 */
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import { BUDGET_METHOD } from '../constants/onboarding'
import api, { withMock } from './api'

const sixJarsSuggestions = [
  { name: 'Sinh hoạt', percentage: 55, icon: '🏠' },
  { name: 'Giáo dục', percentage: 10, icon: '📚' },
  { name: 'Tiết kiệm', percentage: 10, icon: '💰' },
  { name: 'Giải trí', percentage: 10, icon: '🎮' },
  { name: 'Đầu tư', percentage: 10, icon: '📈' },
  { name: 'Từ thiện', percentage: 5, icon: '❤️' },
]

const rule503020Suggestions = [
  { name: 'Nhu cầu thiết yếu', percentage: 50, icon: '🏠' },
  { name: 'Mong muốn', percentage: 30, icon: '🎯' },
  { name: 'Tiết kiệm', percentage: 20, icon: '💰' },
]

export const onboardingService = {
  /**
   * @param {object} formData full multi-step form payload
   * @returns {Promise<{ user: object, success: boolean }>}
   */
  complete: (formData) =>
    withMock(
      () => {
        const method = formData.budgetingMethod
        return {
          success: true,
          user: {
            is_onboarding_completed: true,
            budgeting_method: method,
            onboarding_survey: formData,
          },
        }
      },
      () => api.post(API_ENDPOINTS.ONBOARDING, formData),
    ),
  /**
   * @param {import('../constants/onboarding').BudgetMethodId} method
   */
  getSuggestions: (method) =>
    withMock(
      () => {
        if (method === BUDGET_METHOD.SIX_JARS) return { jars: sixJarsSuggestions }
        if (method === BUDGET_METHOD.RULE_503020) return { jars: rule503020Suggestions }
        return { jars: [] }
      },
      () => api.get(API_ENDPOINTS.ONBOARDING_SUGGESTIONS, { params: { method } }),
    ),
}
