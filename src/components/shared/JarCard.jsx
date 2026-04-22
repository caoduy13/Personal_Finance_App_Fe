// Financial jar card displaying spend status and usage bar.
import AlertBanner from './AlertBanner'
import { formatCurrency } from '../../utils/formatCurrency'

function JarCard({ jar }) {
  const percent = Math.min(100, Math.round((jar.spent / jar.limit) * 100))
  const progressClass = percent >= 90 ? 'bg-red-500' : percent >= 70 ? 'bg-amber-500' : 'bg-emerald-600'

  return (
    <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{jar.name}</h3>
        <span className="text-sm text-slate-500">{percent}%</span>
      </div>
      <p className="text-sm text-slate-600">{formatCurrency(jar.spent)} / {formatCurrency(jar.limit)}</p>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${progressClass}`} style={{ width: `${percent}%` }} />
      </div>
      {percent >= 80 ? <AlertBanner jarName={jar.name} percent={percent} /> : null}
    </article>
  )
}

export default JarCard
