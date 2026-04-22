// Format date values into dd/mm/yyyy format for display.
export const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--/--/----'
  return new Intl.DateTimeFormat('vi-VN').format(date)
}
