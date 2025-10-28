import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'

interface OverflowItem {
  key: string
  isPinned?: boolean
}

interface UseOverflowNavOptions {
  items: OverflowItem[]
}

interface UseOverflowNavResult {
  containerRef: MutableRefObject<HTMLElement | null>
  overflowTriggerRef: MutableRefObject<HTMLButtonElement | null>
  getItemRef: (key: string) => (node: HTMLLIElement | null) => void
  visibleKeys: string[]
  overflowKeys: string[]
}

const getGapValue = (element: HTMLElement) => {
  const styles = getComputedStyle(element)
  const gap = parseFloat(styles.gap || styles.columnGap || '0')

  return Number.isNaN(gap) ? 0 : gap
}

const sumWidths = (keys: string[], itemWidths: Map<string, number>, gap: number) => {
  const totalWidths = keys.reduce((total, key) => {
    const width = itemWidths.get(key) ?? 0
    return total + width
  }, 0)

  const gapWidth = gap * Math.max(keys.length - 1, 0)

  return totalWidths + gapWidth
}

interface OverflowComputationInput {
  orderedKeys: string[]
  pinnedKeys: string[]
  itemWidths: Map<string, number>
  gap: number
  availableWidth: number
}

const calculateOverflowKeys = ({ orderedKeys, pinnedKeys, itemWidths, gap, availableWidth }: OverflowComputationInput) => {
  const nonPinnedKeys = orderedKeys.filter((key) => !pinnedKeys.includes(key))
  const evaluationOrder = [...pinnedKeys, ...nonPinnedKeys]
  const overflow: string[] = []

  let totalWidth = sumWidths(evaluationOrder, itemWidths, gap)

  for (let index = evaluationOrder.length - 1; index >= 0; index -= 1) {
    if (totalWidth <= availableWidth) {
      break
    }

    const key = evaluationOrder[index]

    if (!overflow.includes(key)) {
      overflow.push(key)
      const visible = evaluationOrder.filter((candidate) => !overflow.includes(candidate))
      totalWidth = sumWidths(visible, itemWidths, gap)
    }
  }

  return overflow
}

const useOverflowNav = ({ items }: UseOverflowNavOptions): UseOverflowNavResult => {
  const containerRef = useRef<HTMLElement | null>(null)
  const overflowTriggerRef = useRef<HTMLButtonElement | null>(null)
  const itemRefs = useRef(new Map<string, HTMLLIElement | null>())
  const itemWidths = useRef(new Map<string, number>())
  const resizeObserver = useRef<ResizeObserver | null>(null)
  const [overflowKeys, setOverflowKeys] = useState<string[]>([])

  const orderedKeys = useMemo(() => items.map((item) => item.key), [items])
  const pinnedKeys = useMemo(() => items.filter((item) => item.isPinned).map((item) => item.key), [items])

  const measureItem = useCallback((key: string, node: HTMLLIElement | null) => {
    if (!node) {
      itemRefs.current.delete(key)
      itemWidths.current.delete(key)
      return
    }

    itemRefs.current.set(key, node)

    const rect = node.getBoundingClientRect()
    itemWidths.current.set(key, rect.width)
  }, [])

  const computeOverflow = useCallback(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const gap = getGapValue(container)
    const overflowButtonWidth = overflowTriggerRef.current?.getBoundingClientRect().width ?? 0
    const containerWidth = container.getBoundingClientRect().width
    const availableWidth = containerWidth - overflowButtonWidth

    const currentWidths = new Map(itemWidths.current)
    const overflow = calculateOverflowKeys({ orderedKeys, pinnedKeys, itemWidths: currentWidths, gap, availableWidth })

    setOverflowKeys((current) => {
      const isSameLength = current.length === overflow.length
      const hasSameEntries = isSameLength && current.every((key, index) => key === overflow[index])

      if (hasSameEntries) {
        return current
      }

      return overflow
    })
  }, [orderedKeys, pinnedKeys])

  const rafId = useRef<number | null>(null)

  const scheduleMeasurement = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
    }

    rafId.current = requestAnimationFrame(() => {
      computeOverflow()
      rafId.current = null
    })
  }, [computeOverflow])

  const getItemRef = useCallback(
    (key: string) =>
      (node: HTMLLIElement | null) => {
        measureItem(key, node)
        scheduleMeasurement()
      },
    [measureItem, scheduleMeasurement]
  )

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    if (resizeObserver.current) {
      resizeObserver.current.disconnect()
    }

    resizeObserver.current = new ResizeObserver(() => scheduleMeasurement())
    resizeObserver.current.observe(container)

    const cleanup = () => {
      resizeObserver.current?.disconnect()
      resizeObserver.current = null
    }

    window.addEventListener('resize', scheduleMeasurement)

    scheduleMeasurement()

    return () => {
      window.removeEventListener('resize', scheduleMeasurement)
      cleanup()
    }
  }, [scheduleMeasurement])

  const visibleKeys = useMemo(() => orderedKeys.filter((key) => !overflowKeys.includes(key)), [orderedKeys, overflowKeys])

  return {
    containerRef,
    overflowTriggerRef,
    getItemRef,
    visibleKeys,
    overflowKeys
  }
}

export type { OverflowItem, UseOverflowNavOptions, UseOverflowNavResult }
export { calculateOverflowKeys }
export default useOverflowNav
