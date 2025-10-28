import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from './utils'

interface SheetContextValue {
  isOpen: boolean
  setOpen: (open: boolean) => void
  labelId: string
}

const SheetContext = createContext<SheetContextValue | null>(null)

export const Sheet = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false)
  const labelId = useId()

  const value = useMemo<SheetContextValue>(() => ({ isOpen, setOpen, labelId }), [isOpen, labelId])

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}

const useSheetContext = () => {
  const context = useContext(SheetContext)

  if (!context) {
    throw new Error('Sheet components must be used within <Sheet>')
  }

  return context
}

interface SheetTriggerProps {
  children: ReactElement
}

export const SheetTrigger = ({ children }: SheetTriggerProps) => {
  const { setOpen, isOpen } = useSheetContext()

  const child = children as ReactElement<Record<string, unknown>>
  const existingOnClick = (child.props as { onClick?: (event: MouseEvent) => void }).onClick
  const triggerProps: Record<string, unknown> = {
    'aria-expanded': isOpen,
    onClick: (event: MouseEvent) => {
      existingOnClick?.(event)
      setOpen(true)
    }
  }

  return cloneElement(child, triggerProps)
}

interface SheetContentProps {
  children: ReactNode
  className?: string
}

export const SheetContent = ({ children, className }: SheetContentProps) => {
  const { isOpen, setOpen, labelId } = useSheetContext()
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      return
    }

    const element = contentRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    element.focus({ preventScroll: true })

    return () => {
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  if (!isOpen) {
    return null
  }

  const portalTarget = typeof document !== 'undefined' ? document.body : null

  const content = (
    <div className="ui-sheet__overlay" role="presentation" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        ref={contentRef}
        tabIndex={-1}
        className={cn('ui-sheet', className)}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )

  return portalTarget ? createPortal(content, portalTarget) : content
}

interface SheetHeaderProps {
  children: ReactNode
}

export const SheetHeader = ({ children }: SheetHeaderProps) => {
  return <div className="ui-sheet__header">{children}</div>
}

interface SheetTitleProps {
  children: ReactNode
}

export const SheetTitle = ({ children }: SheetTitleProps) => {
  const { labelId } = useSheetContext()
  return (
    <h2 id={labelId} className="ui-sheet__title">
      {children}
    </h2>
  )
}

interface SheetCloseProps {
  children: ReactElement
}

export const SheetClose = ({ children }: SheetCloseProps) => {
  const { setOpen } = useSheetContext()

  const child = children as ReactElement<Record<string, unknown>>
  const existingOnClick = (child.props as { onClick?: (event: MouseEvent) => void }).onClick
  const closeProps: Record<string, unknown> = {
    onClick: (event: MouseEvent) => {
      existingOnClick?.(event)
      setOpen(false)
    }
  }

  return cloneElement(child, closeProps)
}

export default Sheet
