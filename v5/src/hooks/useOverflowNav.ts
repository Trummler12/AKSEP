import { useEffect, useMemo, useRef, useState } from 'react'

export interface OverflowItem {
  key: string
  width: number
  pinned?: boolean
}

export interface OverflowCalculationInput {
  items: OverflowItem[]
  containerWidth: number
  overflowTriggerWidth: number
}

export interface OverflowCalculationResult {
  visible: string[]
  overflow: string[]
}

export function calculateOverflow({ items, containerWidth, overflowTriggerWidth }: OverflowCalculationInput): OverflowCalculationResult {
  const ordered = items
  const initialVisible = ordered.map((item) => item.key)
  if (containerWidth <= 0) {
    return { visible: initialVisible, overflow: [] }
  }

  const totalWidth = ordered.reduce((sum, item) => sum + item.width, 0)
  if (totalWidth <= containerWidth) {
    return { visible: initialVisible, overflow: [] }
  }

  const widthMap = new Map(ordered.map((item) => [item.key, item.width]))
  const regular = ordered.filter((item) => !item.pinned)
  const pinned = ordered.filter((item) => item.pinned)
  const removalOrder = [...regular.map((item) => item.key).reverse(), ...pinned.map((item) => item.key).reverse()]

  let currentVisible = [...initialVisible]
  const overflow: string[] = []
  let requiredWidth = totalWidth
  let availableWidth = containerWidth

  for (const key of removalOrder) {
    const width = widthMap.get(key) ?? 0
    requiredWidth -= width
    currentVisible = currentVisible.filter((itemKey) => itemKey !== key)
    overflow.push(key)
    availableWidth = containerWidth - overflowTriggerWidth
    if (requiredWidth <= availableWidth) {
      break
    }
  }

  const orderMap = new Map(ordered.map((item, index) => [item.key, index]))
  overflow.sort((a, b) => (orderMap.get(a) ?? 0) - (orderMap.get(b) ?? 0))

  return { visible: currentVisible, overflow }
}

export interface UseOverflowNavOptions {
  items: OverflowItem[]
  containerRef: React.RefObject<HTMLElement | null>
  overflowTriggerWidth?: number
  debounceMs?: number
}

type TestWindow = Window & { __forceOverflowWidth?: number }

export function useOverflowNav({
  items,
  containerRef,
  overflowTriggerWidth = 64,
  debounceMs = 80,
}: UseOverflowNavOptions) {
  const [containerWidth, setContainerWidth] = useState(0)
  const frame = useRef<number | null>(null)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    const forcedWidth =
      typeof window !== 'undefined' ? (window as TestWindow).__forceOverflowWidth : undefined
    if (typeof forcedWidth === 'number') {
      setContainerWidth(forcedWidth)
      return
    }

    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      if (timeout.current !== null) window.clearTimeout(timeout.current)
      timeout.current = window.setTimeout(() => {
        if (frame.current !== null) cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(() => {
          setContainerWidth(entry.contentRect.width)
        })
      }, debounceMs)
    })

    observer.observe(node)
    setContainerWidth(node.getBoundingClientRect().width)

    return () => {
      observer.disconnect()
      if (timeout.current !== null) {
        window.clearTimeout(timeout.current)
        timeout.current = null
      }
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current)
        frame.current = null
      }
    }
  }, [containerRef, debounceMs])

  const result = useMemo(
    () => calculateOverflow({ items, containerWidth, overflowTriggerWidth }),
    [items, containerWidth, overflowTriggerWidth],
  )

  return { ...result, containerWidth }
}

export default useOverflowNav
