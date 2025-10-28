import { useEffect, useRef, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Footer from './footer'
import { Navigation } from './navigation'

type PageShellProps = {
  children?: ReactNode
}

const PageShell = ({ children }: PageShellProps) => {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!mainRef.current) {
      return
    }

    const main = mainRef.current
    main.focus({ preventScroll: false })
  }, [location])

  return (
    <div className="page-shell">
      <a className="skip-link" href="#hauptinhalt">
        Zum Inhalt springen
      </a>
      <header className="page-shell__header" role="banner">
        <Navigation />
      </header>
      <main id="hauptinhalt" ref={mainRef} className="page-shell__main" tabIndex={-1} role="main">
        {children ?? <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export default PageShell
