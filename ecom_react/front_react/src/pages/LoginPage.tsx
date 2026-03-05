import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      window.history.pushState({}, '', '/account/dashboard')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <header className="auth-header">
        <div className="auth-brand">
          <div className="auth-brand-badge">
            <Icon name="chair" className="icon-sm" />
          </div>
          <h2>TRUE FURN</h2>
        </div>
        <a className="auth-return-link" href="/">
          Return to Shop
        </a>
      </header>

      <main className="auth-main">
        <div className="auth-card auth-card-login">
          <div className="auth-title-block">
            <h1>Welcome Back</h1>
            <p>Please enter your details to access your account</p>
          </div>

          <div className="auth-socials">
            <GoogleLoginButton />
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="auth-error">{error}</p>}

            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <div className="field-head">
              <label htmlFor="login-password">Password</label>
              <a href="#">Forgot Password?</a>
            </div>
            <div className="field-icon-right">
              <input
                id="login-password"
                placeholder="********"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}>
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="icon-sm" />
              </button>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </label>

            <button className="btn-primary auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Do not have an account?{' '}
            <a href="/signup">Sign up for free</a>
          </p>
        </div>
      </main>

      <footer className="auth-footer">
        <p>
          Copyright 2026 TRUE FURN. All rights reserved.
          <span>|</span>
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Terms of Service</a>
        </p>
      </footer>
    </div>
  )
}
