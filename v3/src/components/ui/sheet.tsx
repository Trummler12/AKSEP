import { cloneElement, createContext, forwardRef, isValidElement, useContext, useEffect, useMemo, useRef } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { createPortal } from 'react-dom'
import { callAll, cn, mergeRefs } from './utils'

interface SheetContextValue {
  open: boolean
  setOpen: (value: boolean) => void
}

const SheetContext = createContext<SheetContextValue | null>(null)

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const contextValue = useMemo(() => ({ open, setOpen: onOpenChange }), [open, onOpenChange])
  return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>
}

function useSheetContext(component: string): SheetContextValue {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error(`${component} muss innerhalb von <Sheet> verwendet werden.`)
  }
  return context
}

export interface SheetTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children?: ReactNode
}

export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ onClick, asChild = false, children, ...rest }, ref) => {
    const { open, setOpen } = useSheetContext('SheetTrigger')
    const handleClick = callAll(onClick, () => setOpen(!open))
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<Record<string, unknown>>
      const childRef = (child as unknown as { ref?: Ref<HTMLButtonElement> }).ref
      return cloneElement(child, {
        ...rest,
        ref: mergeRefs(childRef as Ref<HTMLButtonElement> | undefined, ref),
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        onClick: callAll((child.props as { onClick?: SheetTriggerProps['onClick'] }).onClick, handleClick),
      } as Partial<typeof child.props>)
    }
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>
    )
  },
)

SheetTrigger.displayName = 'SheetTrigger'

export interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
  position?: 'right' | 'left'
  overlayClassName?: string
}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, overlayClassName, position = 'right', children, ...rest }, ref) => {
    const { open, setOpen } = useSheetContext('SheetContent')
    const dialogRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      if (!open) return
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false)
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      requestAnimationFrame(() => {
        dialogRef.current?.focus()
      })
      return () => {
        document.body.style.overflow = previousOverflow
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [open, setOpen])

    if (typeof document === 'undefined') {
      return null
    }

    return createPortal(
      open ? (
        <>
          <div
            className={cn('ui-sheet__overlay', overlayClassName)}
            data-state={open ? 'open' : 'closed'}
            onClick={() => setOpen(false)}
          />
          <div
            ref={mergeRefs(ref, dialogRef)}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className={cn('ui-sheet__content', `ui-sheet__content--${position}`, className)}
            data-state={open ? 'open' : 'closed'}
            {...rest}
          >
            {children}
          </div>
        </>
      ) : null,
      document.body,
    )
  },
)

SheetContent.displayName = 'SheetContent'

export type SheetCloseProps = ButtonHTMLAttributes<HTMLButtonElement>

export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ onClick, ...rest }, ref) => {
    const { setOpen } = useSheetContext('SheetClose')
    return <button ref={ref} type="button" onClick={callAll(onClick, () => setOpen(false))} {...rest} />
  },
)

SheetClose.displayName = 'SheetClose'

export default Sheet
