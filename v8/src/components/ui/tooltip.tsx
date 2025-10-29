import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactElement
  placement?: 'top' | 'bottom'
  offset?: number
  id?: string
  className?: string
  tooltipProps?: HTMLAttributes<HTMLSpanElement>
}

function mergeCallbacks<Args extends unknown[]>(
  first: ((...args: Args) => void) | undefined,
  second: (...args: Args) => void,
) {
  return (...args: Args) => {
    first?.(...args)
    second(...args)
  }
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  offset = 8,
  id,
  className,
  tooltipProps,
}: TooltipProps) {
  const tooltipId = useId()
  const resolvedId = id ?? `tooltip-${tooltipId}`
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const wrapperRef = useRef<HTMLSpanElement | null>(null)

  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node
    },
    [],
  )

  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  const child = useMemo(() => {
    const onlyChild = Children.only(children) as ReactElement<Record<string, unknown>>

    if (!isValidElement(onlyChild)) {
      throw new Error('Tooltip expects a single React element child')
    }

    const originalProps = onlyChild.props as Record<string, unknown>

    const handleFocus = mergeCallbacks(originalProps.onFocus as () => void, show)
    const handleBlur = mergeCallbacks(originalProps.onBlur as () => void, hide)
    const handleMouseEnter = mergeCallbacks(originalProps.onMouseEnter as () => void, show)
    const handleMouseLeave = mergeCallbacks(originalProps.onMouseLeave as () => void, hide)
    const handleKeyDown = mergeCallbacks(
      originalProps.onKeyDown as (event: ReactKeyboardEvent<HTMLElement>) => void,
      (event: ReactKeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
          hide()
          window.requestAnimationFrame(() => {
            triggerRef.current?.blur()
          })
        }
      },
    )

    const assignRef = (node: HTMLElement | null) => {
      setTriggerRef(node)
      const { ref } = onlyChild as unknown as { ref?: Ref<HTMLElement> }
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref && typeof ref === 'object') {
        ;(ref as MutableRefObject<HTMLElement | null>).current = node
      }
    }

    const enhancedProps: Record<string, unknown> = {
      ref: assignRef as unknown as Ref<HTMLElement>,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      'aria-describedby': open ? resolvedId : undefined,
    }

    return cloneElement(onlyChild, enhancedProps)
  }, [children, hide, open, resolvedId, setTriggerRef, show])

  const positionStyles = useMemo(() => {
    const trigger = triggerRef.current
    if (!trigger || !wrapperRef.current || !open) {
      return {}
    }
    const triggerRect = trigger.getBoundingClientRect()
    const horizontalCenter = triggerRect.width / 2

    return {
      left: `${horizontalCenter}px`,
      top:
        placement === 'top'
          ? `${-offset}px`
          : `${triggerRect.height + offset}px`,
    } as const
  }, [offset, placement, open])

  return (
    <span
      ref={wrapperRef}
      className={`tooltip-wrapper${className ? ` ${className}` : ''}`}
      data-state={open ? 'open' : 'closed'}
    >
      {child}
      <span
        role="tooltip"
        id={resolvedId}
        className={`tooltip-bubble tooltip-${placement}`}
        data-state={open ? 'open' : 'closed'}
        style={positionStyles}
        aria-hidden={open ? undefined : true}
        {...tooltipProps}
      >
        {content}
      </span>
    </span>
  )
}

export default Tooltip
