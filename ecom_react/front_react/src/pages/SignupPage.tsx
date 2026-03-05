import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton'

export function SignupPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !passwordConfirmation) return

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      await register(name, email, password, passwordConfirmation)
      window.history.pushState({}, '', '/account/dashboard')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
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
        <a className="auth-close-btn" href="/">
          <Icon name="close" className="icon-sm" />
        </a>
      </header>

      <main className="auth-main">
        <div className="auth-card auth-card-signup">
          <div className="auth-title-block">
            <h1>Create Your Account</h1>
            <p>Join our community of interior enthusiasts.</p>
          </div>

          <div className="auth-socials">
            <GoogleLoginButton />
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="auth-error">{error}</p>}

            <label htmlFor="signup-name">Full Name</label>
            <div className="field-icon-left">
              <Icon name="person" className="icon-sm" />
              <input
                id="signup-name"
                placeholder="Enter your full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <label htmlFor="signup-email">Email Address</label>
            <div className="field-icon-left">
              <Icon name="mail" className="icon-sm" />
              <input
                id="signup-email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <label htmlFor="signup-password">Password</label>
            <div className="field-icon-left field-icon-both">
              <Icon name="lock" className="icon-sm" />
              <input
                id="signup-password"
                placeholder="Create a strong password (min. 8 chars)"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}>
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="icon-sm" />
              </button>
            </div>

            <label htmlFor="signup-password-confirm">Confirm Password</label>
            <div className="field-icon-left field-icon-both">
              <Icon name="lock" className="icon-sm" />
              <input
                id="signup-password-confirm"
                placeholder="Re-enter your password"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                disabled={isLoading}
              />
              <button type="button" onClick={() => setShowPasswordConfirmation((v) => !v)}>
                <Icon name={showPasswordConfirmation ? 'visibility_off' : 'visibility'} className="icon-sm" />
              </button>
            </div>

            <label className="checkbox-row checkbox-row-top">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </span>
            </label>

            <button className="btn-primary auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'}
              {!isLoading && <Icon name="arrow_forward" className="icon-sm" />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <a href="/login">Sign In</a>
          </p>
        </div>
      </main>

      <footer className="auth-tagline">
        <span>Modern</span>
        <i></i>
        <span>Premium</span>
        <i></i>
        <span>Minimalist</span>
      </footer>
    </div>
  )
}
