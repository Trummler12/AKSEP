import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NavItem } from '../../types/navigation'
import Sheet from '../ui/sheet'
import Icon from '../ui/icon'

interface OverflowNavigationProps {
  overflowItems: NavItem[]
  allItems: NavItem[]
  onNavigate: () => void
  onOverflowButtonMeasure: (width: number) => void
}

export default function OverflowNavigation({
  overflowItems,
  allItems,
  onNavigate,
  onOverflowButtonMeasure,
}: OverflowNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!triggerRef.current) return
    const measure = () => {
      const width = triggerRef.current?.getBoundingClientRect().width ?? 0
      onOverflowButtonMeasure(width)
    }
    measure()
    const observer = new ResizeObserver(() => measure())
    observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [onOverflowButtonMeasure])

  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.parentElement?.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [menuOpen])

  const mobileSections = useMemo(() => allItems.filter((item) => item.displayInPrimary !== false), [allItems])

  return (
    <div className="nav__overflow">
      <button
        className="nav__mobile-toggle"
        aria-label={mobileOpen ? 'Navigation schließen' : 'Navigation öffnen'}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span className="nav__hamburger" aria-hidden="true" />
      </button>
      <Sheet
        open={mobileOpen}
        onOpenChange={(open) => {
          setMobileOpen(open)
          if (!open) {
            onNavigate()
          }
        }}
        ariaLabel="Mobile Navigation"
      >
        <nav className="nav__mobile" aria-label="Mobile Navigation">
          <ul className="nav__mobile-list">
            {mobileSections.map((item) => (
              <li key={item.key ?? item.label} className="nav__mobile-item">
                {item.groups ? (
                  <details>
                    <summary>{item.label}</summary>
                    <ul>
                      {item.groups.map((group) => (
                        <li key={group.key ?? group.label ?? 'group'}>
                          <p className="nav__mobile-group-title">{group.label}</p>
                          <ul>
                            {group.items.map((child) => (
                              <li key={child.href}>
                                <Link
                                  to={child.href}
                                  onClick={() => {
                                    setMobileOpen(false)
                                    onNavigate()
                                  }}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    to={item.href ?? '#'}
                    onClick={() => {
                      setMobileOpen(false)
                      onNavigate()
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </Sheet>

      {overflowItems.length > 0 && (
        <div className="nav__overflow-desktop">
          <button
            ref={triggerRef}
            className="nav__trigger nav__trigger--overflow"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setMenuOpen(false)
                triggerRef.current?.focus()
              }
            }}
          >
            <Icon name="MoreHorizontal" size={20} className="nav__overflow-icon" />
            <span className="visually-hidden">Weitere Navigation</span>
          </button>
          {menuOpen && (
            <div className="nav__dropdown nav__dropdown--overflow" role="menu">
              <ul className="nav__dropdown-list">
                {overflowItems.map((item) => (
                  <li key={item.key ?? item.label} className="nav__dropdown-item">
                    {item.groups ? (
                      <div className="nav__dropdown-group">
                        <p className="nav__dropdown-title">{item.label}</p>
                        <ul>
                          {item.groups.map((group) => (
                            <li key={group.key ?? group.label ?? 'group'}>
                              <ul className="nav__dropdown-list">
                                {group.items.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      to={child.href}
                                      className="nav__dropdown-link"
                                      onClick={() => {
                                        setMenuOpen(false)
                                        onNavigate()
                                      }}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link
                        to={item.href ?? '#'}
                        className="nav__dropdown-link"
                        onClick={() => {
                          setMenuOpen(false)
                          onNavigate()
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
