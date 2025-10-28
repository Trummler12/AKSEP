import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { NavItem } from '../../types/navigation'
import NavigationItem from './NavigationItem'
import { useOverflowNav } from '../../hooks/useOverflowNav'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet'

interface OverflowNavigationProps {
  items: NavItem[]
  openKey: string | null
  onOpenChange: (key: string | null) => void
  currentPath: string
}

export default function OverflowNavigation({
  items,
  openKey,
  onOpenChange,
  currentPath,
}: OverflowNavigationProps) {
  const { containerRef, registerItem, registerOverflowTrigger, visibleKeys, overflowKeys } =
    useOverflowNav(items)
  const visibleItems = useMemo(
    () => items.filter((item) => visibleKeys.includes(item.key ?? item.label)),
    [items, visibleKeys],
  )
  const overflowItems = useMemo(
    () => items.filter((item) => overflowKeys.includes(item.key ?? item.label)),
    [items, overflowKeys],
  )
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false)
  const overflowTriggerRef = useRef<HTMLButtonElement | null>(null)
  const overflowMenuRef = useRef<HTMLDivElement | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const location = useLocation()

  useEffect(() => {
    setOverflowMenuOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) {
      setExpandedSections(new Set())
    }
  }, [mobileOpen])

  useEffect(() => {
    if (overflowItems.length === 0) {
      setOverflowMenuOpen(false)
    }
  }, [overflowItems.length])

  useEffect(() => {
    if (!overflowMenuOpen) return

    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        overflowMenuRef.current &&
        !overflowMenuRef.current.contains(target) &&
        overflowTriggerRef.current &&
        !overflowTriggerRef.current.contains(target)
      ) {
        setOverflowMenuOpen(false)
      }
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOverflowMenuOpen(false)
        overflowTriggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [overflowMenuOpen])

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <>
      <div className="navigation__desktop" role="menubar" aria-label="Hauptnavigation">
        <ul className="navigation__list" ref={containerRef} role="menubar">
          {visibleItems.map((item) => (
            <NavigationItem
              key={item.key ?? item.label}
              item={item}
              isOpen={openKey === (item.key ?? item.label)}
              onOpenChange={onOpenChange}
              currentPath={currentPath}
              registerItem={registerItem}
            />
          ))}
          {overflowItems.length > 0 ? (
            <li className="navigation__item navigation__item--overflow" role="none">
              <Button
                variant="ghost"
                className={`navigation__overflow-trigger${overflowMenuOpen ? ' navigation__overflow-trigger--open' : ''}`}
                aria-haspopup="menu"
                aria-expanded={overflowMenuOpen}
                aria-controls="navigation-overflow-menu"
                onClick={() => setOverflowMenuOpen((prev) => !prev)}
                ref={(node) => {
                  overflowTriggerRef.current = node
                  registerOverflowTrigger(node)
                }}
              >
                <Icon name="MoreHorizontal" aria-hidden="true" className="navigation__overflow-icon" />
                <span className="sr-only">Weitere Navigation</span>
              </Button>
              <div
                ref={overflowMenuRef}
                id="navigation-overflow-menu"
                role="menu"
                className={`navigation__overflow-menu${overflowMenuOpen ? ' navigation__overflow-menu--open' : ''}`}
              >
                {overflowItems.map((item) => (
                  <div key={item.key ?? item.label} className="navigation__overflow-section">
                    <NavLink
                      to={item.href ?? '#'}
                      className="navigation__overflow-link"
                      role="menuitem"
                      onClick={() => setOverflowMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                    {item.groups && item.groups.length > 0 ? (
                      <ul className="navigation__overflow-sublist" role="none">
                        {item.groups.map((group) => (
                          <li key={group.key ?? `${item.key}-group`} className="navigation__overflow-subsection" role="none">
                            {group.label ? (
                              <p className="navigation__overflow-group-label">{group.label}</p>
                            ) : null}
                            <ul role="none" className="navigation__overflow-items">
                              {group.items.map((child) => (
                                <li key={child.key ?? child.href} role="none">
                                  <NavLink
                                    to={child.href}
                                    className="navigation__overflow-sublink"
                                    role="menuitem"
                                    onClick={() => setOverflowMenuOpen(false)}
                                  >
                                    {child.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="navigation__mobile">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger>
            <Button
              variant="ghost"
              className="navigation__mobile-trigger"
              aria-label="Navigation öffnen"
            >
              <Icon name="Menu" aria-hidden="true" className="navigation__mobile-icon" />
            </Button>
          </SheetTrigger>
          <SheetContent className="navigation__mobile-drawer" labelledBy="mobile-nav-title">
            <div className="navigation__mobile-header">
              <h2 id="mobile-nav-title">Menü</h2>
              <SheetClose>
                <Button variant="ghost" className="navigation__mobile-close" aria-label="Navigation schließen">
                  <Icon name="X" aria-hidden="true" />
                </Button>
              </SheetClose>
            </div>
            <nav className="navigation__mobile-nav" aria-label="Mobile Navigation">
              <ul className="navigation__mobile-list">
                {items.map((item) => {
                  const itemKey = item.key ?? item.label
                  const isExpanded = expandedSections.has(itemKey)
                  const hasChildren = Boolean(item.groups && item.groups.length > 0)
                  return (
                    <li key={itemKey} className="navigation__mobile-item">
                      <div className="navigation__mobile-item-header">
                        <NavLink
                          to={item.href ?? '#'}
                          className="navigation__mobile-link"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                        {hasChildren ? (
                          <button
                            type="button"
                            className="navigation__mobile-accordion"
                            aria-expanded={isExpanded}
                            aria-controls={`mobile-section-${itemKey}`}
                            onClick={() => toggleSection(itemKey)}
                          >
                            <Icon
                              name="ChevronDown"
                              aria-hidden="true"
                              className={`navigation__mobile-accordion-icon${isExpanded ? ' navigation__mobile-accordion-icon--open' : ''}`}
                            />
                            <span className="sr-only">Unterpunkte anzeigen</span>
                          </button>
                        ) : null}
                      </div>
                      {hasChildren ? (
                        <div
                          id={`mobile-section-${itemKey}`}
                          className={`navigation__mobile-panel${isExpanded ? ' navigation__mobile-panel--open' : ''}`}
                        >
                          {item.groups?.map((group) => (
                            <div
                              key={group.key ?? `${itemKey}-group`}
                              className="navigation__mobile-group"
                            >
                              {group.label ? (
                                <p className="navigation__mobile-group-label">{group.label}</p>
                              ) : null}
                              <ul className="navigation__mobile-sublinks">
                                {group.items.map((child) => (
                                  <li key={child.key ?? child.href}>
                                    <NavLink
                                      to={child.href}
                                      className="navigation__mobile-sublink"
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      {child.label}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
