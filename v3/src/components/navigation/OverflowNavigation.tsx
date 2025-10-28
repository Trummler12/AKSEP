import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { NavItem } from '../../types/navigation'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import Icon from '../ui/icon'
import { cn } from '../ui/utils'

interface OverflowNavigationProps {
  items: NavItem[]
  overflowKeys: string[]
  registerOverflowTrigger: (node: HTMLElement | null) => void
  onNavigate: () => void
  currentPath: string
}

export function OverflowNavigation({ items, overflowKeys, registerOverflowTrigger, onNavigate, currentPath }: OverflowNavigationProps) {
  const overflowItems = useMemo(
    () => items.filter((item) => item.key && overflowKeys.includes(item.key)),
    [items, overflowKeys],
  )
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!desktopOpen) return
    const handlePointerDown = (event: MouseEvent | globalThis.MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return
      }
      setDesktopOpen(false)
    }
    window.addEventListener('pointerdown', handlePointerDown, true)
    return () => window.removeEventListener('pointerdown', handlePointerDown, true)
  }, [desktopOpen])

  useEffect(() => {
    setMobileOpen(false)
    setDesktopOpen(false)
  }, [location.pathname])

  const handleDesktopToggle = () => {
    setDesktopOpen((prev) => !prev)
  }

  const handleDesktopKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setDesktopOpen(true)
      requestAnimationFrame(() => {
        const first = menuRef.current?.querySelector<HTMLElement>('[data-overflow-item="true"]')
        first?.focus()
      })
    } else if (event.key === 'Escape') {
      setDesktopOpen(false)
    }
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setDesktopOpen(false)
      triggerRef.current?.focus()
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[data-overflow-item="true"]') ?? [])
      if (nodes.length === 0) return
      const currentIndex = nodes.findIndex((node) => node === document.activeElement)
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + delta + nodes.length) % nodes.length
      nodes[nextIndex]?.focus()
    }
  }

  const handleNavigate = useCallback(
    (href: string, external?: boolean) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (external) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        setDesktopOpen(false)
        setMobileOpen(false)
        return
      }
      event.preventDefault()
      setDesktopOpen(false)
      setMobileOpen(false)
      onNavigate()
      navigate(href)
    },
    [navigate, onNavigate],
  )

  const toggleAccordion = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const renderDesktopMenu = () => (
    <div
      ref={menuRef}
      className={cn('navigation__overflow-menu', desktopOpen && 'is-open')}
      role="menu"
      aria-label="Weitere Navigation"
      data-open={desktopOpen ? 'true' : 'false'}
      hidden={!desktopOpen}
      onKeyDown={handleMenuKeyDown}
    >
      {overflowItems.map((item) => (
        <div key={item.key} className="navigation__overflow-group">
          <Link
            to={item.href ?? '#'}
            data-overflow-item="true"
            role="menuitem"
            className={cn('navigation__overflow-link', currentPath === item.href && 'is-active')}
            onClick={handleNavigate(item.href ?? '#', item.href?.startsWith('http'))}
            tabIndex={desktopOpen ? 0 : -1}
          >
            {item.label}
          </Link>
          {item.groups ? (
            <ul className="navigation__overflow-sublist">
              {item.groups.map((group) => (
                <li key={group.key ?? `${item.key}-${group.label ?? 'gruppe'}`}> 
                  {group.label ? <p className="navigation__overflow-subheading">{group.label}</p> : null}
                  <ul className="navigation__overflow-subitems">
                    {group.items.map((child) => {
                      const isActive = currentPath === child.href
                      return (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            data-overflow-item="true"
                            role="menuitem"
                            tabIndex={desktopOpen ? 0 : -1}
                            className={cn('navigation__overflow-sublink', isActive && 'is-active')}
                            onClick={handleNavigate(child.href, child.href.startsWith('http'))}
                          >
                            {child.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  )

  const renderMobileContent = () => (
    <div className="navigation__mobile-drawer" role="menu">
      <nav aria-label="Mobile Navigation" className="navigation__mobile-nav">
        {items.map((item) => {
          const key = item.key ?? item.label
          const expanded = expandedItems.has(key)
          const sectionId = `mobile-section-${key}`
          return (
            <div key={key} className="navigation__mobile-section">
              <button
                type="button"
                className="navigation__mobile-trigger"
                aria-expanded={expanded}
                aria-controls={sectionId}
                onClick={() => toggleAccordion(key)}
              >
                <span>{item.label}</span>
                <Icon name="ArrowRight" className={cn('navigation__mobile-trigger-icon', expanded && 'is-expanded')} />
              </button>
              <div
                id={sectionId}
                className="navigation__mobile-panel"
                role="group"
                hidden={!expanded}
              >
                <Link
                  to={item.href ?? '#'}
                  className={cn('navigation__mobile-link', currentPath === item.href && 'is-active')}
                  onClick={(event) => {
                    if (item.href?.startsWith('http')) return
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                      setMobileOpen(false)
                      return
                    }
                    event.preventDefault()
                    setMobileOpen(false)
                    onNavigate()
                    navigate(item.href ?? '#')
                  }}
                >
                  {item.label}
                </Link>
                {item.groups ? (
                  <ul className="navigation__mobile-subitems">
                    {item.groups.map((group) => (
                      <li key={group.key ?? `${key}-${group.label ?? 'gruppe'}`}
                        className={cn('navigation__mobile-subgroup', group.showTopBorder && 'has-border')}
                      >
                        {group.label ? <p className="navigation__mobile-subheading">{group.label}</p> : null}
                        <ul>
                          {group.items.map((child) => {
                            const isActive = currentPath === child.href
                            return (
                              <li key={child.href}>
                                <Link
                                  to={child.href}
                                  className={cn('navigation__mobile-sublink', isActive && 'is-active')}
                                  onClick={handleNavigate(child.href, child.href.startsWith('http'))}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="navigation__overflow" aria-hidden={overflowItems.length === 0 ? 'true' : 'false'}>
      <button
        ref={(node) => {
          triggerRef.current = node
          registerOverflowTrigger(node)
        }}
        type="button"
        className="navigation__overflow-trigger"
        aria-haspopup="menu"
        aria-expanded={desktopOpen}
        aria-label="Weitere Navigation"
        onClick={handleDesktopToggle}
        onKeyDown={handleDesktopKeyDown}
        disabled={overflowItems.length === 0}
      >
        <span className="visually-hidden">Weitere Navigation</span>
        <Icon name="Ellipsis" aria-hidden="true" decorative className="navigation__overflow-icon" />
      </button>
      {renderDesktopMenu()}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <div className="navigation__mobile-toggle">
          <SheetTrigger aria-label={mobileOpen ? 'Navigation schliessen' : 'Navigation öffnen'} asChild>
            <Button variant="ghost" className={cn('navigation__mobile-button', mobileOpen && 'is-open')} type="button">
              <span className="visually-hidden">Mobilmenü</span>
              <span aria-hidden="true" className="navigation__mobile-icon" />
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent className="navigation__mobile-sheet" position="right">
          <div className="navigation__mobile-header">
            <Button
              variant="ghost"
              className="navigation__mobile-close"
              type="button"
              onClick={() => setMobileOpen(false)}
            >
              Schliessen
            </Button>
          </div>
          {renderMobileContent()}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default OverflowNavigation
