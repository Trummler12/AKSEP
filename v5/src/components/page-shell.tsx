import { Outlet } from 'react-router-dom'
import '../styles/components/shared.css'
import { Navigation } from './navigation'
import Footer from './footer'

function PageShell() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Zum Hauptinhalt springen
      </a>
      <header>
        <Navigation />
      </header>
      <main id="main-content" className="app-shell__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PageShell
