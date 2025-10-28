import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import type { NavItem } from '../types/navigation'

type OverflowResult = {
  containerRef: RefObject<HTMLDivElement>
  registerItem: (key: string, element: HTMLElement | null) => void
  registerOverflowTrigger: (element: HTMLElement | null) => void
  visibleKeys: string[]
  overflowKeys: string[]
  isReady: boolean
}

export interface OverflowComputationItem {
  key: string
  width: number
  isPinned: boolean
}

export interface OverflowComputationResult {
  visibleKeys: string[]
  overflowKeys: string[]
}

export function computeOverflow(
  items: OverflowComputationItem[],
  containerWidth: number,
  overflowTriggerWidth: number,
): OverflowComputationResult {
  if (containerWidth <= 0) {
    return {
      visibleKeys: items.map((item) => item.key),
      overflowKeys: [],
    }
  }

  const totalWidth = items.reduce((sum, item) => sum + item.width, 0)
  if (totalWidth <= containerWidth) {
    return {
      visibleKeys: items.map((item) => item.key),
      overflowKeys: [],
    }
  }

  let budget = containerWidth - overflowTriggerWidth
  if (budget < 0) budget = 0

  const regular = items.filter((item) => !item.isPinned)
  const pinned = items.filter((item) => item.isPinned)
  const removalOrder = [...regular, ...pinned].reverse()

  let runningWidth = items.reduce((sum, item) => sum + item.width, 0)
  const visibleSet = new Set(items.map((item) => item.key))

  for (const item of removalOrder) {
    if (runningWidth <= budget) {
      break
    }
    if (!visibleSet.has(item.key)) continue
    visibleSet.delete(item.key)
    runningWidth -= item.width
  }

  return {
    visibleKeys: items.filter((item) => visibleSet.has(item.key)).map((item) => item.key),
    overflowKeys: items.filter((item) => !visibleSet.has(item.key)).map((item) => item.key),
  }
}

const RESIZE_DEBOUNCE_MS = 90

interface MeasurementEntry {
  element: HTMLElement | null
  width: number
}

export function useOverflowNav(items: NavItem[]): OverflowResult {
  const containerRef = useRef<HTMLDivElement>(null)
  const measurements = useRef<Map<string, MeasurementEntry>>(new Map())
  const overflowTrigger = useRef<MeasurementEntry>({ element: null, width: 0 })
  const frameRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() => items.map((item) => item.key ?? item.label))
  const [overflowKeys, setOverflowKeys] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
    }
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }
    timerRef.current = window.setTimeout(() => {
      frameRef.current = window.requestAnimationFrame(() => {
        calculate()
      })
    }, RESIZE_DEBOUNCE_MS)
  }, [])

  const measureElement = useCallback((entry: MeasurementEntry) => {
    if (typeof window === 'undefined' || !entry.element) return
    const rect = entry.element.getBoundingClientRect()
    const styles = window.getComputedStyle(entry.element)
    const margin = parseFloat(styles.marginLeft || '0') + parseFloat(styles.marginRight || '0')
    entry.width = rect.width + margin
  }, [])

  const calculate = useCallback(() => {
    const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 0
    if (containerWidth === 0) {
      return
    }

    const keys = items.map((item) => item.key ?? item.label)
    const data = items.map((item) => {
      const key = item.key ?? item.label
      const measurement = measurements.current.get(key)
      if (measurement) {
        measureElement(measurement)
      }
      return {
        key,
        width: measurement?.width ?? 0,
        isPinned: Boolean(item.cta || item.align === 'right'),
      }
    })

    if (overflowTrigger.current.element) {
      measureElement(overflowTrigger.current)
    }

    const { visibleKeys: nextVisible, overflowKeys: overflowOrdered } = computeOverflow(
      data,
      containerWidth,
      overflowTrigger.current.width,
    )

    setVisibleKeys(nextVisible.length ? nextVisible : keys)
    setOverflowKeys(overflowOrdered)
    setIsReady(true)
  }, [items, measureElement])

  const registerItem = useCallback(
    (key: string, element: HTMLElement | null) => {
      const safeKey = key
      const existing = measurements.current.get(safeKey)
      if (existing) {
        existing.element = element
      } else {
        measurements.current.set(safeKey, { element, width: 0 })
      }
      if (element) {
        measureElement(measurements.current.get(safeKey)!)
      }
      scheduleMeasure()
    },
    [measureElement, scheduleMeasure],
  )

  const registerOverflowTrigger = useCallback(
    (element: HTMLElement | null) => {
      overflowTrigger.current.element = element
      if (element) {
        measureElement(overflowTrigger.current)
      }
      scheduleMeasure()
    },
    [measureElement, scheduleMeasure],
  )

  useEffect(() => {
    scheduleMeasure()
  }, [items, scheduleMeasure])

  useEffect(() => {
    const keys = new Set(items.map((item) => item.key ?? item.label))
    Array.from(measurements.current.keys()).forEach((key) => {
      if (!keys.has(key)) {
        measurements.current.delete(key)
      }
    })
  }, [items])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => {
      scheduleMeasure()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [scheduleMeasure])

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  return useMemo(
    () => ({
      containerRef,
      registerItem,
      registerOverflowTrigger,
      visibleKeys,
      overflowKeys,
      isReady,
    }),
    [visibleKeys, overflowKeys, registerItem, registerOverflowTrigger, isReady],
  )
}
