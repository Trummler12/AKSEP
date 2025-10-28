import { useCallback, useMemo, useRef, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'

import type { NavItem } from '../../types/navigation'
import Icon from '../ui/icon'

interface NavigationItemProps {
  item: NavItem
  isOpen: boolean
  onOpen: (key: string) => void
  onClose: (key?: string) => void
  registerItem: (node: HTMLLIElement | null) => void
  activePath: string
}

const NavigationItem = ({ item, isOpen, onOpen, onClose, registerItem, activePath }: NavigationItemProps) => {
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const closeTimer = useRef<number | null>(null)
  const menuItemRefs = useRef<HTMLAnchorElement[]>([])

  const hasDropdown = Boolean(item.groups && item.groups.length > 0)

  const flattenedChildren = useMemo(
    () => item.groups?.flatMap((group) => group.items.map((child) => child)) ?? [],
    [item.groups]
  )

  const groupOffsets = useMemo(() => {
    const offsets: number[] = []
    let running = 0

    item.groups?.forEach((group) => {
      offsets.push(running)
      running += group.items.length
    })

    return offsets
  }, [item.groups])

  const isActive = useMemo(() => {
    if (activePath === item.href) {
      return true
    }

    return flattenedChildren.some((child) => activePath.startsWith(child.href))
  }, [activePath, flattenedChildren, item.href])

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const handleOpen = useCallback(() => {
    clearCloseTimer()
    onOpen(item.key ?? item.label)
  }, [item.key, item.label, onOpen])

  const handleClose = useCallback(() => {
    clearCloseTimer()
    onClose(item.key ?? item.label)
  }, [item.key, item.label, onClose])

  const focusMenuItem = (index: number) => {
    const menuItem = menuItemRefs.current[index]
    menuItem?.focus()
  }

  const focusMenuItemWithDelay = (index: number) => {
    if (typeof window === 'undefined') {
      focusMenuItem(index)
      return
    }

    window.requestAnimationFrame(() => {
      focusMenuItem(index)
    })
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (!hasDropdown) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        handleOpen()
        focusMenuItemWithDelay(0)
        break
      case 'ArrowUp':
        event.preventDefault()
        handleOpen()
        focusMenuItemWithDelay(flattenedChildren.length - 1)
        break
      case 'Escape':
        event.preventDefault()
        handleClose()
        triggerRef.current?.focus()
        break
      default:
        break
    }
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (!hasDropdown) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const nextIndex = (index + 1) % flattenedChildren.length
        focusMenuItem(nextIndex)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const prevIndex = (index - 1 + flattenedChildren.length) % flattenedChildren.length
        focusMenuItem(prevIndex)
        break
      }
      case 'Home':
        event.preventDefault()
        focusMenuItem(0)
        break
      case 'End':
        event.preventDefault()
        focusMenuItem(flattenedChildren.length - 1)
        break
      case 'Escape':
        event.preventDefault()
        handleClose()
        triggerRef.current?.focus()
        break
      default:
        break
    }
  }

  const registerMenuRef = (index: number) => (node: HTMLAnchorElement | null) => {
    if (!node) {
      menuItemRefs.current.splice(index, 1)
      return
    }

    menuItemRefs.current[index] = node
  }

  const handleMouseEnter = () => {
    if (!hasDropdown) {
      return
    }

    handleOpen()
  }

  const handleMouseLeave = () => {
    if (!hasDropdown) {
      return
    }

    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      handleClose()
    }, 120)
  }

  const menuId = `${item.key ?? item.label}-menu`

  return (
    <li
      className="navigation-item"
      data-open={isOpen ? 'true' : 'false'}
      data-active={isActive ? 'true' : 'false'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={(event) => {
        if (!hasDropdown) {
          return
        }

        if (
          triggerRef.current &&
          event.target instanceof Node &&
          triggerRef.current.contains(event.target)
        ) {
          return
        }

        handleOpen()
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          handleClose()
        }
      }}
      ref={registerItem}
      role="none"
    >
      <Link
        to={item.href ?? '#'}
        className="navigation-item__trigger"
        role="menuitem"
        aria-haspopup={hasDropdown ? 'true' : undefined}
        aria-expanded={hasDropdown ? (isOpen ? 'true' : 'false') : undefined}
        aria-controls={hasDropdown ? menuId : undefined}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
      >
        <span className="navigation-item__label">{item.label}</span>
        {hasDropdown ? <Icon name="ChevronDown" className="navigation-item__chevron" /> : null}
      </Link>

      {hasDropdown && isOpen ? (
        <div className="navigation-item__dropdown" role="menu" id={menuId} aria-label={`${item.label} Untermenü`}>
          {item.groups?.map((group, groupIndex) => (
            <div
              key={group.key ?? `${item.key}-group-${groupIndex}`}
              className="navigation-item__group"
              data-top-border={group.showTopBorder ? 'true' : 'false'}
            >
              {group.label ? <p className="navigation-item__group-label">{group.label}</p> : null}
              <ul className="navigation-item__group-list">
                {group.items.map((child, childIndex) => {
                  const offset = groupOffsets[groupIndex] ?? 0
                  const index = offset + childIndex

                  return (
                    <li key={child.href} className="navigation-item__group-item" role="none">
                      <Link
                        to={child.href}
                        className="navigation-item__group-link"
                        role="menuitem"
                        tabIndex={-1}
                        ref={registerMenuRef(index)}
                        onKeyDown={(event) => handleMenuKeyDown(event, index)}
                        onClick={handleClose}
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
