import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { getPrimaryNavItems } from '../../data/navigation'
import Icon from '../ui/icon'
import Tooltip, { TooltipContent, TooltipTrigger } from '../ui/tooltip'
import '../../styles/components/navigation.css'
import NavigationItem from './NavigationItem'
import OverflowNavigation from './OverflowNavigation'

const Navigation = () => {
  const location = useLocation()
  const navItems = useMemo(() => getPrimaryNavItems(), [])
  const [openKey, setOpenKey] = useState<string | null>(null)

  const handleOpen = (key: string) => {
    setOpenKey(key)
  }

  const handleClose = (key?: string) => {
    setOpenKey((current) => {
      if (!key || current === key) {
        return null
      }

      return current
    })
  }

  useEffect(() => {
    setOpenKey(null)
  }, [location.pathname])

  const activePath = location.pathname

  return (
    <nav className="navigation" aria-label="Hauptnavigation">
      <div className="navigation__inner">
        <Tooltip>
          <TooltipTrigger>
            <Link to="/.start" className="navigation__brand" aria-label="Zur Startseite">
              <Icon name="Aksep" className="navigation__brand-icon" />
              <span className="navigation__brand-text">DIE AKSEP</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Zur Startseite</TooltipContent>
        </Tooltip>

        <OverflowNavigation
          items={navItems}
          openKey={openKey}
          onOpen={handleOpen}
          onClose={handleClose}
          renderItem={(item, props) => (
            <NavigationItem key={item.key ?? item.label} item={item} activePath={activePath} {...props} />
          )}
          activePath={activePath}
        />
      </div>
    </nav>
  )
}

export default Navigation
