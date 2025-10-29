import { useLocation } from 'react-router-dom'
import { ROUTES } from '../data/routes'
import { Icon } from '../components/ui/icon'
import '../styles/pages/standard.css'

const fallbackDescription =
  'Diese Seite ist in Entwicklung und wird bald verfügbar sein. Danke für Ihre Geduld und Ihr Interesse an DIE AKSEP.'

export default function PagePlaceholder() {
  const location = useLocation()
  const route = ROUTES[location.pathname]

  return (
    <div className="standard-page" aria-labelledby="placeholder-heading">
      <div className="standard-page__container">
        <div className="standard-page__icon" aria-hidden>
          <Icon name="FileText" size={52} />
        </div>
        <h1 id="placeholder-heading" className="standard-page__title">
          {route?.title ?? 'Seite in Arbeit'}
        </h1>
        <p className="standard-page__description">{route?.description ?? fallbackDescription}</p>
        <a className="standard-page__link" href="/.start">
          <Icon name="ArrowRight" size={18} aria-hidden className="standard-page__link-icon" />
          Zur Startseite
        </a>
      </div>
    </div>
  )
}
