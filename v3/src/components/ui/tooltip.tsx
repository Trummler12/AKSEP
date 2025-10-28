import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement, ReactNode, Ref } from 'react'
import { callAll, cn, mergeRefs } from './utils'

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  openDelay?: number
  closeDelay?: number
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  openDelay = 150,
  closeDelay = 100,
}: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const openTimeout = useRef<number | null>(null)
  const closeTimeout = useRef<number | null>(null)

  const clearTimers = () => {
    if (openTimeout.current) {
      window.clearTimeout(openTimeout.current)
      openTimeout.current = null
    }
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  useEffect(() => () => clearTimers(), [])

  const show = () => {
    clearTimers()
    openTimeout.current = window.setTimeout(() => setOpen(true), openDelay)
  }

  const hide = () => {
    clearTimers()
    closeTimeout.current = window.setTimeout(() => setOpen(false), closeDelay)
  }

  const child = children as ReactElement<Record<string, unknown>>
  const childRef = (child as unknown as { ref?: Ref<HTMLElement> }).ref
  const childProps = child.props as {
    onFocus?: (...args: unknown[]) => void
    onBlur?: (...args: unknown[]) => void
    onMouseEnter?: (...args: unknown[]) => void
    onMouseLeave?: (...args: unknown[]) => void
    onKeyDown?: (event: ReactKeyboardEvent) => void
  }
  const enhancedChild = cloneElement(child, {
    ref: mergeRefs(childRef as Ref<HTMLElement> | undefined, triggerRef),
    'aria-describedby': open ? id : undefined,
    onFocus: callAll(childProps.onFocus, show),
    onBlur: callAll(childProps.onBlur, hide),
    onMouseEnter: callAll(childProps.onMouseEnter, show),
    onMouseLeave: callAll(childProps.onMouseLeave, hide),
    onKeyDown: callAll(childProps.onKeyDown, (event: ReactKeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }),
  } as Partial<typeof child.props>)

  return (
    <span className={cn('ui-tooltip', open && 'ui-tooltip--open')}>
      {enhancedChild}
      <span
        role="tooltip"
        id={id}
        data-placement={placement}
        data-state={open ? 'open' : 'closed'}
        className={cn('ui-tooltip__content', `ui-tooltip__content--${placement}`)}
        hidden={!open}
      >
        {content}
      </span>
    </span>
  )
}

export default Tooltip
