import {
  cloneElement,
  type AriaAttributes,
  type DOMAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import '../../styles/components/shared.css'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

type TooltipTriggerElement = ReactElement<Record<string, unknown>>

export interface TooltipProps {
  children: TooltipTriggerElement
  content: ReactNode
  placement?: TooltipPlacement
  openDelay?: number
  closeDelay?: number
}

function callAll<Args extends unknown[]>(
  ...fns: Array<((...args: Args) => void) | undefined>
) {
  return (...args: Args) => {
    for (const fn of fns) {
      if (typeof fn === 'function') {
        fn(...args)
      }
    }
  }
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  openDelay = 100,
  closeDelay = 100,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
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

  const show = () => {
    clearTimers()
    openTimeout.current = window.setTimeout(() => {
      setOpen(true)
    }, openDelay)
  }

  const hide = () => {
    clearTimers()
    closeTimeout.current = window.setTimeout(() => {
      setOpen(false)
    }, closeDelay)
  }

  useEffect(() => () => clearTimers(), [])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hide()
    }
  }

  const childHandlers = children.props as Partial<DOMAttributes<HTMLElement>>

  const triggerProps: Partial<DOMAttributes<HTMLElement>> &
    AriaAttributes &
    typeof children.props = {
    'aria-describedby': open ? tooltipId : undefined,
    onBlur: callAll(childHandlers.onBlur, hide),
    onFocus: callAll(childHandlers.onFocus, show),
    onKeyDown: callAll(childHandlers.onKeyDown, handleKeyDown),
    onPointerEnter: callAll(childHandlers.onPointerEnter, show),
    onPointerLeave: callAll(childHandlers.onPointerLeave, hide),
  }

  const trigger = cloneElement(children, triggerProps)

  return (
    <span
      className="tooltip"
      data-open={open ? 'true' : 'false'}
      data-placement={placement}
    >
      {trigger}
      <span
        aria-hidden={open ? 'false' : 'true'}
        className="tooltip__content"
        data-open={open ? 'true' : 'false'}
        id={tooltipId}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  )
}

export default Tooltip
