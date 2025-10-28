import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../../data/routes'
import PageShell from '../page-shell'

const StartPage = lazy(() => import('../../content/start'))
const PlaceholderPage = lazy(() => import('../../content/page-placeholder'))

const loadingFallback = (
  <div aria-busy="true" aria-live="polite" className="page-shell__loading" role="status">
    Inhalte werden geladen …
  </div>
)

const routeEntries = Object.entries(ROUTES)

export function Router() {
  return (
    <Suspense fallback={loadingFallback}>
      <Routes>
        <Route element={<Navigate replace to="/.start" />} path="/" />
        <Route element={<PageShell><Outlet /></PageShell>}>
          <Route element={<StartPage />} path="/.start" />
          {routeEntries
            .filter(([path]) => path !== '/.start')
            .map(([path, config]) => (
              <Route
                element={<PlaceholderPage path={path} config={config} />}
                key={path}
                path={path}
              />
            ))}
          <Route element={<Navigate replace to="/.start" />} path="*" />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default Router
