import '../../styles/pages/goal.css'

import start0 from '../../../goal/start0.png'
import navbar1 from '../../../goal/navbar1.png'
import navbar2 from '../../../goal/navbar2.png'
import navbar3 from '../../../goal/navbar3.png'
import navbar4a from '../../../goal/navbar4a.png'
import navbar4b from '../../../goal/navbar4b.png'
import navbar5 from '../../../goal/navbar5.png'
import placeholderPage from '../../../goal/placeholder_page.png'
import sidebar from '../../../goal/sidebar.png'
import type { ComponentType } from 'react'

const createGoalPage = (src: string, alt: string): ComponentType => {
  const GoalPage = () => (
    <div className="goal-reference">
      <img src={src} alt={alt} className="goal-reference__image" />
    </div>
  )
  GoalPage.displayName = `GoalPage(${alt})`
  return GoalPage
}

export const goalPages: Record<string, ComponentType> = {
  '/goal/start0': createGoalPage(start0, 'Referenz Startseite'),
  '/goal/navbar1': createGoalPage(navbar1, 'Referenznavigation 1'),
  '/goal/navbar2': createGoalPage(navbar2, 'Referenznavigation 2'),
  '/goal/navbar3': createGoalPage(navbar3, 'Referenznavigation 3'),
  '/goal/navbar4a': createGoalPage(navbar4a, 'Referenznavigation 4a'),
  '/goal/navbar4b': createGoalPage(navbar4b, 'Referenznavigation 4b'),
  '/goal/navbar5': createGoalPage(navbar5, 'Referenznavigation 5'),
  '/goal/placeholder_page': createGoalPage(placeholderPage, 'Referenz Platzhalterseite'),
  '/goal/sidebar': createGoalPage(sidebar, 'Referenz Sidebar'),
}
