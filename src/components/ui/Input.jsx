// Text input field with label support.
function Input({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-sm text-slate-600">{label}</span> : null}
      <input className={`w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-[#0F6E56] focus:ring ${className}`} {...props} />
    </label>
  )
}

export default Input
