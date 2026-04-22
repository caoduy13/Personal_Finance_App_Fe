// Login: mascot phan ung khi focus email / password va khi hien mat khau (che mat / he mat).
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import LoginMascot from '../../components/auth/LoginMascot'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [email, setEmail] = useState('anh@finjar.app')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loginHover, setLoginHover] = useState(false)

  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login({ email, password })
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200/80">
        <LoginMascot
          emailFocused={emailFocused}
          passwordFocused={passwordFocused}
          showPassword={showPassword}
          loginHover={loginHover}
        />

        <h1 className="mt-2 text-center text-2xl font-bold text-[#0F6E56]">FinJar</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Đăng nhập để quản lý các hũ chi tiêu</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />

          <div className="block space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-600">Mật khẩu</span>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F6E56] focus:ring-[#0F6E56]"
                />
                Hiện mật khẩu
              </label>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none ring-[#0F6E56] focus:ring"
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
          >
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
