// Single transaction row for recent activity lists.
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

function TransactionItem({ transaction }) {
  const amountClass = transaction.type === 'income' ? 'text-emerald-600' : 'text-red-500'
  const sign = transaction.type === 'income' ? '+' : '-'

  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3">
      <div>
        <p className="font-medium text-slate-700">{transaction.title}</p>
        <p className="text-xs text-slate-500">{transaction.category} ? {formatDate(transaction.date)}</p>
      </div>
      <p className={`font-semibold ${amountClass}`}>{sign}{formatCurrency(transaction.amount)}</p>
    </li>
  )
}

export default TransactionItem
