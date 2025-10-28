import { Link } from 'react-router-dom'

import Icon from '../components/ui/icon'
import Button from '../components/ui/button'
import '../styles/pages/standard.css'

interface PagePlaceholderProps {
  title?: string
  description?: string
}

const PagePlaceholder = ({ title, description }: PagePlaceholderProps) => {
  return (
    <div className="standard-page">
      <div className="standard-page__card">
        <div className="standard-page__icon" aria-hidden="true">
          <Icon name="FileText" />
        </div>
        <h1 className="standard-page__title">{title ?? 'Diese Seite ist in Entwicklung.'}</h1>
        <p className="standard-page__description">
          {description ?? 'Wir arbeiten daran, diese Inhalte für Sie bereitzustellen. Bitte schauen Sie bald wieder vorbei!'}
        </p>
        <div className="standard-page__actions">
          <Button asChild>
            <Link to="/.start">Zur Startseite</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PagePlaceholder
