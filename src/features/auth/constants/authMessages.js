/**
 * API error code → user-facing copy for login and auth (Vietnamese).
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
}

export const AUTH_ERROR_MESSAGE = {
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: 'Sai email hoặc mật khẩu',
  [AUTH_ERROR_CODES.ACCOUNT_LOCKED]: 'Tài khoản đã bị khóa',
}

/**
 * @param {unknown} err
 * @returns {string|undefined} localized message
 */
export function getLoginErrorMessage(err) {
  const code = err?.response?.data?.code ?? err?.code
  if (code && AUTH_ERROR_MESSAGE[code]) return AUTH_ERROR_MESSAGE[code]
  return err?.response?.data?.message || err?.message
}
