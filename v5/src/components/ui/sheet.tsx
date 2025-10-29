import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  ariaLabel?: string
  labelledBy?: string
}

export function Sheet({ open, onOpenChange, children, ariaLabel, labelledBy }: SheetProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<Element | null>(null)
  const generatedId = useId()
  const labelledId = labelledBy ?? generatedId

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement
      const focusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      window.setTimeout(() => focusable?.focus(), 0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus()
      }
    }
    return () => {
      if (!open) document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      }
      if (event.key === 'Tab' && contentRef.current) {
        const focusable = Array.from(
          contentRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        )
        if (focusable.length === 0) return
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

    if (open) {
      window.addEventListener('keydown', onKeyDown)
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="ui-sheet"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) {
          onOpenChange(false)
        }
      }}
    >
      <div
        ref={contentRef}
        className="ui-sheet__content"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelledId}
      >
        <div id={labelledId} className="visually-hidden">
          {ariaLabel}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Sheet
