import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (evt) => {
    setForm((current) => ({ ...current, [evt.target.name]: evt.target.value }))
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-heading">
          <div className="badge badge-blue">DeviceCare</div>
          <h1>Sign in to DeviceCare</h1>
          <p>Fleet-grade device care, client updates, and repair tracking in one console.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error ? <div className="error">{error}</div> : null}
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
      <div className="auth-aside">
        <div className="brand-panel">
          <img src="/devcare.png" alt="DeviceCare" className="brand-logo-lg" />
          <div>
            <p className="eyebrow">DeviceCare</p>
            <h3>Keep every device healthy.</h3>
            <div className="hero-sub">
              Lifecycle visibility, repair velocity, and client updates from one console.
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-pill">Device health · Live</div>
          <div className="hero-title">Stay ahead of downtime</div>
          <div className="hero-sub">
            Track serials, warranty notes, service SLAs, and keep clients in the loop.
          </div>
          <ul className="hero-list">
            <li>One place for repairs and device assignments</li>
            <li>Fast escalations with clear audit trails</li>
            <li>Reports built for ops and admins</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
