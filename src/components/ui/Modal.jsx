// Lightweight modal shell for dialogs.
function Modal({ open, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold text-slate-800">{title}</h3>
        {children}
      </div>
    </div>
  )
}

export default Modal
