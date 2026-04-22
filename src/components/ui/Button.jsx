// Reusable button with primary/secondary variants.
function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClass =
    variant === 'secondary'
      ? 'bg-white text-[#0F6E56] border border-[#0F6E56] hover:bg-emerald-50'
      : 'bg-[#0F6E56] text-white hover:bg-emerald-700'

  return (
    <button className={`rounded-lg px-4 py-2 font-medium transition ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
