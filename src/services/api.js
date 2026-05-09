/**
 * Shim for legacy src/services/onboardingService.js which imports `api` + `withMock`
 * from this path. The FE currently runs onboarding purely in mock mode, so the real
 * axios branch below throws informatively if ever exercised — swap to the shared
 * @/lib/axios + @/lib/requestStrategy pipeline when wiring the real BE.
 */
const api = {
  async get() {
    throw new Error('Real API not wired: src/services/api.js is a mock-only shim.')
  },
  async post() {
    throw new Error('Real API not wired: src/services/api.js is a mock-only shim.')
  },
}

export async function withMock(mockFn /*, realFn */) {
  return mockFn()
}

export default api
