import type {
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'
import { cloneElement, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './utils'

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  placement?: 'top' | 'bottom'
  className?: string
  delay?: number
}

export function Tooltip({ content, children, placement = 'bottom', className, delay = 120 }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const timeoutRef = useRef<number | null>(null)
  const tooltipId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const showTooltip = () => {
    clearTimer()
    timeoutRef.current = window.setTimeout(() => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const top = placement === 'top' ? rect.top : rect.bottom
      const left = rect.left + rect.width / 2
      setPosition({ top, left })
      setVisible(true)
      timeoutRef.current = null
    }, delay)
  }

  const hideTooltip = () => {
    clearTimer()
    setVisible(false)
  }

  const childProps = children.props as HTMLAttributes<HTMLElement>
  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node
      const childRef = (children as ReactElement & { ref?: Ref<HTMLElement> }).ref
      if (typeof childRef === 'function') {
        childRef(node)
      } else if (childRef && typeof childRef === 'object' && 'current' in childRef) {
        ;(childRef as MutableRefObject<HTMLElement | null>).current = node
      }
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event)
      showTooltip()
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event)
      hideTooltip()
    },
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event)
      showTooltip()
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event)
      hideTooltip()
    },
    'aria-describedby': visible ? tooltipId : undefined,
  } as Record<string, unknown>)

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className={cn('ui-tooltip', `ui-tooltip--${placement}`, className)}
            style={{
              top: placement === 'top' ? position.top - 12 : position.top + 12,
              left: position.left,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}

export default Tooltip
