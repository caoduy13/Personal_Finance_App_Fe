/**
 * Financial accounts: list, create, update. Mock uses in-memory store when USE_MOCK.
 */
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import api, { withMock } from './api'

let mockAccounts = [
  {
    id: 'fa1',
    name: 'Tiền mặt',
    account_type: 'Cash',
    connection_mode: 'Manual',
    current_balance: 5000000,
    is_default: true,
  },
  {
    id: 'fa2',
    name: 'Vietcombank',
    account_type: 'Bank',
    connection_mode: 'Manual',
    current_balance: 13450000,
    is_default: false,
  },
]

let idSeq = 3

export const financialAccountService = {
  getAll: () =>
    withMock(
      () => [...mockAccounts],
      () => api.get(API_ENDPOINTS.FIN_ACCOUNTS),
    ),
  /**
   * @param {object} data name, account_type, connection_mode, current_balance, etc.
   */
  create: (data) =>
    withMock(
      () => {
        const id = `fa${idSeq++}`
        const row = {
          id,
          is_default: mockAccounts.length === 0,
          name: data.name,
          account_type: data.account_type,
          connection_mode: data.connection_mode,
          current_balance: Number(data.initial_balance ?? data.current_balance ?? 0) || 0,
        }
        mockAccounts = [...mockAccounts, row]
        return row
      },
      () => api.post(API_ENDPOINTS.FIN_ACCOUNTS, data),
    ),
  /**
   * @param {string} id
   * @param {object} data partial
   */
  update: (id, data) =>
    withMock(
      () => {
        const idx = mockAccounts.findIndex((a) => a.id === id)
        if (idx < 0) return null
        const next = { ...mockAccounts[idx], ...data, id }
        mockAccounts = mockAccounts.map((a) => (a.id === id ? next : a))
        return next
      },
      () => api.put(`${API_ENDPOINTS.FIN_ACCOUNTS}/${id}`, data),
    ),
}
