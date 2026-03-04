import { useState, type PropsWithChildren } from 'react'
import { Icon } from '../ui/Icon'

type DashboardNavKey =
  | 'dashboard'
  | 'orders'
  | 'addresses'
  | 'settings'

type UserDashboardLayoutProps = PropsWithChildren<{
  title: string
  subtitle?: string
  active?: DashboardNavKey
  actionLabel?: string
  actionHref?: string
}>

const navItems: Array<{
  key: DashboardNavKey
  label: string
  href: string
  icon:
    | 'dashboard'
    | 'order_history'
    | 'location'
    | 'payment'
    | 'settings'
}> = [
  { key: 'dashboard', label: 'Dashboard', href: '/account', icon: 'dashboard' },
  { key: 'orders', label: 'Order History', href: '/account/orders', icon: 'order_history' },
  {
    key: 'addresses',
    label: 'Shipping Addresses',
    href: '/account/addresses',
    icon: 'location',
  },
  { key: 'settings', label: 'Account Settings', href: '/account/settings', icon: 'settings' },
]

export function UserDashboardLayout({
  title,
  subtitle,
  active = 'dashboard',
  actionLabel,
  actionHref = '/shop',
  children,
}: UserDashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="dash-shell">
      <button
        aria-label="Open sidebar"
        className="dash-sidebar-toggle"
        onClick={() => setIsSidebarOpen(true)}
        type="button"
      >
        <Icon className="icon-sm" name="menu" />
      </button>

      {isSidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="dash-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}

      <aside className={`dash-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="dash-sidebar-head">
          <a className="dash-brand" href="/account">
            <span className="dash-brand-icon">
              <Icon className="icon-sm" name="chair" />
            </span>
            <strong>TRUE FURN</strong>
          </a>
          <button
            aria-label="Close sidebar"
            className="dash-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          >
            <Icon className="icon-sm" name="close" />
          </button>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <a
              className={`dash-nav-link ${active === item.key ? 'active' : ''}`}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              key={item.key}
            >
              <Icon className="icon-sm" name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="dash-user-card">
          <div className="dash-user-avatar">AL</div>
          <div>
            <strong>Alexander Luxe</strong>
            <p>Gold Member</p>
          </div>
          <button type="button">
            <Icon className="icon-sm" name="logout" />
            Logout
          </button>
        </div>
      </aside>

      <div className="dash-main-wrap">
        <header className="dash-topbar">
          <h2>{title}</h2>
          <div className="dash-top-actions">
            <button className="icon-btn" type="button">
              <Icon className="icon-sm" name="bell" />
            </button>
            <button className="icon-btn" type="button">
              <Icon className="icon-sm" name="search" />
            </button>
            <span className="member-badge">Member since 2022</span>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-page-head">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actionLabel && (
              <a className="dash-head-btn" href={actionHref}>
                {actionLabel}
              </a>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
