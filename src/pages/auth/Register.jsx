// Register: validation (email, password, confirm) and always redirect to onboarding on success.
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { REGISTER_UI } from '../../constants/registerForm'
import { ROUTES } from '../../constants/routes'
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from '../../constants/validation'
import { useAuth } from '../../hooks/useAuth'

const errStyle = { color: '#b91c1c', fontSize: 12, margin: '4px 0 0' }
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  background: '#f8fafc',
}
const cardStyle = {
  width: '100%',
  maxWidth: 420,
  background: '#fff',
  border: '0.5px solid #d1fae5',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 8px 24px rgba(15,110,86,0.08)',
}
const titleStyle = { fontSize: 20, fontWeight: 700, color: '#0F6E56', margin: '0 0 4px' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: 10 }
const footerStyle = { marginTop: 16, textAlign: 'center', fontSize: 13, color: '#64748b' }

function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [topError, setTopError] = useState(null)

  if (isAuthenticated) {
    const to = user?.is_onboarding_completed === false ? ROUTES.ONBOARDING : ROUTES.DASHBOARD
    return <Navigate to={to} replace />
  }

  const emailError = !email ? '' : !EMAIL_PATTERN.test(email.trim()) ? REGISTER_UI.errorEmail : ''
  const passError = !password ? '' : password.length < MIN_PASSWORD_LENGTH ? REGISTER_UI.errorPassword : ''
  const matchError = !confirm ? '' : password !== confirm ? REGISTER_UI.errorConfirm : ''
  const valid = name.trim() && email && password && !emailError && !passError && password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTopError(null)
    setTouched({ name: true, email: true, password: true, confirm: true })
    if (!valid) {
      if (!name.trim() || !email) setTopError('Vui lòng điền đủ thông tin bắt buộc.')
      return
    }
    setLoading(true)
    try {
      await register({ name, email, password, phone: '' })
      navigate(ROUTES.ONBOARDING, { replace: true })
    } catch (err) {
      setTopError(err?.message || 'Đăng ký thất bại, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{REGISTER_UI.pageTitle}</h1>
        {topError ? <p style={{ color: '#b91c1c', fontSize: 13, margin: '0 0 8px' }}>{topError}</p> : null}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <Input
              label={REGISTER_UI.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            />
            {touched.name && !name.trim() ? <p style={errStyle}>Bắt buộc</p> : null}
          </div>
          <div>
            <Input
              type="email"
              label={REGISTER_UI.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {touched.email && email && emailError ? <p style={errStyle}>{emailError}</p> : null}
            {touched.email && !email ? <p style={errStyle}>Bắt buộc</p> : null}
          </div>
          <div>
            <Input
              type="password"
              label={REGISTER_UI.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            {touched.password && password && passError ? <p style={errStyle}>{passError}</p> : null}
            {touched.password && !password ? <p style={errStyle}>Bắt buộc</p> : null}
          </div>
          <div>
            <Input
              type="password"
              label={REGISTER_UI.confirm}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            />
            {touched.confirm && !confirm && password ? <p style={errStyle}>Bắt buộc</p> : null}
            {touched.confirm && confirm && matchError ? <p style={errStyle}>{matchError}</p> : null}
          </div>
          <Button type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? '...' : REGISTER_UI.submit}
          </Button>
        </form>
        <p style={footerStyle}>
          <Link to={ROUTES.LOGIN} style={{ color: '#0F6E56', textDecoration: 'none' }}>
            {REGISTER_UI.toLogin}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
