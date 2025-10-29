import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ROUTES, type RouteConfig } from '../../data/routes'
import { goalPages } from '../../content/goal'
import PageShell from '../page-shell'

const StartPage = lazy(() => import('../../content/start'))
const PlaceholderPage = lazy(() => import('../../content/page-placeholder'))

const DEFAULT_TITLE = 'DIE AKSEP'

function TitleSync() {
  const location = useLocation()

  useEffect(() => {
    const routeConfig = ROUTES[location.pathname]
    if (routeConfig) {
      document.title = `${routeConfig.title} · DIE AKSEP`
      return
    }

    if (location.pathname in goalPages) {
      document.title = `Referenzansicht ${location.pathname}`
    } else {
      document.title = DEFAULT_TITLE
    }
  }, [location.pathname])

  return null
}

function getRouteComponent(path: string) {
  if (path === '/.start') {
    return StartPage
  }
  return PlaceholderPage
}

function routeElement(path: string, config: RouteConfig) {
  const Component = getRouteComponent(path)
  return (
    <Route
      key={path}
      path={path}
      element={
        <PageShell route={config} path={path}>
          <Component />
        </PageShell>
      }
    />
  )
}

export default function Router() {
  const routeEntries = Object.entries(ROUTES)
  const goalEntries = Object.entries(goalPages)

  return (
    <Suspense fallback={<div className="router-fallback" role="status" aria-live="polite">Inhalte werden geladen…</div>}>
      <TitleSync />
      <Routes>
        <Route path="/" element={<Navigate to="/.start" replace />} />
        <Route path="/start" element={<Navigate to="/.start" replace />} />
        {routeEntries.map(([path, config]) => routeElement(path, config))}
        {goalEntries.map(([path, Component]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/.start" replace />} />
      </Routes>
    </Suspense>
  )
}
