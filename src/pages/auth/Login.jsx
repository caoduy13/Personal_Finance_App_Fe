// Login: mascot, validation messages, Quên mật khẩu link, and onboarding-aware redirect.
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import LoginMascot from '../../components/auth/LoginMascot'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getLoginErrorMessage } from '../../constants/authMessages'
import { ROUTES } from '../../constants/routes'
import { LOGIN_UI } from '../../constants/registerForm'
import { useAuth } from '../../hooks/useAuth'

const errStyle = { color: '#b91c1c', fontSize: 13, margin: '0 0 4px' }
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  background: 'linear-gradient(135deg, #f8fafc 0%, rgba(236,253,245,0.8) 45%, #f1f5f9 100%)',
}
const cardStyle = {
  width: '100%',
  maxWidth: 420,
  borderRadius: 16,
  background: '#fff',
  padding: 32,
  boxShadow: '0 20px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.08)',
  border: '1px solid rgba(226,232,240,0.8)',
}
const titleStyle = { marginTop: 8, textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#0F6E56' }
const subtitleStyle = { marginBottom: 16, textAlign: 'center', fontSize: 14, color: '#64748b' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: 16 }
const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }
const passLabel = { fontSize: 14, color: '#475569' }
const passInputStyle = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  padding: '8px 12px',
  outline: 'none',
  fontSize: 14,
}
const helperRight = { display: 'flex', alignItems: 'center', gap: 8 }
const forgotStyle = { fontSize: 12, color: '#0F6E56', textDecoration: 'none' }
const helperLabelStyle = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }
const footerStyle = { marginTop: 16, textAlign: 'center', fontSize: 14, color: '#475569' }

function Spinner() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 16,
        height: 16,
        marginRight: 6,
        border: '2px solid rgba(255,255,255,0.5)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        verticalAlign: 'middle',
        animation: 'fjspin 0.7s linear infinite',
      }}
    />
  )
}

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, user, login } = useAuth()
  const [email, setEmail] = useState('anh@finjar.app')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loginHover, setLoginHover] = useState(false)
  const [formError, setFormError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const to = user?.is_onboarding_completed === false ? ROUTES.ONBOARDING : ROUTES.DASHBOARD
    return <Navigate to={to} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError(null)
    setLoading(true)
    try {
      const result = await login({ email, password })
      const to = result?.user?.is_onboarding_completed === false ? ROUTES.ONBOARDING : ROUTES.DASHBOARD
      navigate(to, { replace: true })
    } catch (err) {
      const m = getLoginErrorMessage(err)
      setFormError(m || 'Đăng nhập thất bại, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <style>{`@keyframes fjspin { to { transform: rotate(360deg); } }`}</style>
      <div style={cardStyle}>
        <LoginMascot
          emailFocused={emailFocused}
          passwordFocused={passwordFocused}
          showPassword={showPassword}
          loginHover={loginHover}
        />

        <h1 style={titleStyle}>{LOGIN_UI.title}</h1>
        <p style={subtitleStyle}>{LOGIN_UI.subtitle}</p>

        {formError ? <p style={errStyle}>{formError}</p> : null}

        <form style={formStyle} onSubmit={handleSubmit}>
          <Input
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            disabled={loading}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={rowStyle}>
              <span style={passLabel}>Mật khẩu</span>
              <div style={helperRight}>
                <a href="#" onClick={(e) => e.preventDefault()} style={forgotStyle}>
                  {LOGIN_UI.forgot}
                </a>
                <label style={helperLabelStyle}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  Hiện mật khẩu
                </label>
              </div>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              disabled={loading}
              style={{ ...passInputStyle, opacity: loading ? 0.6 : 1 }}
            />
          </div>

          <Button
            style={{ width: '100%' }}
            type="submit"
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
            disabled={loading}
          >
            {loading ? <Spinner /> : null}
            {LOGIN_UI.login}
          </Button>
        </form>

        <p style={footerStyle}>
          <Link to={ROUTES.REGISTER} style={{ color: '#0F6E56', textDecoration: 'none' }}>
            {LOGIN_UI.toRegister}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
