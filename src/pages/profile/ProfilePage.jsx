/**
 * User profile, budgeting method summary, and financial accounts (with add-account modal).
 */
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { ROUTES } from '../../constants/routes'
import {
  ACCOUNT_TYPE_ICON,
  ACCOUNT_TYPE_OPTIONS,
  CONNECTION_MODE,
  CONNECTION_MODE_OPTIONS,
  getBudgetingMethodDescription,
  getBudgetingMethodLabel,
  PROFILE_UI,
} from '../../constants/profile'
import { useAuth } from '../../hooks/useAuth'
import { financialAccountService } from '../../services/financialAccountService'
import { authService } from '../../services/authService'
import { formatVnd } from '../../utils/formatVnd'

const card = {
  background: '#fff',
  border: '1px solid #d7dfc2',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
}
const pageBg = {
  background: '#f8faef',
  border: '1px solid #3f5313',
  borderRadius: 16,
  padding: 16,
}
const title = { fontSize: 20, fontWeight: 700, color: '#304207', margin: '0 0 4px' }
const sectionTitle = { fontSize: 16, fontWeight: 600, color: '#304207', margin: '0 0 10px' }
const body = { fontSize: 14, color: '#475569' }
const caption = { fontSize: 12, color: '#6f7f46' }
const rowStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(160px, 1fr) 160px 90px',
  alignItems: 'center',
  gap: 8,
}
const labelLight = { fontSize: 13, color: '#64748b', marginRight: 8, minWidth: 88 }

function initialsOf(name) {
  if (!name) return 'FJ'
  const p = name.trim().split(/\s+/)
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function connectionLabel(v) {
  return CONNECTION_MODE_OPTIONS.find((o) => o.value === v)?.label || v
}

function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [edit, setEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [accounts, setAccounts] = useState([])
  const [loadErr, setLoadErr] = useState(null)
  const [modal, setModal] = useState(false)
  const [newAcc, setNewAcc] = useState({ name: '', account_type: 'Cash', connection_mode: CONNECTION_MODE.MANUAL, initial_balance: 0 })
  const [savingAcc, setSavingAcc] = useState(false)

  const method = user?.budgeting_method
  const currency = user?.preferred_currency || 'VND'

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const loadAccounts = useCallback(async () => {
    setLoadErr(null)
    try {
      const res = await financialAccountService.getAll()
      setAccounts(Array.isArray(res) ? res : res?.data ?? res ?? [])
    } catch (e) {
      setLoadErr('Không tải được danh sách tài khoản.')
    }
  }, [])

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const onSaveProfile = async () => {
    setSaving(true)
    try {
      const data = { ...form, preferred_currency: currency }
      const updated = await authService.updateProfile(data)
      setUser(updated)
      setEdit(false)
    } finally {
      setSaving(false)
    }
  }

  const onAddAccount = async () => {
    setSavingAcc(true)
    try {
      const row = {
        name: newAcc.name,
        account_type: newAcc.account_type,
        connection_mode: newAcc.connection_mode,
        initial_balance: newAcc.initial_balance,
      }
      const created = await financialAccountService.create(row)
      setAccounts((prev) => (Array.isArray(prev) ? [...prev, created] : [created]))
      setNewAcc({ name: '', account_type: 'Cash', connection_mode: CONNECTION_MODE.MANUAL, initial_balance: 0 })
      setModal(false)
    } catch {
      // err
    } finally {
      setSavingAcc(false)
    }
  }

  const goOnboarding = () => navigate(ROUTES.ONBOARDING)

  if (!user) {
    return (
      <PageWrapper>
        <p style={body}>Đang tải…</p>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div style={pageBg}>
        <h1 style={title}>{PROFILE_UI.pageTitle}</h1>
        <p style={caption}>
          {PROFILE_UI.preferredCurrency}: {currency}
        </p>

        <section style={card}>
          <h2 style={sectionTitle}>{PROFILE_UI.personalTitle}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#e6edd1',
                color: '#304207',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 20,
                border: '1px solid #d7dfc2',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initialsOf(user.name || user.email)
              )}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              {!edit ? (
                <div>
                  <p style={{ ...body, fontWeight: 600, margin: 0 }}>{user.name || '—'}</p>
                  <p style={{ ...body, margin: '4px 0 0' }}>{user.email || '—'}</p>
                  <p style={{ ...body, margin: '4px 0 0' }}>{user.phone || '—'}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Input label={PROFILE_UI.fullName} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  <Input label={PROFILE_UI.email} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  <Input label={PROFILE_UI.phone} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
              )}
            </div>
            <div>
              {!edit ? (
                <Button type="button" onClick={() => setEdit(true)}>
                  {PROFILE_UI.edit}
                </Button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Button type="button" disabled={saving} onClick={onSaveProfile}>
                    {saving ? '...' : PROFILE_UI.save}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEdit(false)
                      setForm({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                      })
                    }}
                  >
                    {PROFILE_UI.cancel}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>{PROFILE_UI.methodTitle}</h2>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#304207' }}>{getBudgetingMethodLabel(method)}</p>
          <p style={{ ...body, maxWidth: 600 }}>{getBudgetingMethodDescription(method)}</p>
          <Button type="button" variant="secondary" onClick={goOnboarding} style={{ marginTop: 10 }}>
            {PROFILE_UI.changeMethod}
          </Button>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>{PROFILE_UI.accountsTitle}</h2>
          {loadErr ? <p style={{ color: '#b91c1c', fontSize: 14 }}>{loadErr}</p> : null}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {accounts.map((a) => (
              <li
                key={a.id}
                style={{
                  ...rowStyle,
                  padding: '10px 12px',
                  border: '1px solid #d7dfc2',
                  borderRadius: 10,
                  background: '#fcfdf8',
                }}
              >
                <span style={body}>
                  <span aria-hidden style={{ marginRight: 8 }}>{ACCOUNT_TYPE_ICON[a.account_type] || '📦'}</span>
                  {a.name}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#304207', textAlign: 'right' }}>{formatVnd(a.current_balance)}</span>
                <span style={{ justifySelf: 'end' }}>
                  <Badge tone="neutral">{connectionLabel(a.connection_mode)}</Badge>
                </span>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setModal(true)
            }}
            style={{ marginTop: 12 }}
          >
            {PROFILE_UI.addAccount}
          </Button>
        </section>

        <Modal open={modal} title={PROFILE_UI.modalAddAccount}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Input label={PROFILE_UI.accountName} value={newAcc.name} onChange={(e) => setNewAcc((f) => ({ ...f, name: e.target.value }))} />
            <label style={body}>
              {PROFILE_UI.accountTypeLabel}
              <select
                value={newAcc.account_type}
                onChange={(e) => setNewAcc((f) => ({ ...f, account_type: e.target.value }))}
                style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #e2e8f0', padding: 8, fontSize: 14 }}
              >
                {ACCOUNT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label style={body}>
              {PROFILE_UI.connectionModeLabel}
              <select
                value={newAcc.connection_mode}
                onChange={(e) => setNewAcc((f) => ({ ...f, connection_mode: e.target.value }))}
                style={{ width: '100%', marginTop: 4, borderRadius: 8, border: '1px solid #e2e8f0', padding: 8, fontSize: 14 }}
              >
                {CONNECTION_MODE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label={PROFILE_UI.initialBalance}
              type="number"
              value={String(newAcc.initial_balance)}
              onChange={(e) => setNewAcc((f) => ({ ...f, initial_balance: parseFloat(e.target.value) || 0 }))}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setModal(false)
                }}
              >
                {PROFILE_UI.cancel}
              </Button>
              <Button type="button" onClick={onAddAccount} disabled={!newAcc.name.trim() || savingAcc}>
                {savingAcc ? '...' : PROFILE_UI.save}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  )
}

export default ProfilePage
