// Format numeric values into Vietnamese Dong style (1.500.000?).
export const formatCurrency = (value = 0) => {
  const formatted = new Intl.NumberFormat('vi-VN').format(Number(value) || 0)
  return `${formatted}?`
}
