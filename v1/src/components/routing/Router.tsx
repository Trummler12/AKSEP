import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '../../data/routes'
import PageShell from '../page-shell'

const StartPage = lazy(() => import('../../content/start'))
const PlaceholderPage = lazy(() => import('../../content/page-placeholder'))

const Router = () => {
  return (
    <Suspense
      fallback={
        <div className="app-loading" role="status" aria-live="polite">
          Inhalte werden geladen …
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/.start" replace />} />
        <Route element={<PageShell />}>
          {Object.entries(ROUTES).map(([path, config]) => {
            if (path === '/.start') {
              return <Route key={path} path={path} element={<StartPage />} />
            }

            return (
              <Route
                key={path}
                path={path}
                element={<PlaceholderPage title={config.title} description={config.description} />}
              />
            )
          })}
          <Route path="*" element={<Navigate to="/.start" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default Router
