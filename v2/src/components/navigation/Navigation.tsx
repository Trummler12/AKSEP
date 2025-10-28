import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPrimaryNavItems, navigationItems } from '../../data/navigation'
import type { NavItem } from '../../types/navigation'
import useOverflowNav from '../../hooks/useOverflowNav'
import NavigationItem from './NavigationItem'
import OverflowNavigation from './OverflowNavigation'
import Tooltip from '../ui/tooltip'
import logo from '../../assets/Logo_AKSEP.png'
import '../../styles/components/navigation.css'

interface NavigationProps {
  currentPath: string
}

const getItemKey = (item: NavItem) => item.key ?? item.href ?? item.label

export function Navigation({ currentPath }: NavigationProps) {
  const navRef = useRef<HTMLElement | null>(null)
  const triggerRefs = useRef(new Map<string, HTMLElement>())
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const primaryItems = useMemo(() => getPrimaryNavItems(), [])

  const overflowConfig = useMemo(
    () =>
      primaryItems.map((item) => ({
        key: getItemKey(item),
        pinned: item.cta || item.align === 'right',
      })),
    [primaryItems],
  )

  const {
    containerRef,
    registerItem,
    registerOverflowTrigger,
    visibleKeys,
    overflowKeys,
    isOverflowing,
  } = useOverflowNav(overflowConfig)

  const visibleItems = primaryItems.filter((item) => visibleKeys.includes(getItemKey(item)))
  const overflowItems = primaryItems.filter((item) => overflowKeys.includes(getItemKey(item)))

  const visibleOrder = visibleItems.map((item) => getItemKey(item))

  const closeMenus = () => {
    setOpenKey(null)
  }

  useEffect(() => {
    if (openKey && !visibleKeys.includes(openKey)) {
      setOpenKey(null)
    }
  }, [openKey, visibleKeys])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        closeMenus()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenus()
        setMobileOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const registerTrigger = (key: string) => (node: HTMLElement | null) => {
    if (!node) {
      triggerRefs.current.delete(key)
    } else {
      triggerRefs.current.set(key, node)
    }
  }

  const focusSibling = (direction: 1 | -1, currentKey: string) => {
    const index = visibleOrder.indexOf(currentKey)
    if (index === -1) {
      return
    }
    const nextIndex = (index + direction + visibleOrder.length) % visibleOrder.length
    const nextKey = visibleOrder[nextIndex]
    const nextNode = triggerRefs.current.get(nextKey)
    nextNode?.focus()
  }

  const handleNavigate = () => {
    closeMenus()
    setMobileOpen(false)
  }

  return (
    <nav
      aria-label="Hauptnavigation"
      className="navigation"
      ref={(node) => {
        navRef.current = node
      }}
    >
      <div className="navigation__inner" ref={containerRef}>
        <div className="navigation__brand">
          <Tooltip content="Zur Startseite">
            <Link className="navigation__brand-link" to="/.start">
              <img alt="Logo der AKSEP" className="navigation__logo" src={logo} />
              <span className="navigation__brand-text">DIE AKSEP</span>
            </Link>
          </Tooltip>
        </div>
        <ul className="navigation__list" role="menubar">
          {visibleItems.map((item) => {
            const key = getItemKey(item)
            return (
              <NavigationItem
                isActive={currentPath.startsWith(item.href ?? '')}
                isOpen={openKey === key}
                item={item}
                itemKey={key}
                key={key}
                onClose={() => setOpenKey(null)}
                onFocusNext={() => focusSibling(1, key)}
                onFocusPrev={() => focusSibling(-1, key)}
                onNavigate={handleNavigate}
                onOpen={(nextKey) => setOpenKey(nextKey)}
                registerItem={registerItem(key)}
                registerTrigger={registerTrigger(key)}
              />
            )
          })}
        </ul>
        <div className="navigation__actions">
          <OverflowNavigation
            allItems={navigationItems}
            currentPath={currentPath}
            isMobileOpen={mobileOpen}
            isOverflowing={isOverflowing}
            onNavigate={handleNavigate}
            onToggleMobile={setMobileOpen}
            overflowItems={overflowItems}
            registerOverflowTrigger={registerOverflowTrigger}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navigation
