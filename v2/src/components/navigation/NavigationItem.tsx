import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
} from 'react'
import { Link } from 'react-router-dom'
import type { NavChild, NavItem } from '../../types/navigation'

interface NavigationItemProps {
  item: NavItem
  itemKey: string
  isActive: boolean
  isOpen: boolean
  onOpen: (key: string) => void
  onClose: () => void
  onFocusNext: () => void
  onFocusPrev: () => void
  registerItem: (node: HTMLElement | null) => void
  registerTrigger: (node: HTMLElement | null) => void
  onNavigate: () => void
}

const CLOSE_DELAY = 120

export function NavigationItem({
  item,
  itemKey,
  isActive,
  isOpen,
  onOpen,
  onClose,
  onFocusNext,
  onFocusPrev,
  registerItem,
  registerTrigger,
  onNavigate,
}: NavigationItemProps) {
  const containerRef = useRef<HTMLLIElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const closeTimeout = useRef<number | null>(null)

  const hasGroups = (item.groups?.length ?? 0) > 0

  const dropdownGroups = useMemo(() => {
    const groups = item.groups ?? []
    if (!item.href) {
      return groups
    }
    return [
      {
        key: `${itemKey}-overview`,
        items: [{ label: item.label, href: item.href }],
      },
      ...groups,
    ]
  }, [item.groups, item.href, item.label, itemKey])

  const menuItems = useMemo(() => {
    return dropdownGroups.flatMap((group) => group.items)
  }, [dropdownGroups])

  const clearCloseTimeout = () => {
    if (closeTimeout.current !== null) {
      window.clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimeout()
    closeTimeout.current = window.setTimeout(() => {
      closeTimeout.current = null
      onClose()
    }, CLOSE_DELAY)
  }

  useEffect(() => {
    return () => clearCloseTimeout()
  }, [])

  const focusMenuItem = useCallback((index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>(
      '[data-nav-subitem="true"]',
    )
    const target = items?.[index]
    target?.focus()
  }, [])

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (!hasGroups) {
        if (event.key === 'ArrowRight') {
          onFocusNext()
        } else if (event.key === 'ArrowLeft') {
          onFocusPrev()
        }
        return
      }

      switch (event.key) {
        case 'ArrowDown':
        case ' ': {
          event.preventDefault()
          onOpen(itemKey)
          focusMenuItem(0)
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          onOpen(itemKey)
          focusMenuItem(menuItems.length - 1)
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          onFocusNext()
          break
        }
        case 'ArrowLeft': {
          event.preventDefault()
          onFocusPrev()
          break
        }
        case 'Escape': {
          onClose()
          break
        }
        default:
          break
      }
    },
    [focusMenuItem, hasGroups, itemKey, menuItems.length, onClose, onFocusNext, onFocusPrev, onOpen],
  )

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        const trigger = containerRef.current?.querySelector<HTMLElement>(
          '[data-nav-trigger="true"]',
        )
        trigger?.focus()
        return
      }

      if (menuItems.length === 0) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        focusMenuItem((index + 1) % menuItems.length)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        focusMenuItem((index - 1 + menuItems.length) % menuItems.length)
        return
      }
    },
    [focusMenuItem, menuItems.length, onClose],
  )

  const handlePointerEnter = () => {
    clearCloseTimeout()
    if (hasGroups) {
      onOpen(itemKey)
    }
  }

  const handlePointerLeave = () => {
    if (hasGroups) {
      scheduleClose()
    }
  }

  const handleMenuPointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      scheduleClose()
    }
  }

  const triggerRef = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        node.setAttribute('data-nav-trigger', 'true')
      }
      registerTrigger(node)
    },
    [registerTrigger],
  )

  const renderMenuGroup = (
    groupLabel: string | undefined,
    children: NavChild[],
    showTopBorder?: boolean,
    key?: string,
  ) => {
    return (
      <div
        className={`navigation__dropdown-group${showTopBorder ? ' navigation__dropdown-group--border' : ''}`}
        key={key ?? groupLabel ?? children[0]?.href}
      >
        {groupLabel ? <p className="navigation__dropdown-heading">{groupLabel}</p> : null}
        <ul className="navigation__dropdown-list" role="none">
          {children.map((child, index) => (
            <li className="navigation__dropdown-item" key={child.href} role="none">
              <Link
                className="navigation__dropdown-link"
                data-nav-subitem="true"
                onClick={onNavigate}
                onFocus={clearCloseTimeout}
                onKeyDown={(event) => handleMenuKeyDown(event, index)}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                to={child.href}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const topLevelClass = [
    'navigation__item',
    isActive ? 'navigation__item--active' : '',
    isOpen ? 'navigation__item--open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li
      aria-haspopup={hasGroups ? 'true' : undefined}
      aria-expanded={hasGroups ? (isOpen ? 'true' : 'false') : undefined}
      className={topLevelClass}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      ref={(node) => {
        containerRef.current = node
        registerItem(node)
      }}
      role="none"
    >
      <Link
        className="navigation__trigger"
        data-active={isActive ? 'true' : 'false'}
        onClick={hasGroups ? (event) => {
          if (hasGroups) {
            event.preventDefault()
            if (isOpen) {
              onClose()
            } else {
              onOpen(itemKey)
            }
          }
        } : undefined}
        onFocus={() => {
          clearCloseTimeout()
          if (hasGroups) {
            onOpen(itemKey)
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        role="menuitem"
        tabIndex={0}
        to={item.href ?? '/.start'}
      >
        {item.label}
      </Link>
      {hasGroups ? (
        <div
          aria-hidden={isOpen ? 'false' : 'true'}
          className="navigation__dropdown"
          onPointerLeave={handleMenuPointerLeave}
          ref={menuRef}
          role="menu"
        >
          {dropdownGroups.map((group) =>
            renderMenuGroup(group.label, group.items, group.showTopBorder, group.key),
          )}
        </div>
      ) : null}
    </li>
  )
}

export default NavigationItem
