import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
} from 'react'
import { createPortal } from 'react-dom'
import type { ReactElement, ReactNode } from 'react'

type TooltipPlacement = 'top' | 'bottom'

interface TooltipProps {
  children: ReactElement
  content: ReactNode
  placement?: TooltipPlacement
  openDelay?: number
  closeDelay?: number
  id?: string
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Tooltip({
  children,
  content,
  placement = 'top',
  openDelay = 150,
  closeDelay = 100,
  id,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)

  const cleanupTimers = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current)
      openTimer.current = null
    }
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const show = () => {
    cleanupTimers()
    openTimer.current = window.setTimeout(() => setOpen(true), prefersReducedMotion() ? 0 : openDelay)
  }

  const hide = () => {
    cleanupTimers()
    closeTimer.current = window.setTimeout(() => setOpen(false), prefersReducedMotion() ? 0 : closeDelay)
  }

  useEffect(() => cleanupTimers, [])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      const offset = 8
      const top = placement === 'top' ? rect.top - offset : rect.bottom + offset
      setCoords({
        top,
        left: rect.left + rect.width / 2,
      })
    }

    updatePosition()

    const handleScroll = () => updatePosition()
    const handleResize = () => updatePosition()

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [open, placement])

  useEffect(() => {
    if (!open) return

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open])

  const tooltipContentId = id ?? `tooltip-${tooltipId}`

  return (
    <>
      {cloneElement(children, {
        ref: (node: HTMLElement) => {
          triggerRef.current = node
          const { ref } = children as unknown as { ref?: (instance: HTMLElement | null) => void }
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref && typeof ref === 'object') {
            ;(ref as MutableRefObject<HTMLElement | null>).current = node
          }
        },
        'aria-describedby': open ? tooltipContentId : undefined,
        onFocus: (event: React.FocusEvent<HTMLElement>) => {
          children.props.onFocus?.(event)
          show()
        },
        onBlur: (event: React.FocusEvent<HTMLElement>) => {
          children.props.onBlur?.(event)
          hide()
        },
        onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onMouseEnter?.(event)
          show()
        },
        onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
          children.props.onMouseLeave?.(event)
          hide()
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          children.props.onKeyDown?.(event)
          if (event.key === 'Escape') {
            hide()
          }
        },
      })}
      {open &&
        createPortal(
          <div
            role="tooltip"
            id={tooltipContentId}
            className="ui-tooltip"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            <span className="ui-tooltip__inner">{content}</span>
          </div>,
          document.body,
        )}
    </>
  )
}
