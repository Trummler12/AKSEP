import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { NavItem } from '../types/navigation'

type OverflowItem = Pick<NavItem, 'key' | 'align' | 'cta'>

interface UseOverflowNavOptions {
  debounceDelay?: number
}

interface OverflowState {
  visibleKeys: string[]
  overflowKeys: string[]
  hasOverflow: boolean
  ready: boolean
}

const DEFAULT_STATE: OverflowState = {
  visibleKeys: [],
  overflowKeys: [],
  hasOverflow: false,
  ready: false,
}

export interface UseOverflowNavResult {
  containerRef: (node: HTMLElement | null) => void
  registerItem: (key: string) => (node: HTMLElement | null) => void
  registerOverflowTrigger: (node: HTMLElement | null) => void
  visibleKeys: string[]
  overflowKeys: string[]
  hasOverflow: boolean
  ready: boolean
}

export function useOverflowNav(items: OverflowItem[], options: UseOverflowNavOptions = {}): UseOverflowNavResult {
  const debounceDelay = options.debounceDelay ?? 100
  const containerRef = useRef<HTMLElement | null>(null)
  const overflowTriggerRef = useRef<HTMLElement | null>(null)
  const overflowTriggerObserver = useRef<ResizeObserver | null>(null)
  const itemRefs = useRef(new Map<string, HTMLElement>())
  const itemObservers = useRef(new Map<string, ResizeObserver>())
  const itemWidths = useRef(new Map<string, number>())
  const overflowTriggerWidth = useRef(0)
  const [state, setState] = useState<OverflowState>(() => ({
    ...DEFAULT_STATE,
    visibleKeys: items.map((item) => item.key ?? ''),
  }))

  const itemSignature = useMemo(() => items.map((item) => item.key ?? '').join('|'), [items])

  const rafId = useRef<number | null>(null)
  const timeoutId = useRef<number | null>(null)

  const cleanupRaf = () => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }

  const cleanupTimeout = () => {
    if (timeoutId.current != null) {
      window.clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
  }

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerWidth = container.clientWidth
    if (containerWidth <= 0) return

    const orderedItems = items.filter((item) => item.key)
    const leftItems = orderedItems.filter((item) => item.align !== 'right')
    const rightItems = orderedItems.filter((item) => item.align === 'right')
    const pinnedKeys = new Set(
      orderedItems
        .filter((item) => item.cta || item.align === 'right')
        .map((item) => item.key as string),
    )

    const getWidth = (key?: string) => (key ? itemWidths.current.get(key) ?? 0 : 0)

    let visibleLeftKeys = leftItems.map((item) => item.key as string)
    let rightKeys = rightItems.map((item) => item.key as string)

    let totalWidth = visibleLeftKeys.reduce((acc, key) => acc + getWidth(key), 0)
    totalWidth += rightKeys.reduce((acc, key) => acc + getWidth(key), 0)

    let overflowHasButton = false
    const overflowSet = new Set<string>()

    const ensureOverflowButton = () => {
      if (!overflowHasButton) {
        totalWidth += overflowTriggerWidth.current
        overflowHasButton = true
      }
    }

    const removeKey = (key: string) => {
      totalWidth -= getWidth(key)
      visibleLeftKeys = visibleLeftKeys.filter((k) => k !== key)
      rightKeys = rightKeys.filter((k) => k !== key)
      overflowSet.add(key)
      ensureOverflowButton()
    }

    const candidateKeys = [...visibleLeftKeys].reverse()
    const deferredPinned: string[] = []
    for (const key of candidateKeys) {
      if (totalWidth <= containerWidth) break
      if (pinnedKeys.has(key)) {
        deferredPinned.push(key)
        continue
      }
      removeKey(key)
    }

    if (totalWidth > containerWidth) {
      for (const key of deferredPinned) {
        if (totalWidth <= containerWidth) break
        removeKey(key)
      }
    }

    // As a last resort, overflow right-aligned items (from rightmost)
    if (totalWidth > containerWidth) {
      const rightCandidates = [...rightKeys].reverse()
      for (const key of rightCandidates) {
        if (totalWidth <= containerWidth) break
        removeKey(key)
      }
    }

    const visibleKeys = [...visibleLeftKeys, ...rightKeys]
    const overflowKeys = orderedItems
      .map((item) => item.key as string)
      .filter((key) => overflowSet.has(key))
    const hasOverflow = overflowKeys.length > 0

    setState((prev) => {
      if (
        prev.visibleKeys.join('|') === visibleKeys.join('|') &&
        prev.overflowKeys.join('|') === overflowKeys.join('|') &&
        prev.hasOverflow === hasOverflow &&
        prev.ready
      ) {
        return prev
      }

      return {
        visibleKeys,
        overflowKeys,
        hasOverflow,
        ready: true,
      }
    })
  }, [items])

  const scheduleMeasure = useCallback(() => {
    cleanupTimeout()
    timeoutId.current = window.setTimeout(() => {
      cleanupRaf()
      rafId.current = window.requestAnimationFrame(() => {
        measure()
      })
    }, debounceDelay)
  }, [debounceDelay, measure])

  useEffect(() => {
    const observers = itemObservers.current
    return () => {
      cleanupTimeout()
      cleanupRaf()
      for (const observer of observers.values()) {
        observer.disconnect()
      }
      observers.clear()
      overflowTriggerObserver.current?.disconnect()
      overflowTriggerObserver.current = null
    }
  }, [])

  useLayoutEffect(() => {
    setState((prev) => ({
      ...prev,
      visibleKeys: items.map((item) => item.key ?? ''),
      overflowKeys: [],
      hasOverflow: false,
      ready: false,
    }))
    scheduleMeasure()
  }, [itemSignature, items, scheduleMeasure])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [scheduleMeasure])

  const registerOverflowTrigger = useCallback(
    (node: HTMLElement | null) => {
      overflowTriggerObserver.current?.disconnect()
      overflowTriggerObserver.current = null
      overflowTriggerRef.current = node
      if (!node) {
        overflowTriggerWidth.current = 0
        scheduleMeasure()
        return
      }
      const update = () => {
        const width = node.offsetWidth
        if (Math.abs(width - overflowTriggerWidth.current) > 0.5) {
          overflowTriggerWidth.current = width
          scheduleMeasure()
        }
      }
      update()
      const observer = new ResizeObserver(update)
      observer.observe(node)
      overflowTriggerObserver.current = observer
    },
    [scheduleMeasure],
  )

  const registerItem = useCallback(
    (key: string) => (node: HTMLElement | null) => {
      const map = itemRefs.current
      const observers = itemObservers.current
      const previous = map.get(key)
      if (previous && node !== previous) {
        observers.get(key)?.disconnect()
        observers.delete(key)
      }
      if (!node) {
        map.delete(key)
        itemWidths.current.delete(key)
        scheduleMeasure()
        return
      }
      map.set(key, node)

      const updateWidth = () => {
        const rect = node.getBoundingClientRect()
        const width = rect.width
        if (Math.abs(width - (itemWidths.current.get(key) ?? 0)) > 0.5) {
          itemWidths.current.set(key, width)
          scheduleMeasure()
        }
      }
      updateWidth()
      const observer = new ResizeObserver(updateWidth)
      observer.observe(node)
      observers.set(key, observer)
    },
    [scheduleMeasure],
  )

  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node
    if (node) {
      scheduleMeasure()
    }
  }, [scheduleMeasure])

  return useMemo(
    () => ({
      containerRef: setContainerRef,
      registerItem,
      registerOverflowTrigger,
      visibleKeys: state.visibleKeys,
      overflowKeys: state.overflowKeys,
      hasOverflow: state.hasOverflow,
      ready: state.ready,
    }),
    [registerItem, registerOverflowTrigger, setContainerRef, state],
  )
}

export default useOverflowNav
