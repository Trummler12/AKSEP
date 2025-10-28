import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { NavChild, NavItem } from '../../types/navigation'
import { cn } from '../ui/utils'

interface NavigationItemProps {
  item: NavItem
  isActive: boolean
  registerItem: (node: HTMLElement | null) => void
  onRequestCloseAll: (nextKey: string | null) => void
  currentPath: string
  activeDropdownKey: string | null
}

const CLOSE_DELAY = 150

const getChildKey = (child: NavChild, index: number) => child.key ?? `${child.href}-${index}`

export function NavigationItem({
  item,
  isActive,
  registerItem,
  onRequestCloseAll,
  currentPath,
  activeDropdownKey,
}: NavigationItemProps) {
  const navigate = useNavigate()
  const rootRef = useRef<HTMLLIElement | null>(null)
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const closeTimeout = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const itemKey = item.key ?? item.label

  const hasDropdown = (item.groups?.length ?? 0) > 0

  const isCurrent = useMemo(() => {
    if (currentPath === item.href) return true
    if (!item.groups) return false
    return item.groups.some((group) => group.items.some((child) => child.href === currentPath))
  }, [currentPath, item.href, item.groups])

  const clearCloseTimer = () => {
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  const closeMenu = useCallback(
    (focusTrigger = false) => {
      clearCloseTimer()
      setOpen(false)
      if (activeDropdownKey === itemKey) {
        onRequestCloseAll(null)
      }
      if (focusTrigger) {
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    },
    [activeDropdownKey, itemKey, onRequestCloseAll],
  )

  const openMenu = useCallback(() => {
    clearCloseTimer()
    if (!hasDropdown) return
    onRequestCloseAll(itemKey)
    setOpen(true)
  }, [hasDropdown, itemKey, onRequestCloseAll])

  const scheduleClose = useCallback(() => {
    if (!hasDropdown) return
    clearCloseTimer()
    closeTimeout.current = window.setTimeout(() => closeMenu(), CLOSE_DELAY)
  }, [closeMenu, hasDropdown])

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      const target = event.target as Node | null
      if (target && rootRef.current && !rootRef.current.contains(target)) {
        closeMenu()
      }
    }
    window.addEventListener('pointerdown', handleClickOutside, true)
    return () => window.removeEventListener('pointerdown', handleClickOutside, true)
  }, [closeMenu, open])

  useEffect(() => {
    if (!open) return
    if (activeDropdownKey && activeDropdownKey !== itemKey) {
      setOpen(false)
    }
  }, [activeDropdownKey, itemKey, open])

  const focusMenuItem = (index: number) => {
    if (!menuRef.current) return
    const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('[data-nav-subitem="true"]'))
    if (items.length === 0) return
    const nextIndex = (index + items.length) % items.length
    const node = items[nextIndex]
    node.focus()
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (!hasDropdown) return
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openMenu()
      requestAnimationFrame(() => focusMenuItem(0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu()
      requestAnimationFrame(() => focusMenuItem(-1))
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(true)
    } else if (event.key === 'Tab') {
      closeMenu()
    }
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(true)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[data-nav-subitem="true"]') ?? [])
      if (items.length === 0) return
      const currentIndex = items.findIndex((node) => node === document.activeElement)
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = currentIndex === -1 ? 0 : currentIndex + delta
      focusMenuItem(nextIndex)
    }
  }

  const handleMenuFocusOut = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current) return
    if (!rootRef.current.contains(event.relatedTarget)) {
      closeMenu()
    }
  }

  const handleTriggerClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (hasDropdown && event.defaultPrevented) return
    if (hasDropdown && event.button === 0 && (event.metaKey || event.ctrlKey)) {
      return
    }
    if (!hasDropdown) {
      onRequestCloseAll(null)
      return
    }
    if (open) {
      event.preventDefault()
      closeMenu()
    } else {
      event.preventDefault()
      openMenu()
    }
  }

  const handleNavigate = useCallback(
    (href: string, external?: boolean) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (external) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        closeMenu()
        onRequestCloseAll(null)
        return
      }
      event.preventDefault()
      closeMenu()
      onRequestCloseAll(null)
      navigate(href)
    },
    [closeMenu, navigate, onRequestCloseAll],
  )

  const handleRootMouseEnter = () => {
    if (window.matchMedia('(pointer:fine)').matches) {
      openMenu()
    }
  }

  const handleRootMouseLeave = () => {
    if (window.matchMedia('(pointer:fine)').matches) {
      scheduleClose()
    }
  }

  return (
    <li
      ref={(node) => {
        rootRef.current = node
        registerItem(node)
      }}
      className={cn('navigation__item', hasDropdown && 'navigation__item--has-dropdown', open && 'is-open', isCurrent && 'is-current')}
      onMouseEnter={handleRootMouseEnter}
      onMouseLeave={handleRootMouseLeave}
    >
      <Link
        ref={triggerRef}
        to={item.href ?? '#'}
        className={cn('navigation__link', isActive && 'is-active')}
        role="menuitem"
        aria-haspopup={hasDropdown ? 'true' : undefined}
        aria-expanded={hasDropdown ? (open ? 'true' : 'false') : undefined}
        onKeyDown={handleTriggerKeyDown}
        onBlur={() => scheduleClose()}
        onClick={handleTriggerClick}
      >
        <span className="navigation__label">{item.label}</span>
      </Link>
      {hasDropdown ? (
        <div
          ref={menuRef}
          className={cn('navigation__dropdown', open && 'is-open')}
          role="menu"
          aria-label={`${item.label} Untermenü`}
          data-open={open ? 'true' : 'false'}
          onKeyDown={handleMenuKeyDown}
          onBlur={handleMenuFocusOut}
        >
          {item.groups?.map((group, groupIndex) => (
            <div
              key={group.key ?? `${item.key}-group-${groupIndex}`}
              className={cn('navigation__dropdown-group', group.showTopBorder && 'has-border')}
            >
              {group.label ? <p className="navigation__dropdown-heading">{group.label}</p> : null}
              <ul className="navigation__dropdown-list" role="none">
                {group.items.map((child, childIndex) => {
                  const key = getChildKey(child, childIndex)
                  const isChildActive = currentPath === child.href
                  return (
                    <li key={key} role="none">
                      <Link
                        to={child.href}
                        data-nav-subitem="true"
                        role="menuitem"
                        tabIndex={open ? 0 : -1}
                        className={cn('navigation__dropdown-link', isChildActive && 'is-active')}
                        onClick={handleNavigate(child.href, child.href.startsWith('http'))}
                        onKeyDown={(event: KeyboardEvent<HTMLAnchorElement>) => {
                          if (event.key === 'Tab') {
                            closeMenu()
                          }
                        }}
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
      ) : null}
    </li>
  )
}

export default NavigationItem
