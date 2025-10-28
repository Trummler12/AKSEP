import { renderHook, act } from '@testing-library/react'
import useOverflowNav from '../src/hooks/useOverflowNav'
import type { NavItem } from '../src/types/navigation'

class MockResizeObserver {
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  observe(target: Element) {
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  writable: true,
  value: MockResizeObserver,
})

describe('useOverflowNav', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  const createElementWithWidth = (width: number) => {
    const el = document.createElement('div')
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ width, height: 40, top: 0, left: 0, right: width, bottom: 40 }),
    })
    Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true })
    return el
  }

  const createContainer = (width: number) => {
    const el = document.createElement('div')
    Object.defineProperty(el, 'clientWidth', { value: width, configurable: true })
    return el
  }

  const baseItems: NavItem[] = [
    { key: 'a', label: 'A', href: '/a' },
    { key: 'b', label: 'B', href: '/b' },
    { key: 'c', label: 'C', href: '/c', cta: true },
  ]

  it('keeps CTA visible until last overflowed item', async () => {
    const { result } = renderHook(() => useOverflowNav(baseItems))

    const container = createContainer(260)
    act(() => {
      result.current.containerRef(container)
    })

    const overflowButton = createElementWithWidth(40)
    act(() => {
      result.current.registerOverflowTrigger(overflowButton)
    })

    const widths = { a: 90, b: 90, c: 90 }
    act(() => {
      for (const item of baseItems) {
        const el = createElementWithWidth(widths[item.key!])
        result.current.registerItem(item.key!)(el)
      }
    })

    await act(async () => {
      vi.runAllTimers()
      await Promise.resolve()
    })

    expect(result.current.visibleKeys).toEqual(['a', 'c'])
    expect(result.current.overflowKeys).toEqual(['b'])
  })

  it('moves all items to overflow when space is limited', async () => {
    const { result } = renderHook(() => useOverflowNav(baseItems))

    const container = createContainer(80)
    act(() => {
      result.current.containerRef(container)
    })

    const overflowButton = createElementWithWidth(40)
    act(() => {
      result.current.registerOverflowTrigger(overflowButton)
    })

    const widths = { a: 70, b: 70, c: 70 }
    act(() => {
      for (const item of baseItems) {
        const el = createElementWithWidth(widths[item.key!])
        result.current.registerItem(item.key!)(el)
      }
    })

    await act(async () => {
      vi.runAllTimers()
      await Promise.resolve()
    })

    expect(result.current.visibleKeys).toEqual([])
    expect(result.current.overflowKeys).toEqual(['a', 'b', 'c'])
  })
})
