// API endpoint map used by service modules.
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE_UPDATE: '/auth/profile',
  DASHBOARD: '/dashboard',
  JARS: '/jars',
  TRANSACTIONS: '/transactions',
  GOALS: '/goals',
  /** Complete onboarding survey */
  ONBOARDING: '/onboarding',
  /** Suggested jar allocations by budgeting method (query: method) */
  ONBOARDING_SUGGESTIONS: '/onboarding/suggestions',
  /** User financial accounts */
  FIN_ACCOUNTS: '/financial-accounts',
}
