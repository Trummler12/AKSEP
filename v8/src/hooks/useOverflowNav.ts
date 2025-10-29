import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type KeyedItem = { key: string }

type OverflowState = {
  visible: string[]
  overflow: string[]
}

export interface OverflowCalculationInput {
  keys: string[]
  widths: Map<string, number>
  containerWidth: number
  overflowToggleWidth: number
  pinnedKeys: Set<string>
}

const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

export const calculateOverflow = ({
  keys,
  widths,
  containerWidth,
  overflowToggleWidth,
  pinnedKeys,
}: OverflowCalculationInput): OverflowState => {
  let totalWidth = keys.reduce((sum, key) => sum + (widths.get(key) ?? 0), 0)
  if (totalWidth <= containerWidth) {
    return { visible: [...keys], overflow: [] }
  }

  const visible = [...keys]
  const overflow: string[] = []
  const availableWidth = Math.max(0, containerWidth - overflowToggleWidth)

  const allPinned = () => visible.every((key) => pinnedKeys.has(key))

  while (visible.length > 0 && totalWidth > availableWidth) {
    let removalIndex = -1
    for (let i = visible.length - 1; i >= 0; i -= 1) {
      const key = visible[i]
      if (!pinnedKeys.has(key) || allPinned()) {
        removalIndex = i
        break
      }
    }

    if (removalIndex === -1) {
      removalIndex = visible.length - 1
    }

    const [removedKey] = visible.splice(removalIndex, 1)
    overflow.unshift(removedKey)
    totalWidth -= widths.get(removedKey) ?? 0
  }

  return { visible, overflow }
}

export interface UseOverflowNavOptions<T extends KeyedItem> {
  items: T[]
  pinnedKeys?: string[]
}

export interface OverflowNavResult<T extends KeyedItem> {
  visibleItems: T[]
  overflowItems: T[]
  isOverflowing: boolean
  registerContainer: (node: HTMLElement | null) => void
  registerOverflowToggle: (node: HTMLElement | null) => void
  registerItem: (key: string) => (node: HTMLElement | null) => void
}

export function useOverflowNav<T extends KeyedItem>({ items, pinnedKeys = [] }: UseOverflowNavOptions<T>): OverflowNavResult<T> {
  const containerRef = useRef<HTMLElement | null>(null)
  const overflowToggleRef = useRef<HTMLElement | null>(null)
  const widthMapRef = useRef(new Map<string, number>())
  const observersRef = useRef(new Map<string, ResizeObserver>())
  const containerObserverRef = useRef<ResizeObserver | null>(null)
  const overflowObserverRef = useRef<ResizeObserver | null>(null)
  const rafRef = useRef<number | null>(null)
  const itemsRef = useRef(items)
  const pinnedRef = useRef(new Set(pinnedKeys))

  const [state, setState] = useState<OverflowState>(() => ({
    visible: items.map((item) => item.key),
    overflow: [],
  }))

  itemsRef.current = items
  const pinnedSet = useMemo(() => new Set(pinnedKeys), [pinnedKeys])
  pinnedRef.current = pinnedSet

  const setStateIfChanged = useCallback((next: OverflowState) => {
    setState((prev) => {
      if (arraysEqual(prev.visible, next.visible) && arraysEqual(prev.overflow, next.overflow)) {
        return prev
      }
      return next
    })
  }, [])

  const scheduleMeasure = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      const container = containerRef.current
      if (!container) {
        const keys = itemsRef.current.map((item) => item.key)
        setStateIfChanged({ visible: keys, overflow: [] })
        return
      }

      const keys = itemsRef.current.map((item) => item.key)
      const widthMap = widthMapRef.current
      const widthsReady = keys.every((key) => widthMap.has(key))
      if (!widthsReady) {
        setStateIfChanged({ visible: keys, overflow: [] })
        return
      }

      const containerWidth = container.getBoundingClientRect().width
      const pinnedSet = pinnedRef.current
      const overflowToggleWidth = overflowToggleRef.current?.getBoundingClientRect().width ?? 0

      const result = calculateOverflow({
        keys,
        widths: widthMap,
        containerWidth,
        overflowToggleWidth,
        pinnedKeys: pinnedSet,
      })

      setStateIfChanged(result)
    })
  }, [setStateIfChanged])

  useEffect(() => {
    scheduleMeasure()
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scheduleMeasure])

  useEffect(() => {
    scheduleMeasure()
  }, [items, pinnedKeys, scheduleMeasure])

  const registerContainer = useCallback(
    (node: HTMLElement | null) => {
      if (containerRef.current === node) {
        return
      }

      containerObserverRef.current?.disconnect()
      containerRef.current = node

      if (node) {
        const observer = new ResizeObserver(scheduleMeasure)
        containerObserverRef.current = observer
        observer.observe(node)
        scheduleMeasure()
      }
    },
    [scheduleMeasure],
  )

  const registerOverflowToggle = useCallback(
    (node: HTMLElement | null) => {
      if (overflowToggleRef.current === node) {
        return
      }
      overflowObserverRef.current?.disconnect()
      overflowToggleRef.current = node
      if (node) {
        const observer = new ResizeObserver(() => {
          scheduleMeasure()
        })
        overflowObserverRef.current = observer
        observer.observe(node)
        scheduleMeasure()
      }
    },
    [scheduleMeasure],
  )

  const registerItem = useCallback(
    (key: string) =>
      (node: HTMLElement | null) => {
        const previousObserver = observersRef.current.get(key)
        previousObserver?.disconnect()

        if (!node) {
          observersRef.current.delete(key)
          widthMapRef.current.delete(key)
          scheduleMeasure()
          return
        }

        const measure = () => {
          const width = Math.ceil(node.getBoundingClientRect().width)
          widthMapRef.current.set(key, width)
          scheduleMeasure()
        }

        measure()

        const observer = new ResizeObserver(measure)
        observersRef.current.set(key, observer)
        observer.observe(node)
      },
    [scheduleMeasure],
  )

  useEffect(
    () => () => {
      observersRef.current.forEach((observer) => observer.disconnect())
      observersRef.current.clear()
      containerObserverRef.current?.disconnect()
      overflowObserverRef.current?.disconnect()
    },
    [],
  )

  const visibleItems = state.visible
    .map((key) => itemsRef.current.find((item) => item.key === key))
    .filter((item): item is T => Boolean(item))
  const overflowItems = state.overflow
    .map((key) => itemsRef.current.find((item) => item.key === key))
    .filter((item): item is T => Boolean(item))

  return {
    visibleItems,
    overflowItems,
    isOverflowing: overflowItems.length > 0,
    registerContainer,
    registerOverflowToggle,
    registerItem,
  }
}

export default useOverflowNav
