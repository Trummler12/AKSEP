import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject, Ref, RefCallback } from 'react'

export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ')
}

export function mergeRefs<T>(
  ...refs: Array<Ref<T> | MutableRefObject<T | null> | undefined>
): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ;(ref as MutableRefObject<T | null>).current = value
      }
    }
  }
}

export function usePrefersReducedMotion(): boolean {
  const query = useRef<MediaQueryList | null>(null)
  const [prefers, setPrefers] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    query.current = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefers(query.current?.matches ?? false)
    update()
    query.current?.addEventListener('change', update)
    return () => {
      query.current?.removeEventListener('change', update)
    }
  }, [])

  return prefers
}

export function callAll<Args extends unknown[]>(...fns: Array<((...args: Args) => void) | undefined>) {
  return (...args: Args) => {
    for (const fn of fns) {
      fn?.(...args)
    }
  }
}
