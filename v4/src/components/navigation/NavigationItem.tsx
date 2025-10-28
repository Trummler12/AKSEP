import { NavLink } from 'react-router-dom'
import { useCallback, useEffect, useId, useMemo, useRef } from 'react'
import type { NavItem } from '../../types/navigation'

interface NavigationItemProps {
  item: NavItem
  isOpen: boolean
  onOpenChange: (key: string | null) => void
  currentPath: string
  registerItem: (key: string, element: HTMLElement | null) => void
}

export default function NavigationItem({
  item,
  isOpen,
  onOpenChange,
  currentPath,
  registerItem,
}: NavigationItemProps) {
  const key = item.key ?? item.label
  const menuId = useId()
  const triggerId = `${menuId}-trigger`
  const itemRef = useRef<HTMLLIElement | null>(null)
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const menuItemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const closeTimer = useRef<number | null>(null)
  const hasMenu = Boolean(item.groups && item.groups.length > 0)

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      onOpenChange(null)
    }, 120)
  }

  const openMenu = useCallback(() => {
    clearCloseTimer()
    onOpenChange(key)
  }, [key, onOpenChange])

  const closeMenu = useCallback(() => {
    clearCloseTimer()
    onOpenChange(null)
  }, [onOpenChange])

  const focusMenuItem = (index: number) => {
    const node = menuItemRefs.current[index]
    if (node) {
      node.focus()
    }
  }

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (!hasMenu) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) {
        openMenu()
      }
      focusMenuItem(0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        openMenu()
      }
      focusMenuItem(menuItemRefs.current.length - 1)
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      closeMenu()
      triggerRef.current?.focus()
    }
  }

  const handleMenuKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (index + 1) % menuItemRefs.current.length
      focusMenuItem(nextIndex)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const previousIndex = (index - 1 + menuItemRefs.current.length) % menuItemRefs.current.length
      focusMenuItem(previousIndex)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusMenuItem(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusMenuItem(menuItemRefs.current.length - 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
      triggerRef.current?.focus()
    }
  }

  useEffect(() => {
    registerItem(key, itemRef.current)
    return () => {
      registerItem(key, null)
    }
  }, [key, registerItem])

  useEffect(() => () => clearCloseTimer(), [])

  const isActive = useMemo(() => {
    if (!item.href) return false
    if (currentPath === item.href) return true
    const children = item.groups?.flatMap((group) => group.items) ?? []
    return children.some((child) => currentPath.startsWith(child.href))
  }, [currentPath, item.href, item.groups])

  menuItemRefs.current = []

  let groupItemOffset = 0

  return (
    <li
      ref={itemRef}
      className={`navigation__item${isActive ? ' navigation__item--active' : ''}${isOpen ? ' navigation__item--open' : ''}`}
      role="none"
      onMouseEnter={() => {
        if (hasMenu) {
          openMenu()
        }
      }}
      onMouseLeave={() => {
        if (hasMenu) {
          scheduleClose()
        }
      }}
    >
      <NavLink
        to={item.href ?? '#'}
        id={triggerId}
        ref={triggerRef}
        role="menuitem"
        aria-haspopup={hasMenu ? 'true' : undefined}
        aria-expanded={hasMenu ? isOpen : undefined}
        aria-controls={hasMenu ? menuId : undefined}
        className={({ isActive: active }) =>
          `navigation__link${active || isActive ? ' navigation__link--active' : ''}`
        }
        onKeyDown={handleTriggerKeyDown}
        onFocus={() => {
          clearCloseTimer()
        }}
        onBlur={() => {
          if (hasMenu) {
            scheduleClose()
          }
        }}
        onMouseDown={() => {
          clearCloseTimer()
        }}
      >
        <span className="navigation__link-label">{item.label}</span>
      </NavLink>
      {hasMenu ? (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={`navigation__menu${isOpen ? ' navigation__menu--open' : ''}`}
          onMouseEnter={() => {
            clearCloseTimer()
          }}
          onMouseLeave={() => {
            scheduleClose()
          }}
        >
          {item.groups?.map((group, groupIndex) => {
            const baseIndex = groupItemOffset
            groupItemOffset += group.items.length
            return (
            <div
              key={group.key ?? `${key}-group-${groupIndex}`}
              className={`navigation__menu-group${group.showTopBorder ? ' navigation__menu-group--border' : ''}`}
            >
              {group.label ? (
                <p className="navigation__menu-group-label">{group.label}</p>
              ) : null}
              <ul className="navigation__menu-list" role="none">
                {group.items.map((child, childIndex) => {
                  const combinedIndex = baseIndex + childIndex

                  return (
                    <li key={child.key ?? child.href} role="none">
                      <NavLink
                        to={child.href}
                        className={({ isActive: active }) =>
                          `navigation__menu-link${active || currentPath === child.href ? ' navigation__menu-link--active' : ''}`
                        }
                        role="menuitem"
                        ref={(node) => {
                          menuItemRefs.current[combinedIndex] = node
                        }}
                        tabIndex={isOpen ? 0 : -1}
                        onKeyDown={(event) => handleMenuKeyDown(event, combinedIndex)}
                        onFocus={() => clearCloseTimer()}
                        onBlur={() => scheduleClose()}
                        onClick={() => {
                          closeMenu()
                        }}
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
            )
          })}
        </div>
      ) : null}
    </li>
  )
}
