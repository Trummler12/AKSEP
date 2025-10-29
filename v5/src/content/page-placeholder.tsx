import { Link, useLocation } from 'react-router-dom'
import '../styles/pages/standard.css'
import Button from '../components/ui/button'
import Icon from '../components/ui/icon'

export default function PagePlaceholder() {
  const location = useLocation()

  return (
    <div className="standard-page">
      <div className="standard-page__inner">
        <span className="standard-page__icon" aria-hidden="true">
          <Icon name="FileText" size={64} />
        </span>
        <p className="standard-page__eyebrow">{location.pathname}</p>
        <h1 className="standard-page__title">Diese Seite entsteht gerade.</h1>
        <p className="standard-page__description">
          Wir arbeiten daran, die Inhalte für diesen Bereich aufzubereiten. Schauen Sie bald wieder vorbei oder entdecken Sie
          in der Zwischenzeit unser Programm und aktuelle Initiativen.
        </p>
        <div className="standard-page__actions">
          <Button asChild>
            <Link to="/.start">Zur Startseite</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/kontakt">Kontakt aufnehmen</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
