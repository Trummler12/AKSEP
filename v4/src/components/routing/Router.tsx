import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PageShell from '../page-shell'
import { ROUTES } from '../../data/routes'

const StartPage = lazy(() => import('../../content/start'))
const PlaceholderPage = lazy(() => import('../../content/page-placeholder'))

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="page-shell__loading" role="status">Inhalte werden geladen…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/.start" replace />} />
        {Object.keys(ROUTES).map((path) => {
          const Component = path === '/.start' ? StartPage : PlaceholderPage
          return (
            <Route
              key={path}
              path={path}
              element={
                <PageShell>
                  <Component />
                </PageShell>
              }
            />
          )
        })}
        <Route
          path="*"
          element={
            <PageShell>
              <PlaceholderPage />
            </PageShell>
          }
        />
      </Routes>
    </Suspense>
  )
}
