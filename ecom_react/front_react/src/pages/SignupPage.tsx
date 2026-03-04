import { Icon } from '../components/ui/Icon'

export function SignupPage() {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <div className="auth-brand">
          <div className="auth-brand-badge">
            <Icon name="chair" className="icon-sm" />
          </div>
          <h2>Luxe Furnish</h2>
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
            <button className="auth-social-btn" type="button">
              <img
                alt="Google"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZnRhyPKJWEzv3HxRFNw19yzpkOqPf7IoqYV7fvLykCLK-xXYwfPvbXw1x03VSGfBJsj_pxVK2oUJXdwsOmKhJ1seMdcenZVnkjXpdd5qp9Q13rXiqk40i6dYHTJ3ACx7TLGUaqJG6jXdQhFtO0OrOEc31XZ72rIknLD1EkZYTWNrcoJUA1iL04pWrPHWOnx4Ojif3P8lgytwoNrBExZUb-z_4xM7atoDOEIvEYyw2kHi5ARoL_GE8P1qWhwqaPzrSiutJ2RzkRX03"
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
            <label htmlFor="signup-name">Full Name</label>
            <div className="field-icon-left">
              <Icon name="person" className="icon-sm" />
              <input
                id="signup-name"
                placeholder="Enter your full name"
                type="text"
              />
            </div>

            <label htmlFor="signup-email">Email Address</label>
            <div className="field-icon-left">
              <Icon name="mail" className="icon-sm" />
              <input
                id="signup-email"
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <label htmlFor="signup-password">Password</label>
            <div className="field-icon-left">
              <Icon name="lock" className="icon-sm" />
              <input
                id="signup-password"
                placeholder="Create a strong password"
                type="password"
              />
            </div>

            <label className="checkbox-row checkbox-row-top">
              <input type="checkbox" />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </span>
            </label>

            <button className="btn-primary auth-submit" type="submit">
              Create Account
              <Icon name="arrow_forward" className="icon-sm" />
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
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
