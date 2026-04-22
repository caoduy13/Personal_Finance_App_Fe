// Shared form validation helpers.
export const isRequired = (value) => String(value ?? '').trim().length > 0

export const isEmail = (value) => /\S+@\S+\.\S+/.test(String(value || ''))

export const minLength = (value, length = 6) => String(value || '').length >= length
