import type { ReactNode } from 'react'
import Navigation from './navigation/Navigation'
import Footer from './footer'

interface PageShellProps {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="page-shell">
      <Navigation />
      <main id="main-content" className="page-shell__main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
