import type { PropsWithChildren } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="site-shell">
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  )
}
