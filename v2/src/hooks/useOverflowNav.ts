import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface OverflowItemConfig {
  key: string
  pinned?: boolean
}

interface OverflowState {
  visibleKeys: string[]
  overflowKeys: string[]
}

interface UseOverflowNavResult {
  containerRef: (node: HTMLDivElement | null) => void
  registerItem: (key: string) => (node: HTMLElement | null) => void
  registerOverflowTrigger: (node: HTMLElement | null) => void
  visibleKeys: string[]
  overflowKeys: string[]
  isOverflowing: boolean
}

const FALLBACK_OVERFLOW_WIDTH = 56

export function useOverflowNav(items: OverflowItemConfig[]): UseOverflowNavResult {
  const [state, setState] = useState<OverflowState>(() => ({
    visibleKeys: items.map((item) => item.key),
    overflowKeys: [],
  }))
  const container = useRef<HTMLDivElement | null>(null)
  const containerObserver = useRef<ResizeObserver | null>(null)
  const itemObservers = useRef(new Map<string, ResizeObserver>())
  const itemWidths = useRef(new Map<string, number>())
  const overflowTriggerObserver = useRef<ResizeObserver | null>(null)
  const overflowTriggerWidth = useRef<number>(FALLBACK_OVERFLOW_WIDTH)
  const debugOverride = useRef<string[] | null>(null)
  const pinnedKeys = useMemo(() => {
    return new Set(items.filter((item) => item.pinned).map((item) => item.key))
  }, [items])

  const commitState = useCallback((visible: string[], overflow: string[]) => {
    setState((prev) => {
      const sameVisible =
        prev.visibleKeys.length === visible.length &&
        prev.visibleKeys.every((key, index) => key === visible[index])
      const sameOverflow =
        prev.overflowKeys.length === overflow.length &&
        prev.overflowKeys.every((key, index) => key === overflow[index])

      if (sameVisible && sameOverflow) {
        return prev
      }

      return { visibleKeys: visible, overflowKeys: overflow }
    })
  }, [])

  const calculateOverflow = useCallback(() => {
    const containerNode = container.current
    if (!containerNode) {
      return
    }
    const containerWidth = containerNode.getBoundingClientRect().width
    if (!containerWidth) {
      return
    }

    const orderedKeys = items.map((item) => item.key)

    const overrideKeys = debugOverride.current
    if (overrideKeys && overrideKeys.length > 0) {
      const sanitizedOverflow = orderedKeys.filter((key) => overrideKeys.includes(key))
      if (sanitizedOverflow.length === 0) {
        debugOverride.current = null
      } else {
        const visible = orderedKeys.filter((key) => !sanitizedOverflow.includes(key))
        commitState(visible, sanitizedOverflow)
        return
      }
    }

    const totalWidth = orderedKeys.reduce((sum, key) => sum + (itemWidths.current.get(key) ?? 0), 0)

    if (totalWidth <= containerWidth) {
      commitState(orderedKeys, [])
      return
    }

    const overflowWidth = overflowTriggerWidth.current || FALLBACK_OVERFLOW_WIDTH
    const targetWidth = containerWidth - overflowWidth

    const reversedItems = [...items].reverse()
    const removalOrder = [
      ...reversedItems.filter((item) => !pinnedKeys.has(item.key)),
      ...reversedItems.filter((item) => pinnedKeys.has(item.key)),
    ]

    const overflowKeys: string[] = []
    let workingWidth = totalWidth

    for (const item of removalOrder) {
      if (workingWidth <= targetWidth) {
        break
      }
      overflowKeys.push(item.key)
      workingWidth -= itemWidths.current.get(item.key) ?? 0
    }

    const visibleKeys = orderedKeys.filter((key) => !overflowKeys.includes(key))

    commitState(visibleKeys, overflowKeys)
  }, [commitState, items, pinnedKeys])

  const resizeTimeout = useRef<number | null>(null)

  const clearResizeTimeout = useCallback(() => {
    if (resizeTimeout.current !== null) {
      window.clearTimeout(resizeTimeout.current)
      resizeTimeout.current = null
    }
  }, [])

  const scheduleUpdate = useCallback(() => {
    clearResizeTimeout()
    resizeTimeout.current = window.setTimeout(() => {
      resizeTimeout.current = null
      calculateOverflow()
    }, 50)
  }, [calculateOverflow, clearResizeTimeout])

  useEffect(() => {
    const containerObs = containerObserver.current
    const overflowObs = overflowTriggerObserver.current
    const itemObs = itemObservers.current
    return () => {
      clearResizeTimeout()
      containerObs?.disconnect()
      overflowObs?.disconnect()
      itemObs.forEach((observer) => observer.disconnect())
      itemObs.clear()
    }
  }, [clearResizeTimeout])

  useEffect(() => {
    scheduleUpdate()
  }, [items, scheduleUpdate])

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (containerObserver.current) {
        containerObserver.current.disconnect()
      }
      container.current = node
      if (node) {
        containerObserver.current = new ResizeObserver(() => scheduleUpdate())
        containerObserver.current.observe(node)
        scheduleUpdate()
      }
    },
    [scheduleUpdate],
  )

  const observeItem = useCallback(
    (key: string, node: HTMLElement | null) => {
      const previousObserver = itemObservers.current.get(key)
      if (previousObserver) {
        previousObserver.disconnect()
        itemObservers.current.delete(key)
      }
      if (!node) {
        scheduleUpdate()
        return
      }

      itemWidths.current.set(key, Math.ceil(node.getBoundingClientRect().width))
      const observer = new ResizeObserver((entries) => {
        const [entry] = entries
        const width = Math.ceil(entry.contentRect.width)
        if (itemWidths.current.get(key) !== width) {
          itemWidths.current.set(key, width)
          scheduleUpdate()
        }
      })
      observer.observe(node)
      itemObservers.current.set(key, observer)
      scheduleUpdate()
    },
    [scheduleUpdate],
  )

  const registerItem = useCallback(
    (key: string) => (node: HTMLElement | null) => observeItem(key, node),
    [observeItem],
  )

  const registerOverflowTrigger = useCallback(
    (node: HTMLElement | null) => {
      overflowTriggerObserver.current?.disconnect()
      if (!node) {
        overflowTriggerWidth.current = FALLBACK_OVERFLOW_WIDTH
        scheduleUpdate()
        return
      }
      overflowTriggerWidth.current = Math.ceil(node.getBoundingClientRect().width)
      overflowTriggerObserver.current = new ResizeObserver((entries) => {
        const [entry] = entries
        const width = Math.ceil(entry.contentRect.width)
        if (overflowTriggerWidth.current !== width) {
          overflowTriggerWidth.current = width
          scheduleUpdate()
        }
      })
      overflowTriggerObserver.current.observe(node)
      scheduleUpdate()
    },
    [scheduleUpdate],
  )

  const applyDebugOverride = useCallback(
    (keys: string[] | null) => {
      const orderedKeys = items.map((item) => item.key)
      const uniqueKeys = keys ? Array.from(new Set(keys)) : []
      const sanitizedOverflow = uniqueKeys.filter((key) => orderedKeys.includes(key))

      if (sanitizedOverflow.length === 0) {
        debugOverride.current = null
        scheduleUpdate()
        return
      }

      debugOverride.current = sanitizedOverflow
      const visible = orderedKeys.filter((key) => !sanitizedOverflow.includes(key))
      commitState(visible, sanitizedOverflow)
    },
    [commitState, items, scheduleUpdate],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const win = window as typeof window & {
      __AKSEP_OVERFLOW_DEBUG?: { setOverflow: (keys: string[] | null) => void }
    }
    const api = {
      setOverflow(keys: string[] | null) {
        applyDebugOverride(keys)
      },
    }
    win.__AKSEP_OVERFLOW_DEBUG = api
    return () => {
      if (win.__AKSEP_OVERFLOW_DEBUG === api) {
        delete win.__AKSEP_OVERFLOW_DEBUG
      }
    }
  }, [applyDebugOverride])

  return {
    containerRef,
    registerItem,
    registerOverflowTrigger,
    visibleKeys: state.visibleKeys,
    overflowKeys: state.overflowKeys,
    isOverflowing: state.overflowKeys.length > 0,
  }
}

export default useOverflowNav
