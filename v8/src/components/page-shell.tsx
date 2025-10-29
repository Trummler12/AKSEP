import { useEffect, useRef, type ReactNode } from 'react'
import Navigation from './navigation/Navigation'
import Footer from './footer'
import type { RouteConfig } from '../data/routes'

interface PageShellProps {
  children: ReactNode
  route?: RouteConfig
  path: string
}

export default function PageShell({ children, route, path }: PageShellProps) {
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const main = mainRef.current
    if (main) {
      window.requestAnimationFrame(() => {
        main.focus({ preventScroll: false })
      })
    }
  }, [path])

  useEffect(() => {
    if (!route?.description) {
      return
    }
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', route.description)
    }
  }, [route?.description])

  return (
    <div className="page-shell">
      <a href="#hauptinhalt" className="skip-link">
        Zum Hauptinhalt springen
      </a>
      <header className="page-shell__header">
        <Navigation currentPath={path} />
      </header>
      <main
        id="hauptinhalt"
        ref={mainRef}
        tabIndex={-1}
        className="page-shell__main"
        aria-label={route?.title ?? 'Seiteninhalt'}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
