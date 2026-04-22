// Transaction API abstraction for transaction pages.
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import api, { withMock } from './api'
import { mockTransactions } from './mockData'

export const transactionService = {
  getRecent: () =>
    withMock(() => mockTransactions, () => api.get(API_ENDPOINTS.TRANSACTIONS)),
}
