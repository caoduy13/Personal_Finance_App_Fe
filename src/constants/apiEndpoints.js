/**
 * Shim for legacy src/services/onboardingService.js which imports API_ENDPOINTS
 * from this path. The active TS codebase uses @/shared/constants/apiEndpoint.
 * Keep both files in sync if BE paths change.
 */
export const API_ENDPOINTS = {
  ONBOARDING: '/onboarding',
  ONBOARDING_SUGGESTIONS: '/onboarding/suggestions',
}
