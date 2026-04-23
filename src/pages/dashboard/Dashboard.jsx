// Dashboard proof page using mock-backed services and charts.
import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import PageWrapper from '../../components/layout/PageWrapper'
import { useJar } from '../../hooks/useJar'
import { useTransaction } from '../../hooks/useTransaction'
import { dashboardService } from '../../services/dashboardService'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

const JAR_GRADIENTS = [
  { from: '#FF4D4F', to: '#FF7A45' },
  { from: '#FF7A45', to: '#FFA940' },
  { from: '#FADB14', to: '#95DE64' },
  { from: '#52C41A', to: '#36CFC9' },
  { from: '#1890FF', to: '#2F54EB' },
  { from: '#722ED1', to: '#EB2F96' },
]

function Dashboard() {
  const { jars, fetchJars } = useJar()
  const { transactions, fetchTransactions } = useTransaction()
  const [summary, setSummary] = useState(null)
  const [goals, setGoals] = useState([])
  const [activeSection, setActiveSection] = useState('allocation')

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
      <section className="overflow-hidden rounded-2xl border border-[#3f5313] bg-[#f8faef] p-4 shadow-sm md:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[#304207]">Các mục quản lý</h2>
          <p className="text-sm text-[#6f7f46]">Tổng quan, mục tiêu và giao dịch luôn hiển thị; chọn thêm phần muốn xem chi tiết.</p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:max-w-xl">
          <SectionTile
            title="Phân bổ"
            subtitle="Biểu đồ theo hũ"
            isActive={activeSection === 'allocation'}
            onClick={() => setActiveSection('allocation')}
            icon={<AllocationTileIcon />}
          />
          <SectionTile
            title="Ngân sách"
            subtitle="Theo từng hũ"
            isActive={activeSection === 'jars'}
            onClick={() => setActiveSection('jars')}
            icon={<JarsTileIcon />}
          />
        </div>

        {activeSection === 'allocation' ? (
          <section className="mb-6 rounded-xl border border-[#d7dfc2] bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Phân bổ chi tiêu theo hũ</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {chartData.map((entry, index) => {
                      const gradient = JAR_GRADIENTS[index % JAR_GRADIENTS.length]
                      return (
                        <linearGradient key={entry.name} id={`jarGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={gradient.from} />
                          <stop offset="100%" stopColor={gradient.to} />
                        </linearGradient>
                      )
                    })}
                  </defs>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={105}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={`url(#jarGradient-${index})`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        {activeSection === 'jars' ? (
          <section className="mb-6 rounded-xl border border-[#d7dfc2] bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Các hũ ngân sách</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {jars.map((jar) => (
                <JarOverviewCard key={jar.id} jar={jar} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Tổng số dư" value={summary?.totalBalance} />
          <StatCard title="Thu nhập" value={summary?.income} />
          <StatCard title="Chi tiêu" value={summary?.expense} />
          <StatCard title="Tiết kiệm tháng" value={summary?.savings} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-[#d7dfc2] bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Mục tiêu tiết kiệm</h2>
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
                      <div className="h-2 rounded-full bg-[#5f7727]" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-xs text-slate-500">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-xl border border-[#d7dfc2] bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Giao dịch gần đây</h2>
            <ul className="space-y-2">
              {transactions.slice(0, 6).map((transaction) => (
                <TransactionOverviewRow key={transaction.id} transaction={transaction} />
              ))}
            </ul>
          </section>
        </section>
      </section>
    </PageWrapper>
  )
}

function StatCard({ title, value = 0 }) {
  return (
    <div className="rounded-xl border border-[#d7dfc2] bg-[#fcfdf8] p-4 shadow-sm">
      <p className="text-sm text-[#6f7f46]">{title}</p>
      <p className="mt-2 text-xl font-bold text-[#3f5313]">{formatCurrency(value)}</p>
    </div>
  )
}

function JarOverviewCard({ jar }) {
  const percent = Math.min(100, Math.round((jar.spent / jar.limit) * 100))

  return (
    <article className="space-y-2 rounded-xl border border-[#d7dfc2] bg-[#f9fbf0] p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#304207]">{jar.name}</h3>
        <span className="text-sm text-[#6f7f46]">{percent}%</span>
      </div>
      <p className="text-sm text-[#5b6940]">{formatCurrency(jar.spent)} / {formatCurrency(jar.limit)}</p>
      <div className="h-2 overflow-hidden rounded-full bg-[#e6edd1]">
        <div className="h-full bg-[#5f7727]" style={{ width: `${percent}%` }} />
      </div>
    </article>
  )
}

function TransactionOverviewRow({ transaction }) {
  const amountClass = transaction.type === 'income' ? 'text-emerald-700' : 'text-red-500'
  const sign = transaction.type === 'income' ? '+' : '-'

  return (
    <li className="flex items-center justify-between rounded-xl border border-[#d7dfc2] bg-[#fcfdf8] p-3">
      <div>
        <p className="font-medium text-[#304207]">{transaction.title}</p>
        <p className="text-xs text-[#6f7f46]">{transaction.category} • {formatDate(transaction.date)}</p>
      </div>
      <p className={`font-semibold ${amountClass}`}>{sign}{formatCurrency(transaction.amount)}</p>
    </li>
  )
}

function SectionTile({ title, subtitle, isActive, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        isActive
          ? 'border-[#d7e5af] bg-[#cde092] text-[#304207]'
          : 'border-[#657f2b] bg-[#4f651d] text-[#eef4d7] hover:bg-[#5b7421]'
      }`}
    >
      <div className="mb-3">{icon}</div>
      <p className="text-base font-semibold">{title}</p>
      <p className={`text-xs ${isActive ? 'text-[#5f7727]' : 'text-[#dce9b9]'}`}>{subtitle}</p>
    </button>
  )
}

function TileIconFrame({ children }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#b8cf7c]/50 bg-[#8eae43]/35">
      {children}
    </span>
  )
}

function AllocationTileIcon() {
  return (
    <TileIconFrame>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 12 20 9a8 8 0 1 1-8-5Z" />
        <path d="M12 12V4a8 8 0 0 1 8 5" />
      </svg>
    </TileIconFrame>
  )
}

function JarsTileIcon() {
  return (
    <TileIconFrame>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8M9 7h6" />
        <rect x="6.5" y="7" width="11" height="13" rx="3" />
      </svg>
    </TileIconFrame>
  )
}

export default Dashboard
