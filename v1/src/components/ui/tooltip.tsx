import {
  cloneElement,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode
} from 'react'

interface TooltipContextValue {
  id: string
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = createContext<TooltipContextValue | null>(null)

export const Tooltip = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false)
  const id = useId()

  const value = useMemo<TooltipContextValue>(() => ({ id, isOpen, setOpen }), [id, isOpen])

  return (
    <TooltipContext.Provider value={value}>
      <span className="ui-tooltip-wrapper">{children}</span>
    </TooltipContext.Provider>
  )
}

const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (!context) {
    throw new Error('Tooltip components must be used within <Tooltip>')
  }

  return context
}

interface TooltipTriggerProps {
  children: ReactElement
}

export const TooltipTrigger = ({ children }: TooltipTriggerProps) => {
  const { setOpen, id, isOpen } = useTooltipContext()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const child = children as ReactElement<Record<string, unknown>>
  const triggerProps: Record<string, unknown> = {
    onMouseEnter: (event: MouseEvent) => {
      const existing = (child.props as { onMouseEnter?: (event: MouseEvent) => void }).onMouseEnter
      existing?.(event)
      handleOpen()
    },
    onMouseLeave: (event: MouseEvent) => {
      const existing = (child.props as { onMouseLeave?: (event: MouseEvent) => void }).onMouseLeave
      existing?.(event)
      handleClose()
    },
    onFocus: (event: FocusEvent<unknown>) => {
      const existing = (child.props as { onFocus?: (event: FocusEvent<unknown>) => void }).onFocus
      existing?.(event)
      handleOpen()
    },
    onBlur: (event: FocusEvent<unknown>) => {
      const existing = (child.props as { onBlur?: (event: FocusEvent<unknown>) => void }).onBlur
      existing?.(event)
      handleClose()
    },
    'aria-describedby': isOpen ? id : undefined
  }

  return cloneElement(child, triggerProps)
}

interface TooltipContentProps {
  children: ReactNode
  className?: string
}

export const TooltipContent = ({ children, className }: TooltipContentProps) => {
  const { id, isOpen } = useTooltipContext()

  if (!isOpen) {
    return null
  }

  return (
    <div id={id} role="tooltip" className={['ui-tooltip', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export default Tooltip
