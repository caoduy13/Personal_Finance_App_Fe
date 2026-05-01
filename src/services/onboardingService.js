/**
 * Onboarding survey: complete survey and fetch jar suggestions by budgeting method.
 * Maps FE form state to BE snake_case payload; normalizes API responses for UI.
 */
import { ONBOARDING_REQUEST_KEYS } from '../constants/onboardingApi'
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

/**
 * FE multi-step form (camelCase) → BE POST /onboarding body (snake_case).
 * @param {{
 *   monthlyIncome: number,
 *   occupation: string,
 *   ageRange: string,
 *   financialGoals: string[],
 *   spendingChallenges: string[],
 *   budgetingMethod: string,
 * }} feForm
 */
export function mapFeFormToOnboardingRequest(feForm) {
  const income = Number(feForm?.monthlyIncome)
  return {
    [ONBOARDING_REQUEST_KEYS.MONTHLY_INCOME_VND]: Number.isFinite(income) ? Math.round(income) : 0,
    [ONBOARDING_REQUEST_KEYS.OCCUPATION_TYPE]: feForm?.occupation ?? '',
    [ONBOARDING_REQUEST_KEYS.AGE_RANGE]: feForm?.ageRange ?? '',
    [ONBOARDING_REQUEST_KEYS.FINANCIAL_GOALS]: Array.isArray(feForm?.financialGoals) ? feForm.financialGoals : [],
    [ONBOARDING_REQUEST_KEYS.SPENDING_CHALLENGES]: Array.isArray(feForm?.spendingChallenges)
      ? feForm.spendingChallenges
      : [],
    [ONBOARDING_REQUEST_KEYS.BUDGETING_METHOD]: feForm?.budgetingMethod ?? '',
  }
}

/**
 * Attach computed monthly amount per jar (VND, rounded).
 * @param {Array<{ name?: string, percentage?: number, icon?: string }>} jars
 * @param {number} monthlyIncomeVnd
 */
export function enrichJarsWithMonthlyAmount(jars, monthlyIncomeVnd) {
  const income = Number(monthlyIncomeVnd)
  const base = Number.isFinite(income) ? income : 0
  return (jars || []).map((j) => ({
    ...j,
    monthlyAmount: Math.round((base * (Number(j.percentage) || 0)) / 100),
  }))
}

/**
 * Normalize GET suggestions response (mock vs axios shapes).
 * @param {unknown} res
 * @returns {{ jars: Array<object> }}
 */
export function normalizeSuggestionsResponse(res) {
  if (res == null) return { jars: [] }
  if (Array.isArray(res)) return { jars: res }
  if (typeof res === 'object') {
    if (Array.isArray(res.jars)) return { jars: res.jars }
    if (res.data && Array.isArray(res.data.jars)) return { jars: res.data.jars }
    if (Array.isArray(res.data)) return { jars: res.data }
  }
  return { jars: [] }
}

/**
 * Normalize POST complete response → { success, user } patch for Zustand merge.
 * @param {unknown} res
 */
export function normalizeOnboardingCompleteResponse(res) {
  if (res == null) return { success: false, user: null }
  if (typeof res !== 'object' || Array.isArray(res)) return { success: false, user: null }
  const r = /** @type {Record<string, unknown>} */ (res)
  if (r.user && typeof r.user === 'object') {
    return { success: Boolean(r.success !== false), user: r.user }
  }
  if (r.data && typeof r.data === 'object' && r.data.user && typeof r.data.user === 'object') {
    return { success: true, user: r.data.user }
  }
  if ('is_onboarding_completed' in r || 'id' in r) {
    return { success: true, user: r }
  }
  return { success: Boolean(r.success), user: r.user ?? null }
}

export const onboardingService = {
  /**
   * @param {Parameters<typeof mapFeFormToOnboardingRequest>[0]} feFormData
   */
  complete: (feFormData) => {
    const body = mapFeFormToOnboardingRequest(feFormData)
    return withMock(
      () => {
        const method = body[ONBOARDING_REQUEST_KEYS.BUDGETING_METHOD]
        return normalizeOnboardingCompleteResponse({
          success: true,
          user: {
            is_onboarding_completed: true,
            budgeting_method: method,
            onboarding_survey: body,
          },
        })
      },
      async () => {
        const raw = await api.post(API_ENDPOINTS.ONBOARDING, body)
        return normalizeOnboardingCompleteResponse(raw)
      },
    )
  },

  /**
   * Raw jar templates (no monthly amounts).
   * @param {string} method budgeting method id (SixJars | Rule503020 | Custom)
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

  /**
   * Suggestions normalized + monthly amounts for UI review step.
   * @param {string} method
   * @param {number} monthlyIncomeVnd
   */
  getSuggestionsForIncome: async (method, monthlyIncomeVnd) => {
    const raw = await onboardingService.getSuggestions(method)
    const { jars } = normalizeSuggestionsResponse(raw)
    return enrichJarsWithMonthlyAmount(jars, monthlyIncomeVnd)
  },
}
