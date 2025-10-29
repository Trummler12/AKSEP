import { useEffect, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { NavItem } from '../../types/navigation'
import '../../styles/components/navigation.css'

interface NavigationItemProps {
  item: NavItem
  isOpen: boolean
  onOpenChange: (key: string, open: boolean) => void
  onMeasure: (key: string, width: number) => void
  onRequestCloseAll: () => void
}

export default function NavigationItem({ item, isOpen, onOpenChange, onMeasure, onRequestCloseAll }: NavigationItemProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const itemRef = useRef<HTMLLIElement | null>(null)
  const menuRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const closeTimer = useRef<number | null>(null)
  const location = useLocation()

  const menuId = useMemo(() => `nav-menu-${item.key}`, [item.key])
  const hasMenu = Boolean(item.groups?.length)
  const isCurrent = hasMenu
    ? item.groups?.some((group) => group.items.some((child) => child.href === location.pathname))
    : item.href === location.pathname

  useEffect(() => {
    if (!itemRef.current) return
    const measure = () => {
      const width = itemRef.current?.getBoundingClientRect().width ?? 0
      onMeasure(item.key ?? item.label, width)
    }
    measure()
    const observer = new ResizeObserver(() => measure())
    observer.observe(itemRef.current)
    return () => observer.disconnect()
  }, [item.key, item.label, onMeasure])

  useEffect(() => {
    if (!isOpen) return

    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (!itemRef.current?.contains(target)) {
        onOpenChange(item.key ?? item.label, false)
      }
    }

    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [isOpen, item.key, item.label, onOpenChange])

  const focusFirstChild = () => {
    window.setTimeout(() => {
      menuRefs.current[0]?.focus()
    }, 0)
  }

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!hasMenu) return
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenChange(item.key ?? item.label, true)
      focusFirstChild()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onOpenChange(item.key ?? item.label, false)
      triggerRef.current?.focus()
    }
  }

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onOpenChange(item.key ?? item.label, false)
      triggerRef.current?.focus()
      return
    }
    if (menuRefs.current.length === 0) {
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = menuRefs.current[(index + 1) % menuRefs.current.length]
      next?.focus()
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prev = menuRefs.current[(index - 1 + menuRefs.current.length) % menuRefs.current.length]
      prev?.focus()
    }
  }

  const open = (value: boolean) => {
    if (!hasMenu) return
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    onOpenChange(item.key ?? item.label, value)
    if (!value) {
      triggerRef.current?.focus()
    }
  }

  const handleMouseEnter = () => {
    if (!hasMenu) return
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    open(true)
  }

  const handleMouseLeave = () => {
    if (!hasMenu) return
    closeTimer.current = window.setTimeout(() => {
      open(false)
      closeTimer.current = null
    }, 80)
  }

  menuRefs.current = []
  let menuIndex = -1

  const menuContent = hasMenu ? (
    <div
      className="nav__dropdown"
      role="menu"
      id={menuId}
      aria-label={`${item.label} Menü`}
      data-open={isOpen || undefined}
      onMouseEnter={() => {
        if (closeTimer.current !== null) {
          window.clearTimeout(closeTimer.current)
          closeTimer.current = null
        }
      }}
      onMouseLeave={handleMouseLeave}
    >
      {item.groups?.map((group) => (
        <div key={group.key ?? group.label ?? 'group'} className="nav__dropdown-group">
          {group.label && <p className="nav__dropdown-title">{group.label}</p>}
          <ul className="nav__dropdown-list">
            {group.items.map((child) => {
              menuIndex += 1
              const currentIndex = menuIndex
              return (
                <li key={child.href} className="nav__dropdown-item">
                  <Link
                    ref={(node) => {
                      menuRefs.current[currentIndex] = node
                    }}
                    to={child.href}
                    role="menuitem"
                    onKeyDown={(event) => handleMenuKeyDown(event, currentIndex)}
                    onClick={() => {
                      onRequestCloseAll()
                      onOpenChange(item.key ?? item.label, false)
                    }}
                    className="nav__dropdown-link"
                  >
                    {child.label}
                  </Link>
                </li>
              )})}
          </ul>
        </div>
      ))}
    </div>
  ) : null

  return (
    <li
      className="nav__item"
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-active={isCurrent || undefined}
    >
      {hasMenu ? (
        <button
          ref={triggerRef}
          className="nav__trigger"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => open(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
        >
          <span>{item.label}</span>
          <span aria-hidden="true" className="nav__caret">▾</span>
        </button>
      ) : (
        <Link
          to={item.href ?? '#'}
          className="nav__link"
          onClick={() => onRequestCloseAll()}
          data-active={isCurrent || undefined}
        >
          {item.label}
        </Link>
      )}
      {menuContent}
    </li>
  )
}
