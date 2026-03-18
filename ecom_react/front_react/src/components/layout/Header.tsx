import { useState, useEffect } from 'react'
import { Icon } from '../ui/Icon'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthHook'

const navItems = [
  { href: '/', label: 'Home', icon: 'home' as const },
  { href: '/shop', label: 'Shop', icon: 'add_shopping_cart' as const },
  { href: '/about', label: 'About', icon: 'info' as const },
  { href: '/contact', label: 'Contact', icon: 'mail' as const },
  { 
    label: 'Categories', 
    icon: 'menu' as const,
    children: [
      { href: '/category/living-room', label: 'Living Room', icon: 'chair' as const },
      { href: '/category/bedroom', label: 'Bedroom', icon: 'bed' as const },
      { href: '/category/office', label: 'Office', icon: 'business' as const },
      { href: '/category/furniture', label: 'Furniture', icon: 'chair' as const },
      { href: '/category/sofa-and-seating', label: 'Sofa and Seating', icon: 'chair' as const },
      { href: '/category/kitchen-and-dining', label: 'Kitchen and Dining', icon: 'kitchen' as const },
      { href: '/category/lamps-and-lightings', label: 'Lamps', icon: 'lightbulb' as const },
      { href: '/category/luxury', label: 'Luxury', icon: 'award' as const },
    ]
  },
]

export function Header() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync with URL query on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) setSearchQuery(q)
  }, [])

  // Client-side navigation helper
  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Handle Search Submission (Enter)
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim()
      navigate(`/shop${q ? `?q=${encodeURIComponent(q)}` : ''}`)
    }
  }

  // Handle Live Search (Type)
  const handleLiveSearch = (val: string) => {
    setSearchQuery(val)
    // If already on shop page, update URL live
    if (window.location.pathname.toLowerCase() === '/shop') {
      const url = val.trim() ? `/shop?q=${encodeURIComponent(val.trim())}` : '/shop'
      window.history.pushState({}, '', url)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

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
          <a className="brand-wrap" href="/">
            <img src="/logos/tree_furn_logo.png" alt="TREEFURN" className="brand-logo" />
          </a>
          <nav className="main-nav">
            {navItems.map((item) => (
              <div key={item.label} className={item.children ? 'nav-dropdown-wrap' : ''}>
                {item.href ? (
                  <a className="nav-link" href={item.href}>
                    <Icon name={item.icon} className="nav-link-icon" />
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <button className="nav-link nav-dropdown-trigger" type="button">
                    <Icon name={item.icon} className="nav-link-icon" />
                    <span>{item.label}</span>
                    <Icon name="chevron_right" className="icon-xs dropdown-arrow" />
                  </button>
                )}
                
                {item.children && (
                  <div className="nav-dropdown">
                    {item.children.map((child) => (
                      <a key={child.label} className="dropdown-link" href={child.href}>
                        <Icon name={child.icon} className="dropdown-link-icon" />
                        <span>{child.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
              value={searchQuery}
              onChange={(e) => handleLiveSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
          <a className="icon-btn cart-icon-btn" href="/cart">
            <Icon name="shopping_cart" className="icon-md" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </a>
          {user ? (
            <div className="user-dropdown-wrap">
              <button
                className="icon-btn"
                aria-label="My Account"
                title={`Hi, ${user.name}`}
                type="button"
              >
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
              </button>
              <div className="user-dropdown">
                <div className="user-dropdown-info">
                  <span className="user-dropdown-name">{user.name} {user.lname}</span>
                  <span className="user-dropdown-email">{user.email}</span>
                </div>
                <a className="dropdown-link" href="/account/dashboard">
                  <Icon name="dashboard" className="dropdown-link-icon" />
                  <span>Dashboard</span>
                </a>
                <div className="user-dropdown-divider" />
                <button 
                  className="dropdown-link" 
                  style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    logout().then(() => {
                      window.location.href = '/login'
                    })
                  }}
                  type="button"
                >
                  <Icon name="logout" className="dropdown-link-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <a
              className="icon-btn"
              href="/login"
              aria-label="Sign In"
              title="Sign In"
            >
              <Icon name="person" className="icon-md" />
            </a>
          )}
        </div>
      </div>
      <div
        id="mobile-menu-panel"
        className={`mobile-menu-panel${isMobileMenuOpen ? ' open' : ''}`}
      >
        <div className="mobile-menu-head">
          <a className="brand-wrap" href="/" onClick={closeMobileMenu}>
            <img src="/logos/tree_furn_logo.png" alt="TREEFURN" className="brand-logo" />
          </a>
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
            <div key={`mobile-wrap-${item.label}`}>
              {item.href ? (
                <a
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
              ) : (
                <div className="mobile-menu-group">
                  <div className="mobile-group-title">
                    <Icon name={item.icon} className="mobile-menu-link-icon" />
                    <span>{item.label}</span>
                  </div>
                  <div className="mobile-group-children">
                    {item.children?.map((child) => (
                      <a
                        key={`mobile-child-${child.label}`}
                        className="mobile-menu-link-sub"
                        href={child.href}
                        onClick={closeMobileMenu}
                      >
                        <span className="mobile-menu-link-left">
                          <Icon name={child.icon} className="mobile-menu-link-icon" />
                          <span>{child.label}</span>
                        </span>
                        <Icon name="chevron_right" className="mobile-menu-link-chevron" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  )
}
