import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode
} from 'react'
import { Link } from 'react-router-dom'

import type { NavItem } from '../../types/navigation'
import useOverflowNav from '../../hooks/useOverflowNav'
import Icon from '../ui/icon'
import Sheet, { SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

interface RenderItemProps {
  isOpen: boolean
  onOpen: (key: string) => void
  onClose: (key?: string) => void
  registerItem: (node: HTMLLIElement | null) => void
}

interface OverflowNavigationProps {
  items: NavItem[]
  openKey: string | null
  onOpen: (key: string) => void
  onClose: (key?: string) => void
  renderItem: (item: NavItem, props: RenderItemProps) => ReactNode
  activePath: string
}

const OverflowNavigation = ({ items, openKey, onOpen, onClose, renderItem, activePath }: OverflowNavigationProps) => {
  const overflowData = useOverflowNav({
    items: items.map((item) => ({ key: item.key ?? item.label, isPinned: item.align === 'right' || item.cta }))
  })

  const { containerRef, overflowTriggerRef, getItemRef, visibleKeys, overflowKeys } = overflowData

  const visibleItems = useMemo(
    () => items.filter((item) => visibleKeys.includes(item.key ?? item.label)),
    [items, visibleKeys]
  )
  const overflowItems = useMemo(
    () => items.filter((item) => overflowKeys.includes(item.key ?? item.label)),
    [items, overflowKeys]
  )

  const [overflowOpen, setOverflowOpen] = useState(false)
  const overflowMenuRef = useRef<HTMLDivElement | null>(null)
  const overflowLinksRef = useRef<HTMLAnchorElement[]>([])

  const [mobileSections, setMobileSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setOverflowOpen(false)
  }, [overflowKeys])

  useEffect(() => {
    if (!overflowOpen) {
      return
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !overflowMenuRef.current?.contains(target) &&
        !overflowTriggerRef.current?.contains(target as Node)
      ) {
        setOverflowOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => document.removeEventListener('mousedown', handleClick)
  }, [overflowOpen, overflowTriggerRef])

  useEffect(() => {
    const activeKey = items.find((item) => activePath.startsWith(item.href ?? ''))?.key
    if (activeKey) {
      setMobileSections((state) => ({ ...state, [activeKey]: true }))
    }
  }, [activePath, items])

  const overflowEntries = useMemo(() => {
    const entries: { id: string; label: string; href: string }[] = []
    overflowItems.forEach((item) => {
      if (item.href) {
        entries.push({ id: item.key ?? item.label, label: item.label, href: item.href })
      }

      item.groups?.forEach((group) => {
        group.items.forEach((child) => {
          entries.push({ id: `${item.key ?? item.label}-${child.href}`, label: child.label, href: child.href })
        })
      })
    })

    return entries
  }, [overflowItems])

  const overflowIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    overflowEntries.forEach((entry, index) => {
      map.set(entry.id, index)
    })
    return map
  }, [overflowEntries])

  const registerOverflowLink = (index: number | null) => (node: HTMLAnchorElement | null) => {
    if (index === null || index < 0) {
      return
    }

    if (!node) {
      overflowLinksRef.current.splice(index, 1)
      return
    }

    overflowLinksRef.current[index] = node
  }

  useEffect(() => {
    overflowLinksRef.current = []
  }, [overflowEntries])

  const focusOverflowLink = (index: number) => {
    overflowLinksRef.current[index]?.focus()
  }

  const handleOverflowKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOverflowOpen(true)
      if (overflowEntries.length > 0) {
        focusOverflowLink(0)
      }
    }
  }

  const handleOverflowItemKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number | null) => {
    if (index === null || index < 0) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const nextIndex = (index + 1) % overflowEntries.length
        focusOverflowLink(nextIndex)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const prevIndex = (index - 1 + overflowEntries.length) % overflowEntries.length
        focusOverflowLink(prevIndex)
        break
      }
      case 'Escape':
        event.preventDefault()
        setOverflowOpen(false)
        overflowTriggerRef.current?.focus()
        break
      default:
        break
    }
  }

  return (
    <>
      <div className="navigation__menus">
        <ul
          className="navigation__list"
          ref={containerRef as MutableRefObject<HTMLUListElement | null>}
          role="menubar"
        >
          {visibleItems.map((item) =>
            renderItem(item, {
              isOpen: openKey === (item.key ?? item.label),
              onOpen,
              onClose,
              registerItem: getItemRef(item.key ?? item.label)
            })
          )}
        </ul>

        <div className="navigation__overflow" data-visible={overflowItems.length > 0 ? 'true' : 'false'}>
          <button
            type="button"
            className="navigation__overflow-trigger"
            onClick={() => setOverflowOpen((state) => !state)}
            aria-expanded={overflowOpen}
            aria-haspopup="true"
            ref={overflowTriggerRef}
            onKeyDown={handleOverflowKeyDown}
          >
            <Icon name="Dots" />
            <span className="sr-only">Weitere Navigation</span>
          </button>
          {overflowOpen && overflowItems.length > 0 ? (
            <div className="navigation__overflow-menu" role="menu" ref={overflowMenuRef}>
              {overflowItems.map((item) => (
                <div key={item.key ?? item.label} className="navigation__overflow-section">
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="navigation__overflow-link"
                      role="menuitem"
                      ref={registerOverflowLink(overflowIndexMap.get(item.key ?? item.label) ?? null)}
                      onKeyDown={(event) =>
                        handleOverflowItemKeyDown(
                          event,
                          overflowIndexMap.get(item.key ?? item.label) ?? null
                        )
                      }
                      onClick={() => setOverflowOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="navigation__overflow-label">{item.label}</span>
                  )}
                  {item.groups?.map((group) => (
                    <div key={group.key ?? `${item.key}-${group.label ?? 'group'}`} className="navigation__overflow-group">
                      {group.label ? <p className="navigation__overflow-group-label">{group.label}</p> : null}
                      <ul className="navigation__overflow-group-list">
                        {group.items.map((child) => {
                          const entryIndex = overflowIndexMap.get(
                            `${item.key ?? item.label}-${child.href}`
                          ) ?? null

                          return (
                            <li key={child.href} role="none">
                              <Link
                                to={child.href}
                                role="menuitem"
                                className="navigation__overflow-sublink"
                                ref={registerOverflowLink(entryIndex)}
                                onKeyDown={(event) => handleOverflowItemKeyDown(event, entryIndex)}
                                onClick={() => setOverflowOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="navigation__mobile">
        <Sheet>
          <SheetTrigger>
            <button type="button" className="navigation__mobile-trigger" aria-label="Menü öffnen">
              <Icon name="Menu" />
            </button>
          </SheetTrigger>
          <SheetContent className="navigation__mobile-sheet">
            <SheetHeader>
              <SheetTitle>Menü</SheetTitle>
              <SheetClose>
                <button type="button" className="navigation__mobile-close" aria-label="Menü schließen">
                  <Icon name="Close" />
                </button>
              </SheetClose>
            </SheetHeader>
            <nav className="navigation__mobile-nav" aria-label="Mobile Navigation">
              {items.map((item) => {
                const key = item.key ?? item.label
                const expanded = mobileSections[key] ?? activePath.startsWith(item.href ?? '')

                const toggleSection = () => {
                  setMobileSections((state) => ({ ...state, [key]: !expanded }))
                }

                return (
                  <div key={key} className="navigation__mobile-section">
                    <button
                      type="button"
                      className="navigation__mobile-section-trigger"
                      aria-expanded={expanded}
                      onClick={toggleSection}
                    >
                      <span>{item.label}</span>
                      <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} />
                    </button>
                    <div className="navigation__mobile-panel" data-open={expanded ? 'true' : 'false'}>
                      {item.href ? (
                        <SheetClose>
                          <Link to={item.href} className="navigation__mobile-link">
                            Übersicht: {item.label}
                          </Link>
                        </SheetClose>
                      ) : null}
                      {item.groups?.map((group) => (
                        <div key={group.key ?? `${key}-${group.label ?? 'group'}`} className="navigation__mobile-group">
                          {group.label ? <p className="navigation__mobile-group-label">{group.label}</p> : null}
                          <ul className="navigation__mobile-list">
                            {group.items.map((child) => (
                              <li key={child.href} className="navigation__mobile-list-item">
                                <SheetClose>
                                  <Link to={child.href} className="navigation__mobile-sublink">
                                    {child.label}
                                  </Link>
                                </SheetClose>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default OverflowNavigation
