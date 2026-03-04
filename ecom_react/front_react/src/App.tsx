import { useEffect, useMemo, useState } from 'react'
import { MainLayout } from './components/layout/MainLayout'
import { UserDashboardLayout } from './components/layout/UserDashboardLayout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { CartPage } from './pages/CartPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ShopPage } from './pages/ShopPage'
import { SignupPage } from './pages/SignupPage'
import { UserDashboardPage } from './pages/UserDashboardPage'
import { UserOrderHistoryPage } from './pages/UserOrderHistoryPage'
import { UserAccountSettingsPage } from './pages/UserAccountSettingsPage'
import { UserShippingAddressesPage } from './pages/UserShippingAddressesPage'
import { CartProvider } from './context/CartContext'

function PageSkeleton() {
  return (
    <div className="page-skeleton container">
      <div className="skeleton-line skeleton-line-sm"></div>
      <div className="skeleton-line skeleton-line-lg"></div>
      <div className="skeleton-grid">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <UserDashboardLayout active="dashboard" title="Loading..." subtitle="Please wait">
      <div className="page-skeleton">
        <div className="skeleton-line skeleton-line-lg"></div>
        <div className="skeleton-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    </UserDashboardLayout>
  )
}

function isDashboardPath(path: string) {
  return (
    path === '/account' ||
    path === '/dashboard' ||
    path === '/account/dashboard' ||
    path === '/account/orders' ||
    path === '/account/addresses' ||
    path === '/account/settings'
  )
}

function isAuthPath(path: string) {
  return path === '/login' || path === '/signup'
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname.toLowerCase())
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [loadingPath, setLoadingPath] = useState<string | null>(null)

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname.toLowerCase())
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as Element | null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }

      const url = new URL(anchor.href, window.location.origin)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      event.preventDefault()
      setIsLoadingRoute(true)
      setLoadingPath(url.pathname.toLowerCase())
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)

      window.setTimeout(() => {
        setPath(url.pathname.toLowerCase())
        setIsLoadingRoute(false)
        setLoadingPath(null)
      }, 350)
    }

    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onDocumentClick, true)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onDocumentClick, true)
    }
  }, [])

  const route = useMemo(() => {
    if (path === '/login') return <LoginPage />
    if (path === '/signup') return <SignupPage />
    if (path === '/shop') {
      return (
        <MainLayout>
          <ShopPage />
        </MainLayout>
      )
    }
    if (
      path === '/account' ||
      path === '/dashboard' ||
      path === '/account/dashboard'
    ) {
      return <UserDashboardPage />
    }
    if (path === '/account/orders') {
      return <UserOrderHistoryPage />
    }
    if (path === '/account/addresses') {
      return <UserShippingAddressesPage />
    }
    if (path === '/account/settings') {
      return <UserAccountSettingsPage />
    }
    if (path === '/cart') {
      return (
        <MainLayout>
          <CartPage />
        </MainLayout>
      )
    }
    if (path === '/product') {
      return (
        <MainLayout>
          <ProductDetailPage />
        </MainLayout>
      )
    }
    return (
      <MainLayout>
        <HomePage />
      </MainLayout>
    )
  }, [path])

  if (isLoadingRoute) {
    const targetPath = loadingPath ?? path
    if (isAuthPath(targetPath)) {
      return (
        <CartProvider>
          <PageSkeleton />
        </CartProvider>
      )
    }
    if (isDashboardPath(targetPath)) {
      return (
        <CartProvider>
          <DashboardSkeleton />
        </CartProvider>
      )
    }
    return (
      <CartProvider>
        <MainLayout>
          <PageSkeleton />
        </MainLayout>
      </CartProvider>
    )
  }

  return <CartProvider>{route}</CartProvider>
}

export default App
