import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthHook'

const navItems = [
  { href: '/', label: 'Home', icon: 'home' as const },
  { href: '/shop', label: 'Shop', icon: 'add_shopping_cart' as const },
  { href: '#', label: 'Collections', icon: 'gift' as const },
  { href: '/shop', label: 'Living Room', icon: 'chair' as const },
  { href: '/shop', label: 'Bedroom', icon: 'home' as const },
  { href: '/shop', label: 'Office', icon: 'business' as const },
]

export function Header() {
  const { totalItems } = useCart()
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`site-header${isMobileMenuOpen ? ' mobile-menu-open' : ''}`}>
      {isMobileMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        />
      )}
      <div className="container nav-row">
        <button
          className="icon-btn mobile-nav-toggle"
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-panel"
          onClick={toggleMobileMenu}
        >
          <Icon name={isMobileMenuOpen ? 'close' : 'menu'} className="icon-md" />
        </button>
        <div className="nav-left">
          <div className="brand-wrap">
            <Icon name="chair" className="brand-icon" />
            <h2 className="brand-title">TRUE FURN</h2>
          </div>
          <nav className="main-nav">
            {navItems.map((item) => (
              <a key={item.label} className="nav-link" href={item.href}>
                <Icon name={item.icon} className="nav-link-icon" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="nav-right">
          <div className="search-box">
            <Icon name="search" className="icon-muted icon-sm" />
            <input
              className="search-input"
              placeholder="Search furniture..."
              type="text"
            />
          </div>
          <a className="icon-btn cart-icon-btn" href="/cart">
            <Icon name="shopping_cart" className="icon-md" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </a>
          <a
            className="icon-btn"
            style={{ display: 'flex', alignItems: 'center' }}
            href={user ? '/account/dashboard' : '/login'}
            aria-label={user ? 'My Account' : 'Sign In'}
            title={user ? `Hi, ${user.name}` : 'Sign In'}
          >
            {user ? (
              <div className="header-user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <>
                    {user.name.charAt(0).toUpperCase()}
                    {user.lname ? user.lname.charAt(0).toUpperCase() : ''}
                  </>
                )}
              </div>
            ) : (
              <Icon name="person" className="icon-md" />
            )}
          </a>
        </div>
      </div>
      <div
        id="mobile-menu-panel"
        className={`mobile-menu-panel${isMobileMenuOpen ? ' open' : ''}`}
      >
        <div className="mobile-menu-head">
          <div className="brand-wrap">
            <Icon name="chair" className="brand-icon" />
            <h2 className="brand-title">TRUE FURN</h2>
          </div>
          <button
            className="icon-btn mobile-menu-close"
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            <Icon name="close" className="icon-md" />
          </button>
        </div>
        <nav className="mobile-menu-links">
          {navItems.map((item) => (
            <a
              key={`mobile-${item.label}`}
              className="mobile-menu-link"
              href={item.href}
              onClick={closeMobileMenu}
            >
              <span className="mobile-menu-link-left">
                <Icon name={item.icon} className="mobile-menu-link-icon" />
                <span>{item.label}</span>
              </span>
              <Icon name="chevron_right" className="mobile-menu-link-chevron" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
