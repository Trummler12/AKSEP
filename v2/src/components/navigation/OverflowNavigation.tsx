import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Link } from 'react-router-dom'
import type { NavChildGroup, NavItem } from '../../types/navigation'
import Icon from '../ui/icon'

interface OverflowNavigationProps {
  overflowItems: NavItem[]
  allItems: NavItem[]
  currentPath: string
  isOverflowing: boolean
  isMobileOpen: boolean
  onToggleMobile: Dispatch<SetStateAction<boolean>>
  onNavigate: () => void
  registerOverflowTrigger: (node: HTMLElement | null) => void
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex="0"], [role="menuitem"], [role="button"], textarea, input, select'

export default function OverflowNavigation({
  overflowItems,
  allItems,
  currentPath,
  isOverflowing,
  isMobileOpen,
  onToggleMobile,
  onNavigate,
  registerOverflowTrigger,
}: OverflowNavigationProps) {
  const [isOverflowOpen, setOverflowOpen] = useState(false)
  const overflowMenuRef = useRef<HTMLDivElement | null>(null)
  const overflowButtonRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [accordionState, setAccordionState] = useState<Record<string, boolean>>({})

  const mobileItems = useMemo(() => allItems, [allItems])

  const closeOverflowMenu = useCallback(() => {
    setOverflowOpen(false)
    overflowButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isOverflowOpen) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (!overflowMenuRef.current?.contains(event.target as Node)) {
        setOverflowOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeOverflowMenu()
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeOverflowMenu, isOverflowOpen])

  useEffect(() => {
    if (overflowItems.length === 0) {
      setOverflowOpen(false)
    }
  }, [overflowItems.length])

  const toggleAccordion = (key: string) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleOverflowNavigate = useCallback(() => {
    setOverflowOpen(false)
    onNavigate()
  }, [onNavigate])

  const getFirstFocusable = () => {
    if (!drawerRef.current) return undefined
    const elements = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
    return elements
  }

  useEffect(() => {
    if (!isMobileOpen) {
      document.body.style.removeProperty('overflow')
      if (previouslyFocused.current) {
        previouslyFocused.current.focus()
      }
      return
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null
    document.body.style.setProperty('overflow', 'hidden')

    const focusables = getFirstFocusable()
    focusables?.[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onToggleMobile(false)
        return
      }
      if (event.key === 'Tab') {
        if (!focusables || focusables.length === 0) {
          event.preventDefault()
          return
        }
        const currentIndex = focusables.indexOf(document.activeElement as HTMLElement)
        let nextIndex = currentIndex + (event.shiftKey ? -1 : 1)
        if (nextIndex < 0) {
          nextIndex = focusables.length - 1
        }
        if (nextIndex >= focusables.length) {
          nextIndex = 0
        }
        focusables[nextIndex].focus()
        event.preventDefault()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        onToggleMobile(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMobileOpen, onToggleMobile])

  const renderGroup = (group: NavChildGroup) => (
    <div
      className={`navigation__overflow-group${group.showTopBorder ? ' navigation__overflow-group--border' : ''}`}
      key={group.key ?? group.label ?? group.items[0]?.href}
    >
      {group.label ? <p className="navigation__overflow-heading">{group.label}</p> : null}
      <ul className="navigation__overflow-list">
        {group.items.map((child) => (
          <li key={child.href}>
            <Link className="navigation__overflow-link" onClick={handleOverflowNavigate} to={child.href}>
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderOverflowMenu = () => {
    if (overflowItems.length === 0) {
      return null
    }
    if (!isOverflowOpen) {
      return null
    }
    return (
      <div className="navigation__overflow-menu" ref={overflowMenuRef} role="menu">
        {overflowItems.map((item) => (
          <div className="navigation__overflow-item" key={item.key ?? item.href ?? item.label}>
            <p className="navigation__overflow-title">{item.label}</p>
            {item.href ? (
              <Link className="navigation__overflow-link" onClick={handleOverflowNavigate} to={item.href}>
                Übersicht
              </Link>
            ) : null}
            {item.groups?.map((group) => renderGroup(group))}
          </div>
        ))}
      </div>
    )
  }

  const renderMobileItem = (item: NavItem) => {
    const key = item.key ?? item.href ?? item.label
    const open = accordionState[key]
    const hasGroups = (item.groups?.length ?? 0) > 0
    if (!hasGroups) {
      return (
        <li className="navigation__mobile-entry" key={key}>
          <Link
            className="navigation__mobile-link"
            data-active={currentPath.startsWith(item.href ?? '') ? 'true' : 'false'}
            onClick={handleOverflowNavigate}
            to={item.href ?? '/.start'}
          >
            {item.label}
          </Link>
        </li>
      )
    }
    const regionId = `${key}-panel`
    return (
      <li className="navigation__mobile-entry" key={key}>
        <button
          aria-controls={regionId}
          aria-expanded={open ? 'true' : 'false'}
          className="navigation__mobile-accordion"
          onClick={() => toggleAccordion(key)}
          type="button"
        >
          <span>{item.label}</span>
          <Icon name={open ? 'ChevronDown' : 'ChevronRight'} size={18} />
        </button>
        <div
          aria-hidden={open ? 'false' : 'true'}
          className="navigation__mobile-panel"
          id={regionId}
          role="region"
        >
          <ul>
            {item.href ? (
              <li>
                <Link className="navigation__mobile-link" onClick={handleOverflowNavigate} to={item.href}>
                  Übersicht
                </Link>
              </li>
            ) : null}
            {item.groups?.map((group) => (
              <li key={group.key ?? group.label ?? group.items[0]?.href}>
                {group.label ? <p className="navigation__mobile-heading">{group.label}</p> : null}
                <ul className="navigation__mobile-sublist">
                  {group.items.map((child) => (
                    <li key={child.href}>
                      <Link className="navigation__mobile-link" onClick={handleOverflowNavigate} to={child.href}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </li>
    )
  }

  return (
    <>
      <button
        aria-expanded={isOverflowOpen ? 'true' : 'false'}
        aria-haspopup="true"
        className="navigation__overflow-trigger"
        data-overflowing={isOverflowing ? 'true' : 'false'}
        data-visible={overflowItems.length > 0 ? 'true' : 'false'}
        disabled={overflowItems.length === 0}
        onClick={() => setOverflowOpen((prev) => !prev)}
        ref={(node) => {
          overflowButtonRef.current = node
          registerOverflowTrigger(node)
        }}
        tabIndex={overflowItems.length > 0 ? 0 : -1}
        type="button"
      >
        <Icon name="MoreHorizontal" size={20} />
        <span className="sr-only">Weitere Navigation</span>
      </button>
      {renderOverflowMenu()}
      <button
        aria-controls="mobile-navigation"
        aria-expanded={isMobileOpen ? 'true' : 'false'}
        className="navigation__mobile-toggle"
        onClick={() => onToggleMobile((prev) => !prev)}
        type="button"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={22} />
        <span className="sr-only">Mobile Navigation</span>
      </button>
      {isMobileOpen ? (
        <div className="navigation__mobile-overlay" ref={overlayRef}>
          <div
            aria-modal="true"
            className="navigation__mobile-drawer"
            id="mobile-navigation"
            ref={drawerRef}
            role="dialog"
          >
            <div className="navigation__mobile-header">
              <p className="navigation__mobile-title">Menü</p>
              <button className="navigation__mobile-close" onClick={() => onToggleMobile(false)} type="button">
                <Icon name="X" size={20} />
                <span className="sr-only">Schließen</span>
              </button>
            </div>
            <nav className="navigation__mobile-content" aria-label="Mobile Navigation">
              <ul>{mobileItems.map((item) => renderMobileItem(item))}</ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  )
}
