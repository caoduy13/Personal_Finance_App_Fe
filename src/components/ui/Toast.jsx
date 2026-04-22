// Basic toast message placeholder.
function Toast({ message }) {
  if (!message) return null
  return <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>
}

export default Toast
