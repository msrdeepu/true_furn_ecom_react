import { Icon } from '../components/ui/Icon'

export function LoginPage() {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <div className="auth-brand">
          <div className="auth-brand-badge">
            <Icon name="chair" className="icon-sm" />
          </div>
          <h2>Luxe Furnish</h2>
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
            <button className="auth-social-btn" type="button">
              <img
                alt="Google"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnmImyfZ9T09ap-YHejSmuCYCUodPNX26wILz5sioPqPUJFDwdo3as81Zj07WyC3CKPi_at2QmHqIH3IAngNtbCtx8NTcubFwnvPa7nYc6mSyF91BXeMK4kyNtNP4XigYWOj50T2-CuM9jR3ylWpEkm_TrZ9dF6BuNvFwMBC9nLnL4bFWeAsOuUqS-xvmBw_zlZVBwEWHpzBviZ1XQTUTOokVrhNqhLw-p30aSqEi_mQMpkioAbny8SA0pkgzf8aa0obC9jE67v-HO"
              />
              <span>Continue with Google</span>
            </button>
            <button className="auth-social-btn" type="button">
              <Icon name="apple" className="icon-sm" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="login-email">Email Address</label>
            <input id="login-email" placeholder="name@company.com" type="email" />

            <div className="field-head">
              <label htmlFor="login-password">Password</label>
              <a href="#">Forgot Password?</a>
            </div>
            <div className="field-icon-right">
              <input
                id="login-password"
                placeholder="********"
                type="password"
              />
              <button type="button">
                <Icon name="visibility" className="icon-sm" />
              </button>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </label>

            <button className="btn-primary auth-submit" type="submit">
              Sign In
            </button>
          </form>

          <p className="auth-switch">
            Do not have an account?
            <a href="/signup">Sign up for free</a>
          </p>
        </div>
      </main>

      <footer className="auth-footer">
        <p>
          Copyright 2026 Luxe Furnish. All rights reserved.
          <span>|</span>
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Terms of Service</a>
        </p>
      </footer>
    </div>
  )
}
