// Jar service used by hooks/stores for jar operations.
import { API_ENDPOINTS } from '../constants/apiEndpoints'
import api, { withMock } from './api'
import { mockJars } from './mockData'

export const jarService = {
  getJars: () => withMock(() => mockJars, () => api.get(API_ENDPOINTS.JARS)),
  updateJar: (jarId, payload) =>
    withMock(
      () => ({ ...payload, id: jarId }),
      () => api.patch(`${API_ENDPOINTS.JARS}/${jarId}`, payload),
    ),
}
