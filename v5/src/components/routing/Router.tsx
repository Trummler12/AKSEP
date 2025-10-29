import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../../data/routes'
import PageShell from '../page-shell'
import type { GoalImagePageProps } from '../../content/goal-image'

const StartPage = lazy(() => import('../../content/start'))
const PlaceholderPage = lazy(() => import('../../content/page-placeholder'))
const GoalImagePage = lazy(() => import('../../content/goal-image'))

const goalRoutes: Record<string, GoalImagePageProps['imageKey']> = {
  '/goal/start0': 'start0',
  '/goal/navbar1': 'navbar1',
  '/goal/navbar2': 'navbar2',
  '/goal/navbar3': 'navbar3',
  '/goal/navbar4a': 'navbar4a',
  '/goal/navbar4b': 'navbar4b',
  '/goal/navbar5': 'navbar5',
  '/goal/placeholder_page': 'placeholder_page',
  '/goal/sidebar': 'sidebar',
}

const placeholderPaths = Object.keys(ROUTES).filter((path) => path !== '/.start' && !path.startsWith('/goal/'))

function Router() {
  return (
    <Suspense fallback={<div className="visually-hidden">Lädt…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/.start" replace />} />
        <Route element={<PageShell />}>
          <Route path="/.start" element={<StartPage />} />
          {placeholderPaths.map((path) => (
            <Route key={path} path={path} element={<PlaceholderPage />} />
          ))}
        </Route>
        {Object.entries(goalRoutes).map(([path, imageKey]) => (
          <Route key={path} path={path} element={<GoalImagePage imageKey={imageKey} />} />
        ))}
        <Route path="*" element={<Navigate to="/.start" replace />} />
      </Routes>
    </Suspense>
  )
}

export default Router
