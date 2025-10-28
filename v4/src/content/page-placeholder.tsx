import { useLocation } from 'react-router-dom'
import { ROUTES } from '../data/routes'
import { Icon } from '../components/ui/icon'
import { NavLink } from 'react-router-dom'

export default function PagePlaceholder() {
  const location = useLocation()
  const routeConfig = ROUTES[location.pathname]
  const title = routeConfig?.title ?? 'Seite in Arbeit'
  const description =
    routeConfig?.description ??
    'Diese Seite befindet sich noch im Aufbau. Wir arbeiten daran, die Inhalte bald bereitzustellen.'

  return (
    <section className="standard-page" aria-labelledby="placeholder-heading">
      <div className="standard-page__inner">
        <Icon name="FileText" className="standard-page__icon" aria-hidden="true" />
        <h1 id="placeholder-heading" className="standard-page__title">
          {title}
        </h1>
        <p className="standard-page__description">{description}</p>
        <NavLink to="/.start" className="ui-button ui-button--primary ui-button--md standard-page__cta">
          Zur Startseite
        </NavLink>
      </div>
    </section>
  )
}
