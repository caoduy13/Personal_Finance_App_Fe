// Register screen starter.
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-[#0F6E56]">Register</h1>
        <p className="mt-2 text-sm text-slate-600">Starter register page for FinJar.</p>
        <Link className="mt-4 inline-block text-sm text-[#0F6E56] underline" to={ROUTES.LOGIN}>Back to login</Link>
      </div>
    </div>
  )
}

export default Register
