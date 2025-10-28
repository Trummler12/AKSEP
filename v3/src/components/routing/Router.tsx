import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../../data/routes'

const StartPage = lazy(() => import('../../content/start'))
const PlaceholderPage = lazy(() => import('../../content/page-placeholder'))

const PLACEHOLDER_PATHS = Object.keys(ROUTES).filter((path) => path !== '/.start')

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="page-loading" role="status">Inhalt wird geladen…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/.start" replace />} />
        <Route path="/.start" element={<StartPage />} />
        {PLACEHOLDER_PATHS.map((path) => (
          <Route key={path} path={path} element={<PlaceholderPage />} />
        ))}
        <Route path="*" element={<Navigate to="/.start" replace />} />
      </Routes>
    </Suspense>
  )
}
