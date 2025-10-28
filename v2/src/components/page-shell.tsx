import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Navigation } from './navigation/Navigation'
import Footer from './footer'
import '../styles/components/shared.css'
import '../styles/components/footer.css'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  const location = useLocation()

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">
        Zum Hauptinhalt springen
      </a>
      <header className="page-shell__header">
        <Navigation currentPath={location.pathname} />
      </header>
      <main id="main-content" className="page-shell__main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PageShell
