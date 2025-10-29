import { useCallback, useEffect, useRef, useState } from 'react'
import type { NavChildGroup, NavItem } from '../../types/navigation'

interface OverflowNavigationProps {
  overflowItems: NavItem[]
  allItems: NavItem[]
  registerOverflowToggle: (node: HTMLElement | null) => void
  isOverflowing: boolean
  currentPath?: string
  drawerOpen: boolean
  onDrawerToggle: (open: boolean) => void
  onNavigate?: () => void
}

const focusableSelector = 'a[href], button:not([disabled])'

const buildGroups = (item: NavItem): NavChildGroup[] => {
  const baseGroups = item.groups ?? []
  if (item.href) {
    const overviewGroup: NavChildGroup = {
      key: `${item.key ?? item.label}-overview`,
      items: [{ label: item.label, href: item.href, key: `${item.key ?? item.label}-overview-link` }],
    }
    return [overviewGroup, ...baseGroups]
  }
  return baseGroups
}

export default function OverflowNavigation({
  overflowItems,
  allItems,
  registerOverflowToggle,
  isOverflowing,
  currentPath,
  drawerOpen,
  onDrawerToggle,
  onNavigate,
}: OverflowNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const overflowButtonRef = useRef<HTMLButtonElement | null>(null)
  const overflowMenuRef = useRef<HTMLDivElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  useEffect(() => {
    if (!isOverflowing) {
      registerOverflowToggle(null)
      setMenuOpen(false)
    }
  }, [isOverflowing, registerOverflowToggle])

  useEffect(() => {
    if (!menuOpen) {
      return
    }
    const handleClick = (event: MouseEvent) => {
      if (
        overflowMenuRef.current &&
        !overflowMenuRef.current.contains(event.target as Node) &&
        !overflowButtonRef.current?.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [currentPath])

  useEffect(() => {
    setMenuOpen(false)
  }, [overflowItems])

  useEffect(() => {
    if (!drawerOpen) {
      setExpandedAccordions([])
      return
    }

    const previousActive = document.activeElement as HTMLElement | null
    const drawerNode = drawerRef.current
    if (!drawerNode) {
      return
    }

    const focusable = drawerNode.querySelectorAll<HTMLElement>(focusableSelector)
    focusable[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onDrawerToggle(false)
      } else if (event.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActive?.focus()
    }
  }, [drawerOpen, onDrawerToggle])

  const setOverflowButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      overflowButtonRef.current = node
      registerOverflowToggle(node)
    },
    [registerOverflowToggle],
  )

  const toggleAccordion = useCallback((key: string) => {
    setExpandedAccordions((prev) => {
      const exists = prev.includes(key)
      if (exists) {
        return prev.filter((value) => value !== key)
      }
      return [...prev, key]
    })
  }, [])

  const mobileItems = allItems

  return (
    <>
      {isOverflowing ? (
        <div className="site-nav__overflow">
          <button
            type="button"
            ref={setOverflowButtonRef}
            className="site-nav__overflow-trigger"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault()
                setMenuOpen(false)
                overflowButtonRef.current?.focus()
              }
            }}
          >
            <span className="sr-only">Weitere Navigation</span>
            <span aria-hidden className="site-nav__overflow-icon" />
          </button>
          <div
            ref={overflowMenuRef}
            className="site-nav__overflow-menu"
            data-open={menuOpen ? 'true' : 'false'}
            role="menu"
          >
            {overflowItems.map((item) => (
              <div key={item.key ?? item.label} className="site-nav__overflow-section">
                <p className="site-nav__overflow-title">{item.label}</p>
                {buildGroups(item).map((group) => (
                  <ul
                    key={group.key ?? `${item.key ?? item.label}-${group.label ?? 'group'}`}
                    className={`site-nav__overflow-list${group.showTopBorder ? ' site-nav__overflow-list--border' : ''}`}
                  >
                    {group.items.map((child) => (
                      <li key={child.href} className="site-nav__overflow-item">
                        <a
                          href={child.href}
                          className="site-nav__overflow-link"
                          onClick={() => {
                            onNavigate?.()
                            setMenuOpen(false)
                          }}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {drawerOpen ? (
        <div className="site-nav__drawer-wrapper">
          <button
            type="button"
            className="site-nav__drawer-backdrop"
            aria-label="Navigation schließen"
            onClick={() => onDrawerToggle(false)}
          />
          <aside
            id="mobile-navigation-drawer"
            className="site-nav__drawer"
            role="dialog"
            aria-modal="true"
            ref={drawerRef}
          >
            <div className="site-nav__drawer-header">
              <span className="site-nav__drawer-title">Menü</span>
              <button
                type="button"
                className="site-nav__drawer-close"
                onClick={() => onDrawerToggle(false)}
              >
                <span className="sr-only">Schließen</span>
                <span aria-hidden className="site-nav__drawer-close-icon" />
              </button>
            </div>
            <div className="site-nav__drawer-content">
              {mobileItems.map((item) => {
                const itemKey = item.key ?? item.label
                const groups = buildGroups(item)
                const expanded = expandedAccordions.includes(itemKey)
                return (
                  <div key={itemKey} className="site-nav__drawer-section">
                    <button
                      type="button"
                      className="site-nav__drawer-trigger"
                      aria-expanded={expanded}
                      onClick={() => toggleAccordion(itemKey)}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden className="site-nav__drawer-caret" data-open={expanded ? 'true' : 'false'} />
                    </button>
                    <div
                      className="site-nav__drawer-panel"
                      data-open={expanded ? 'true' : 'false'}
                      role="region"
                      aria-label={`Untermenü ${item.label}`}
                    >
                      {groups.map((group) => (
                        <ul
                          key={group.key ?? `${itemKey}-${group.label ?? 'group'}`}
                          className={`site-nav__drawer-list${group.showTopBorder ? ' site-nav__drawer-list--border' : ''}`}
                        >
                          {group.items.map((child) => (
                            <li key={child.href} className="site-nav__drawer-item">
                              <a
                                href={child.href}
                                className="site-nav__drawer-link"
                                onClick={() => {
                                  onNavigate?.()
                                  onDrawerToggle(false)
                                }}
                                aria-current={currentPath === child.href ? 'page' : undefined}
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
