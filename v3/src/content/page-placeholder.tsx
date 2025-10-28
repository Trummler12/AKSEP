import { Link, useLocation } from 'react-router-dom'
import PageShell from '../components/page-shell'
import { getRouteConfig } from '../data/routes'
import { Button } from '../components/ui/button'
import Icon from '../components/ui/icon'

export default function PagePlaceholder() {
  const location = useLocation()
  const routeConfig = getRouteConfig(location.pathname)

  return (
    <PageShell>
      <article className="standard-page" aria-labelledby="placeholder-heading">
        <div className="standard-page__wrapper">
          <span className="standard-page__icon" aria-hidden="true">
            <Icon name="FileText" className="standard-page__icon-svg" />
          </span>
          <h1 className="standard-page__title" id="placeholder-heading">
            {routeConfig?.title ?? 'Inhalt in Vorbereitung'}
          </h1>
          <p className="standard-page__description">
            Dieser Bereich befindet sich noch im Aufbau. Wir arbeiten daran, Ihnen hier bald fundierte Inhalte bereitzustellen.
          </p>
          <Button asChild variant="secondary" size="lg" className="standard-page__action">
            <Link to="/.start">Zur Startseite</Link>
          </Button>
        </div>
      </article>
    </PageShell>
  )
}
