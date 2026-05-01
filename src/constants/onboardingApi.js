/**
 * Documented BE contract for onboarding APIs (snake_case body).
 * FE form state lives in camelCase in UI; mapping happens in onboardingService.
 *
 * POST /onboarding body:
 * - monthly_income_vnd: number
 * - occupation_type: string (same enum values as OCCUPATION_OPTIONS.value)
 * - age_range: string (same as AGE_RANGE_OPTIONS.value)
 * - financial_goals: string[]
 * - spending_challenges: string[]
 * - budgeting_method: 'SixJars' | 'Rule503020' | 'Custom'
 */

export const ONBOARDING_REQUEST_KEYS = {
  MONTHLY_INCOME_VND: 'monthly_income_vnd',
  OCCUPATION_TYPE: 'occupation_type',
  AGE_RANGE: 'age_range',
  FINANCIAL_GOALS: 'financial_goals',
  SPENDING_CHALLENGES: 'spending_challenges',
  BUDGETING_METHOD: 'budgeting_method',
}
