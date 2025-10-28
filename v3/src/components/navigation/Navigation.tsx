import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getPrimaryNavItems } from '../../data/navigation'
import type { NavItem } from '../../types/navigation'
import useOverflowNav from '../../hooks/useOverflowNav'
import NavigationItem from './NavigationItem'
import OverflowNavigation from './OverflowNavigation'
import Tooltip from '../ui/tooltip'

export default function Navigation() {
  const location = useLocation()
  const navItems = useMemo(() => getPrimaryNavItems(), [])
  const overflowController = useOverflowNav(navItems)
  const { containerRef, registerItem, registerOverflowTrigger, visibleKeys, overflowKeys } = overflowController
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(null)

  useEffect(() => {
    setActiveDropdownKey(null)
  }, [location.pathname])

  const visibleItems: NavItem[] = useMemo(() => {
    const keySet = new Set(visibleKeys)
    return navItems.filter((item) => (item.key ? keySet.has(item.key) : true))
  }, [navItems, visibleKeys])

  const handleDropdownChange = (nextKey: string | null) => {
    setActiveDropdownKey(nextKey)
  }

  return (
    <header className="navigation__header">
      <div className="navigation__skip">
        <a href="#main-content" className="navigation__skip-link">
          Zum Inhalt springen
        </a>
      </div>
      <nav className="navigation" aria-label="Hauptnavigation">
        <div className="navigation__inner">
          <Tooltip content="Zur Startseite">
            <Link to="/.start" className="navigation__brand" onClick={() => setActiveDropdownKey(null)}>
              <span className="navigation__logo" aria-hidden="true">
                <span className="navigation__logo-glow" />
                <span className="navigation__logo-core" />
              </span>
              <span className="navigation__brand-text">
                <span className="navigation__brand-title">DIE AKSEP</span>
                <span className="navigation__brand-subtitle">Für Transparenz, Evidenz und Teilhabe</span>
              </span>
            </Link>
          </Tooltip>

          <div className="navigation__primary" ref={containerRef}>
            <ul className="navigation__list" role="menubar" aria-label="Hauptnavigation">
              {visibleItems.map((item) => {
                const key = item.key ?? item.label
                const isActive = location.pathname === item.href
                return (
                  <NavigationItem
                    key={key}
                    item={item}
                    isActive={isActive}
                    registerItem={registerItem(key)}
                    onRequestCloseAll={handleDropdownChange}
                    currentPath={location.pathname}
                    activeDropdownKey={activeDropdownKey}
                  />
                )
              })}
            </ul>
          </div>

          <OverflowNavigation
            items={navItems}
            overflowKeys={overflowKeys}
            registerOverflowTrigger={registerOverflowTrigger}
            onNavigate={() => setActiveDropdownKey(null)}
            currentPath={location.pathname}
          />
        </div>
      </nav>
    </header>
  )
}
