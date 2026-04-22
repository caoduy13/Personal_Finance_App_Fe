// Small badge component for statuses and tags.
function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  }

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tones[tone] || tones.neutral}`}>{children}</span>
}

export default Badge
