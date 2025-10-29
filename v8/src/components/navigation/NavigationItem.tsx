import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import type { NavChildGroup, NavItem } from '../../types/navigation'
import { getChildHrefs } from '../../data/navigation'

interface NavigationItemProps {
  item: NavItem
  currentPath?: string
  registerItem: (node: HTMLElement | null) => void
}

const focusableSelector = 'a[href], button:not([disabled])'

export default function NavigationItem({ item, currentPath, registerItem }: NavigationItemProps) {
  const containerRef = useRef<HTMLLIElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const linkRefs = useRef<HTMLAnchorElement[]>([])
  const [open, setOpen] = useState(false)

  const itemKey = item.key ?? item.label
  const hasDropdown = (item.groups?.length ?? 0) > 0

  const allChildLinks = useMemo(() => {
    const childHrefs = getChildHrefs(item)
    return new Set([item.href, ...childHrefs])
  }, [item])

  const isActive = currentPath ? allChildLinks.has(currentPath) : false

  const groups = useMemo<NavChildGroup[]>(() => {
    if (!hasDropdown) {
      return item.groups ?? []
    }

    if (item.href) {
      const overviewGroup: NavChildGroup = {
        key: `${itemKey}-overview`,
        items: [{ label: item.label, href: item.href, key: `${itemKey}-overview-link` }],
      }
      return [overviewGroup, ...(item.groups ?? [])]
    }

    return item.groups ?? []
  }, [hasDropdown, item, itemKey])

  const setContainerRef = useCallback(
    (node: HTMLLIElement | null) => {
      containerRef.current = node
      registerItem(node)
    },
    [registerItem],
  )

  const closeMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const openMenu = useCallback(() => {
    if (hasDropdown) {
      setOpen(true)
    }
  }, [hasDropdown])

  const handleMouseEnter = useCallback(() => {
    openMenu()
  }, [openMenu])

  const handleMouseLeave = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  const handleTriggerClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (!hasDropdown) {
        return
      }
      event.preventDefault()
      setOpen((prev) => !prev)
    },
    [hasDropdown],
  )

  const handleTriggerFocus = useCallback(() => {
    openMenu()
  }, [openMenu])

  const focusMenuItem = useCallback((index: number) => {
    const target = linkRefs.current[index]
    if (target) {
      target.focus()
    }
  }, [])

  const focusFirstItem = useCallback(() => {
    focusMenuItem(0)
  }, [focusMenuItem])

  const focusLastItem = useCallback(() => {
    focusMenuItem(linkRefs.current.length - 1)
  }, [focusMenuItem])

  const handleTriggerKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (!hasDropdown) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!open) {
          setOpen(true)
          window.requestAnimationFrame(focusFirstItem)
        } else {
          const activeIndex = linkRefs.current.findIndex((link) => link === document.activeElement)
          const nextIndex = activeIndex >= 0 ? Math.min(linkRefs.current.length - 1, activeIndex + 1) : 0
          focusMenuItem(nextIndex)
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (!open) {
          setOpen(true)
          window.requestAnimationFrame(focusLastItem)
        } else {
          const activeIndex = linkRefs.current.findIndex((link) => link === document.activeElement)
          const nextIndex = activeIndex > 0 ? activeIndex - 1 : linkRefs.current.length - 1
          focusMenuItem(nextIndex)
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    },
    [focusFirstItem, focusLastItem, focusMenuItem, hasDropdown, open],
  )

  const handleMenuKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!hasDropdown) {
        return
      }

      const activeIndex = linkRefs.current.findIndex((link) => link === document.activeElement)
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = activeIndex >= 0 ? (activeIndex + 1) % linkRefs.current.length : 0
        focusMenuItem(nextIndex)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const nextIndex = activeIndex > 0 ? activeIndex - 1 : linkRefs.current.length - 1
        focusMenuItem(nextIndex)
      }
    },
    [focusMenuItem, hasDropdown],
  )

  const handleBlur = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      if (!containerRef.current) {
        return
      }
      const next = event.relatedTarget as Node | null
      if (!next || !containerRef.current.contains(next)) {
        closeMenu()
      }
    },
    [closeMenu],
  )

  useEffect(() => {
    if (!hasDropdown) {
      return
    }

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [hasDropdown])

  useEffect(() => {
    setOpen(false)
  }, [currentPath])

  useEffect(() => {
    if (!menuRef.current) {
      return
    }
    const focusable = menuRef.current.querySelectorAll<HTMLAnchorElement>(focusableSelector)
    linkRefs.current = Array.from(focusable)
  }, [groups, open])

  const childClass = isActive ? ' site-nav__item--active' : ''

  return (
    <li
      className={`site-nav__item${childClass}`}
      ref={setContainerRef}
      role="none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasDropdown ? (
        <>
          <button
            ref={(node) => {
              triggerRef.current = node
            }}
            type="button"
            className="site-nav__trigger"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={handleTriggerClick}
            onFocus={handleTriggerFocus}
            onKeyDown={handleTriggerKeyDown}
            onBlur={handleBlur}
            role="menuitem"
          >
            <span>{item.label}</span>
            <span className="site-nav__trigger-caret" aria-hidden />
          </button>
          <div
            ref={menuRef}
            className="site-nav__dropdown"
            data-open={open ? 'true' : 'false'}
            role="menu"
            aria-label={`Untermenü ${item.label}`}
            onKeyDown={handleMenuKeyDown}
            onBlur={handleBlur}
          >
            {groups.map((group) => (
              <div
                key={group.key ?? `${itemKey}-${group.label ?? 'group'}`}
                className={`site-nav__dropdown-group${group.showTopBorder ? ' site-nav__dropdown-group--border' : ''}`}
              >
                {group.label ? <p className="site-nav__dropdown-heading">{group.label}</p> : null}
                <ul className="site-nav__dropdown-list">
                  {group.items.map((child) => (
                    <li key={child.href} className="site-nav__dropdown-item">
                      <a
                        href={child.href}
                        className="site-nav__dropdown-link"
                        role="menuitem"
                        onClick={closeMenu}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <a
          ref={(node) => {
            triggerRef.current = node
          }}
          href={item.href ?? '#'}
          className="site-nav__link"
          role="menuitem"
          aria-current={isActive ? 'page' : undefined}
          onBlur={handleBlur}
        >
          {item.label}
        </a>
      )}
    </li>
  )
}
