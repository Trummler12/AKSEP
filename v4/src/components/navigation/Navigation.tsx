import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getPrimaryNavItems } from '../../data/navigation'
import OverflowNavigation from './OverflowNavigation'
import { Tooltip } from '../ui/tooltip'
import logoSrc from '../../assets/Logo_AKSEP.png'

export default function Navigation() {
  const location = useLocation()
  const [openKey, setOpenKey] = useState<string | null>(null)
  const items = getPrimaryNavItems()

  useEffect(() => {
    setOpenKey(null)
  }, [location.pathname])

  return (
    <header className="navigation" role="banner">
      <a href="#hauptinhalt" className="skip-link">
        Zum Inhalt springen
      </a>
      <div className="navigation__inner">
        <Tooltip content="Zur Startseite">
          <Link to="/.start" className="navigation__brand" aria-label="DIE AKSEP">
            <img src={logoSrc} alt="DIE AKSEP" className="navigation__logo" />
            <span className="navigation__brand-text">DIE AKSEP</span>
          </Link>
        </Tooltip>
        <OverflowNavigation
          items={items}
          openKey={openKey}
          onOpenChange={setOpenKey}
          currentPath={location.pathname}
        />
      </div>
    </header>
  )
}
