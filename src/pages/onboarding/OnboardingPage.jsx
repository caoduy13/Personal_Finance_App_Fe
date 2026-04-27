/**
 * Multi-step onboarding survey: income, goals, budgeting method, and suggested jars.
 */
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'
import {
  AGE_RANGE_OPTIONS,
  BUDGET_METHOD,
  FINANCIAL_GOAL_OPTIONS,
  METHOD_CARDS,
  OCCUPATION_OPTIONS,
  ONBOARDING_UI,
  SPENDING_CHALLENGE_OPTIONS,
} from '../../constants/onboarding'
import { useAuth } from '../../hooks/useAuth'
import { onboardingService } from '../../services/onboardingService'
import { formatVnd } from '../../utils/formatVnd'

const TOTAL_STEPS = 4
const pageBg = { background: '#f0faf5', minHeight: '100%' }
const card = {
  background: '#fff',
  border: '0.5px solid #d1fae5',
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
}
const title = { fontSize: 20, fontWeight: 700, color: '#0F6E56', margin: '0 0 4px' }
const sectionTitle = { fontSize: 16, fontWeight: 600, color: '#134e3a', margin: '0 0 12px' }
const body = { fontSize: 14, color: '#334155' }
const stepBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }
const caption = { fontSize: 12, color: '#64748b' }

function toggleInList(list, value) {
  if (list.includes(value)) return list.filter((v) => v !== value)
  return [...list, value]
}

function OnboardingPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState(15000000)
  const [occupation, setOccupation] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [financialGoals, setFinancialGoals] = useState([])
  const [spendingChallenges, setSpendingChallenges] = useState([])
  const [budgetingMethod, setBudgetingMethod] = useState(null)
  const [suggestionRows, setSuggestionRows] = useState([])

  const incomeNumber = useMemo(
    () => (typeof monthlyIncome === 'number' && !Number.isNaN(monthlyIncome) ? monthlyIncome : 0),
    [monthlyIncome],
  )

  useEffect(() => {
    if (step < 4 || !budgetingMethod) return
    let cancelled = false
    const load = async () => {
      const res = await onboardingService.getSuggestions(budgetingMethod)
      if (cancelled) return
      const list = res?.jars ?? (Array.isArray(res) ? res : [])
      setSuggestionRows(
        (list || []).map((j) => ({
          ...j,
          monthlyAmount: Math.round((incomeNumber * (j.percentage || 0)) / 100),
        })),
      )
    }
    load()
    return () => {
      cancelled = true
    }
  }, [step, budgetingMethod, incomeNumber])

  const canStep1 = incomeNumber > 0 && Boolean(occupation) && Boolean(ageRange)
  const canStep2 = financialGoals.length > 0 && spendingChallenges.length > 0
  const canStep3 = Boolean(budgetingMethod)

  const canNext = () => {
    if (step === 1) return canStep1
    if (step === 2) return canStep2
    if (step === 3) return canStep3
    return true
  }

  const buildFormPayload = () => ({
    monthlyIncome: incomeNumber,
    occupation,
    ageRange,
    financialGoals,
    spendingChallenges,
    budgetingMethod,
  })

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const form = buildFormPayload()
      const result = await onboardingService.complete(form)
      const u = result?.user
      if (u && typeof u === 'object') {
        setUser(u)
      }
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch {
      // optional toast
    } finally {
      setSubmitting(false)
    }
  }

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }
  const goBack = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '0.5px solid #d1fae5',
    borderRadius: 8,
    fontSize: 14,
  }

  return (
    <PageWrapper>
      <div style={pageBg}>
        <p style={caption}>
          {ONBOARDING_UI.stepLabel(step, TOTAL_STEPS)} — {ONBOARDING_UI.pageTitle}
        </p>
        <h1 style={title}>Khởi tạo tài chính cá nhân</h1>
        <div style={stepBar}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                minWidth: 64,
                height: 4,
                borderRadius: 4,
                background: n <= step ? '#0F6E56' : '#e2e8f0',
                marginRight: n < TOTAL_STEPS ? 4 : 0,
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <div style={card}>
            <h2 style={sectionTitle}>Thông tin cơ bản</h2>
            <p style={body}>Nhập thu nhập và tình hình công việc.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              <label style={body}>
                {ONBOARDING_UI.monthlyIncome}
                <input
                  type="number"
                  min={0}
                  value={Number.isNaN(monthlyIncome) ? '' : monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  style={{ ...inputStyle, marginTop: 6 }}
                />
                <span style={{ display: 'block', marginTop: 4, ...caption }}>
                  {formatVnd(incomeNumber)}
                </span>
              </label>
              <label style={body}>
                {ONBOARDING_UI.occupation}
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  style={{ ...inputStyle, marginTop: 6, background: '#fff' }}
                >
                  <option value="">-- Chọn --</option>
                  {OCCUPATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={body}>
                {ONBOARDING_UI.ageRange}
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  style={{ ...inputStyle, marginTop: 6, background: '#fff' }}
                >
                  <option value="">-- Chọn --</option>
                  {AGE_RANGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={card}>
            <h2 style={sectionTitle}>{ONBOARDING_UI.financialGoals}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FINANCIAL_GOAL_OPTIONS.map((g) => (
                <label key={g.value} style={{ ...body, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={financialGoals.includes(g.value)}
                    onChange={() => setFinancialGoals((prev) => toggleInList(prev, g.value))}
                  />
                  {g.label}
                </label>
              ))}
            </div>
            <h2 style={{ ...sectionTitle, marginTop: 20 }}>{ONBOARDING_UI.challenges}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SPENDING_CHALLENGE_OPTIONS.map((g) => (
                <label key={g.value} style={{ ...body, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={spendingChallenges.includes(g.value)}
                    onChange={() => setSpendingChallenges((prev) => toggleInList(prev, g.value))}
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={card}>
            <h2 style={sectionTitle}>{ONBOARDING_UI.methodTitle}</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                marginTop: 12,
              }}
            >
              {METHOD_CARDS.map((m) => {
                const active = budgetingMethod === m.id
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setBudgetingMethod(m.id)}
                    style={{
                      textAlign: 'left',
                      padding: 16,
                      borderRadius: 12,
                      background: active ? '#E1F5EE' : '#fff',
                      border: active ? '2px solid #0F6E56' : '0.5px solid #d1fae5',
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#0F6E56', fontSize: 14 }}>{m.title}</div>
                    <p style={{ ...body, fontSize: 13, margin: '8px 0 0' }}>{m.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={card}>
            <h2 style={sectionTitle}>
              {budgetingMethod === BUDGET_METHOD.CUSTOM
                ? 'Bạn chọn tùy chỉnh hũ'
                : ONBOARDING_UI.reviewTitle}
            </h2>
            {budgetingMethod === BUDGET_METHOD.CUSTOM ? (
              <p style={body}>Bạn có thể cấu hình chi tiết ở trang hũ sau bước này.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {suggestionRows.map((j) => (
                  <li
                    key={j.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      border: '0.5px solid #d1fae5',
                      borderRadius: 10,
                      background: '#fff',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                      <span aria-hidden>{j.icon}</span> {j.name} — {j.percentage}%
                    </span>
                    <span style={{ fontWeight: 600, color: '#0F6E56' }}>{formatVnd(j.monthlyAmount)}/tháng</span>
                  </li>
                ))}
              </ul>
            )}
            <p style={{ ...caption, marginTop: 10 }}>
              Từ thu nhập: <strong style={{ color: '#0F6E56' }}>{formatVnd(incomeNumber)}</strong> / tháng
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
          <div>
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={goBack} disabled={submitting}>
                {ONBOARDING_UI.back}
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {step < TOTAL_STEPS && (
              <Button type="button" onClick={goNext} disabled={!canNext() || submitting}>
                {ONBOARDING_UI.next}
              </Button>
            )}
            {step === TOTAL_STEPS && (
              <Button type="button" onClick={onSubmit} disabled={submitting}>
                {submitting ? 'Đang lưu…' : ONBOARDING_UI.reviewSubmit}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default OnboardingPage
