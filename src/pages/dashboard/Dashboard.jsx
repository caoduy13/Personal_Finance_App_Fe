// Dashboard proof page using mock-backed services and charts.
import { useEffect, useMemo, useState } from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import PageWrapper from '../../components/layout/PageWrapper'
import JarCard from '../../components/shared/JarCard'
import TransactionItem from '../../components/shared/TransactionItem'
import { useJar } from '../../hooks/useJar'
import { useTransaction } from '../../hooks/useTransaction'
import { dashboardService } from '../../services/dashboardService'
import { formatCurrency } from '../../utils/formatCurrency'

function Dashboard() {
  const { jars, fetchJars } = useJar()
  const { transactions, fetchTransactions } = useTransaction()
  const [summary, setSummary] = useState(null)
  const [goals, setGoals] = useState([])

  useEffect(() => {
    fetchJars()
    fetchTransactions()
    dashboardService.getSummary().then(setSummary)
    dashboardService.getGoals().then(setGoals)
  }, [fetchJars, fetchTransactions])

  const chartData = useMemo(
    () => jars.map((jar) => ({ name: jar.name, value: jar.spent })),
    [jars],
  )

  return (
    <PageWrapper>
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tong so du" value={summary?.totalBalance} />
        <StatCard title="Thu nhap" value={summary?.income} />
        <StatCard title="Chi tieu" value={summary?.expense} />
        <StatCard title="Tiet kiem thang" value={summary?.savings} />
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Phan bo chi tieu theo hu</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} fill="#0F6E56" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Muc tieu tiet kiem</h2>
          <div className="space-y-3">
            {goals.map((goal) => {
              const percent = Math.round((goal.current / goal.target) * 100)
              return (
                <div key={goal.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{goal.name}</span>
                    <span className="text-slate-500">{percent}%</span>
                  </div>
                  <div className="mb-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-[#0F6E56]" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Cac hu ngan sach</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {jars.map((jar) => (
              <JarCard key={jar.id} jar={jar} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Giao dich gan day</h2>
          <ul className="space-y-2">
            {transactions.slice(0, 6).map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  )
}

function StatCard({ title, value = 0 }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-bold text-[#0F6E56]">{formatCurrency(value)}</p>
    </div>
  )
}

export default Dashboard
