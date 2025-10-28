import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  side: SheetSide
  triggerRef: RefObject<HTMLElement>
  contentId: string
  labelledBy?: string
  lastFocusedElement: MutableRefObject<HTMLElement | null>
}

type SheetSide = 'left' | 'right' | 'top' | 'bottom'

const SheetContext = createContext<SheetContextValue | null>(null)

function useSheetContext(component: string) {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error(`${component} must be used within <Sheet>`) // developer aid
  }
  return context
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref && typeof ref === 'object') {
        ;(ref as MutableRefObject<T>).current = value
      }
    })
  }
}

interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: SheetSide
  labelledBy?: string
  children: ReactNode
}

export function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'right',
  labelledBy,
  children,
}: SheetProps) {
  const triggerRef = useRef<HTMLElement>(null)
  const controlled = typeof openProp === 'boolean'
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = controlled ? (openProp as boolean) : uncontrolledOpen
  const setOpen = useCallback(
    (value: boolean) => {
      if (!controlled) {
        setUncontrolledOpen(value)
      }
      onOpenChange?.(value)
    },
    [controlled, onOpenChange],
  )
  const id = useId()
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  const value = useMemo<SheetContextValue>(
    () => ({
      open,
      setOpen,
      side,
      triggerRef,
      contentId: `sheet-${id}`,
      labelledBy,
      lastFocusedElement,
    }),
    [open, setOpen, side, triggerRef, id, labelledBy],
  )

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}

interface SheetTriggerProps {
  children: ReactElement
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { open, setOpen, triggerRef, contentId } = useSheetContext('SheetTrigger')
  return cloneElement(children, {
    ref: mergeRefs(children.ref, triggerRef),
    'aria-expanded': open,
    'aria-controls': contentId,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(event)
      if (!event.defaultPrevented) {
        setOpen(!open)
      }
    },
  })
}

interface SheetContentProps {
  children: ReactNode
  className?: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function SheetContent({ children, className }: SheetContentProps) {
  const { open, setOpen, side, triggerRef, contentId, labelledBy, lastFocusedElement } =
    useSheetContext('SheetContent')
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    lastFocusedElement.current = document.activeElement as HTMLElement | null

    const panel = panelRef.current
    if (panel) {
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      const focusTarget = focusable.length ? focusable[0] : panel
      const handle = window.requestAnimationFrame(() => {
        focusTarget.focus({ preventScroll: true })
      })

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          setOpen(false)
        } else if (event.key === 'Tab') {
          if (!focusable.length) {
            event.preventDefault()
            return
          }
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }

      panel.addEventListener('keydown', handleKeydown)

      return () => {
        window.cancelAnimationFrame(handle)
        panel.removeEventListener('keydown', handleKeydown)
      }
    }
  }, [open, setOpen, lastFocusedElement])

  useEffect(() => {
    if (open) {
      const previousOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.documentElement.style.overflow = previousOverflow
      }
    }
    return
  }, [open])

  useEffect(() => {
    if (!open && lastFocusedElement.current) {
      lastFocusedElement.current.focus({ preventScroll: true })
      lastFocusedElement.current = null
    } else if (!open && triggerRef.current) {
      triggerRef.current.focus({ preventScroll: true })
    }
  }, [open, triggerRef, lastFocusedElement])

  if (!open) {
    return null
  }

  const close = () => setOpen(false)

  return createPortal(
    <div className="ui-sheet" aria-hidden={!open}>
      <div
        className="ui-sheet__overlay"
        onClick={(event) => {
          if (event.defaultPrevented) return
          close()
        }}
      />
      <div
        ref={panelRef}
        id={contentId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={['ui-sheet__panel', `ui-sheet__panel--${side}`, className].filter(Boolean).join(' ')}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

interface SheetCloseProps {
  children: ReactElement
}

export function SheetClose({ children }: SheetCloseProps) {
  const { setOpen } = useSheetContext('SheetClose')
  return cloneElement(children, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(event)
      if (!event.defaultPrevented) {
        setOpen(false)
      }
    },
  })
}
