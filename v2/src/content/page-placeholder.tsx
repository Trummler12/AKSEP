import { Link } from 'react-router-dom'
import type { RouteConfig } from '../data/routes'
import Icon from '../components/ui/icon'
import '../styles/pages/standard.css'

interface PagePlaceholderProps {
  path: string
  config: RouteConfig
}

export default function PagePlaceholder({ config }: PagePlaceholderProps) {
  return (
    <section aria-labelledby="placeholder-heading" className="standard-page">
      <div className="standard-page__card" role="presentation">
        <div className="standard-page__icon" aria-hidden="true">
          <Icon name="FileText" size={48} />
        </div>
        <h1 className="standard-page__title" id="placeholder-heading">
          {config.title}
        </h1>
        {config.description ? (
          <p className="standard-page__description">{config.description}</p>
        ) : (
          <p className="standard-page__description">
            Diese Seite ist in Entwicklung und wird bald mit Inhalten gefüllt.
          </p>
        )}
        <p className="standard-page__note">
          Wir arbeiten daran, die Inhalte für diesen Bereich aufzubereiten. Danke für Ihre Geduld.
        </p>
        <Link className="standard-page__cta" to="/.start">
          Zur Startseite
        </Link>
      </div>
    </section>
  )
}
