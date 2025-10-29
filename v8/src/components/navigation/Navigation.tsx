import { useCallback, useEffect, useMemo, useState } from 'react'
import type { NavItem } from '../../types/navigation'
import { getPrimaryNavItems, navigationItems } from '../../data/navigation'
import Tooltip from '../ui/tooltip'
import NavigationItem from './NavigationItem'
import OverflowNavigation from './OverflowNavigation'
import useOverflowNav from '../../hooks/useOverflowNav'
import '../../styles/components/navigation.css'

interface NavigationProps {
  currentPath?: string
}

const getItemKey = (item: NavItem) => item.key ?? item.label

export default function Navigation({ currentPath }: NavigationProps) {
  const primaryItems = useMemo(() => getPrimaryNavItems(), [])
  type NavItemWithKey = NavItem & { key: string }
  const keyedPrimaryItems = useMemo<NavItemWithKey[]>(
    () => primaryItems.map((item) => ({ ...item, key: getItemKey(item) })),
    [primaryItems],
  )
  const pinnedKeys = useMemo(
    () => keyedPrimaryItems.filter((item) => item.cta).map((item) => item.key),
    [keyedPrimaryItems],
  )

  const overflowNav = useOverflowNav<NavItemWithKey>({ items: keyedPrimaryItems, pinnedKeys })
  const { visibleItems, overflowItems, registerContainer, registerItem, registerOverflowToggle, isOverflowing } = overflowNav

  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [currentPath])

  useEffect(() => {
    if (!drawerOpen) {
      return
    }
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [drawerOpen])

  const handleNavigate = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <nav className="site-nav" aria-label="Hauptnavigation">
      <div className="site-nav__inner">
        <Tooltip content="Zur Startseite">
          <a href="/.start" className="site-nav__brand" aria-label="Zur Startseite">
            <span className="site-nav__logo-mark" aria-hidden />
            <span className="site-nav__brand-text">DIE AKSEP</span>
          </a>
        </Tooltip>
        <div className="site-nav__primary" ref={registerContainer} data-overflowing={isOverflowing ? 'true' : 'false'}>
          <ul className="site-nav__list" role="menubar" aria-label="Hauptnavigation">
            {visibleItems.map((item) => (
              <NavigationItem
                key={item.key}
                item={item}
                currentPath={currentPath}
                registerItem={registerItem(item.key)}
              />
            ))}
          </ul>
          <OverflowNavigation
            overflowItems={overflowItems}
            allItems={navigationItems}
            registerOverflowToggle={registerOverflowToggle}
            isOverflowing={isOverflowing}
            currentPath={currentPath}
            drawerOpen={drawerOpen}
            onDrawerToggle={setDrawerOpen}
            onNavigate={handleNavigate}
          />
        </div>
        <button
          type="button"
          className="site-nav__mobile-toggle"
          aria-expanded={drawerOpen}
          aria-controls="mobile-navigation-drawer"
          onClick={() => setDrawerOpen((prev) => !prev)}
        >
          <span className="sr-only">{drawerOpen ? 'Menü schließen' : 'Menü öffnen'}</span>
          <span aria-hidden className="site-nav__mobile-icon" />
        </button>
      </div>
    </nav>
  )
}
