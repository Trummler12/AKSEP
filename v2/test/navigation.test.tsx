import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Router } from '../src/components/routing/Router'
import { Navigation } from '../src/components/navigation/Navigation'
import useOverflowNav from '../src/hooks/useOverflowNav'

const resizeCallbacks = new Map<Element, ResizeObserverCallback>()

class MockResizeObserver {
  private callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    resizeCallbacks.set(target, this.callback)
  }

  unobserve(target: Element) {
    resizeCallbacks.delete(target)
  }

  disconnect() {
    resizeCallbacks.clear()
  }
}

declare global {
  interface Window {
    ResizeObserver: typeof MockResizeObserver
  }
}

beforeAll(() => {
  // @ts-expect-error assigning mock implementation
  global.ResizeObserver = MockResizeObserver
})

afterEach(() => {
  cleanup()
  resizeCallbacks.clear()
  vi.useRealTimers()
  vi.clearAllTimers()
})

function setElementWidth(element: HTMLElement, width: number) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ width, height: 0, top: 0, left: 0, right: width, bottom: 0 }),
  })
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width })
}

function triggerResize(element: Element, width: number) {
  const callback = resizeCallbacks.get(element)
  if (callback) {
    callback([
      {
        target: element as Element,
        contentRect: { width, height: 0, x: 0, y: 0, top: 0, left: 0, bottom: 0, right: width },
      } as ResizeObserverEntry,
    ])
  }
}

describe('useOverflowNav', () => {
  test('moves items into overflow from right to left', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useOverflowNav([
        { key: 'begriffe' },
        { key: 'programm' },
        { key: 'mitmachen' },
      ]),
    )

    const container = document.createElement('div')
    setElementWidth(container, 360)

    act(() => {
      result.current.containerRef(container)
      triggerResize(container, 360)
    })

    const widths = [130, 140, 150]
    ;['begriffe', 'programm', 'mitmachen'].forEach((key, index) => {
      const element = document.createElement('div')
      setElementWidth(element, widths[index])
      act(() => {
        result.current.registerItem(key)(element)
        triggerResize(element, widths[index])
      })
    })

    const overflowButton = document.createElement('button')
    setElementWidth(overflowButton, 56)
    act(() => {
      result.current.registerOverflowTrigger(overflowButton)
      triggerResize(overflowButton, 56)
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current.visibleKeys).toEqual(['begriffe', 'programm'])
    expect(result.current.overflowKeys).toEqual(['mitmachen'])
  })

  test('keeps pinned items visible until last', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useOverflowNav([
        { key: 'one' },
        { key: 'two', pinned: true },
        { key: 'three' },
      ]),
    )

    const container = document.createElement('div')
    setElementWidth(container, 220)

    act(() => {
      result.current.containerRef(container)
      triggerResize(container, 220)
    })

    const widths = [120, 120, 120]
    ;['one', 'two', 'three'].forEach((key, index) => {
      const element = document.createElement('div')
      setElementWidth(element, widths[index])
      act(() => {
        result.current.registerItem(key)(element)
        triggerResize(element, widths[index])
      })
    })

    const overflowButton = document.createElement('button')
    setElementWidth(overflowButton, 56)
    act(() => {
      result.current.registerOverflowTrigger(overflowButton)
      triggerResize(overflowButton, 56)
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current.visibleKeys).toEqual(['two'])
    expect(result.current.overflowKeys).toEqual(['three', 'one'])
  })
})

describe('Router redirect', () => {
  test('redirects / to /.start', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>,
    )

    await waitFor(() =>
      expect(
        screen.getByRole('heading', {
          name: 'Für eine informierte und transparente Politik',
          level: 1,
        }),
      ).toBeInTheDocument(),
    )
  })
})

describe('Navigation keyboard interactions', () => {
  test('opens dropdown with keyboard and closes on escape', () => {
    vi.useFakeTimers()
    render(
      <MemoryRouter>
        <Navigation currentPath="/.start" />
      </MemoryRouter>,
    )

    const container = document.querySelector('.navigation__inner') as HTMLElement
    setElementWidth(container, 900)
    act(() => triggerResize(container, 900))

    const overflowTrigger = document.querySelector(
      '.navigation__overflow-trigger',
    ) as HTMLElement
    setElementWidth(overflowTrigger, 60)
    act(() => triggerResize(overflowTrigger, 60))

    const items = Array.from(document.querySelectorAll('.navigation__item')) as HTMLElement[]
    items.forEach((item) => {
      setElementWidth(item, 140)
      act(() => triggerResize(item, 140))
    })

    act(() => {
      vi.runAllTimers()
    })

    const begriffeTrigger = screen.getByRole('menuitem', { name: 'Begriffe' })
    act(() => {
      begriffeTrigger.focus()
    })
    expect(begriffeTrigger).toHaveFocus()

    act(() => {
      fireEvent.keyDown(begriffeTrigger, { key: 'ArrowDown' })
      vi.runAllTimers()
    })

    const firstItem = document.activeElement as HTMLElement
    expect(firstItem).toHaveAttribute('data-nav-subitem', 'true')
    expect(firstItem).toHaveTextContent('Begriffe')

    act(() => {
      fireEvent.keyDown(firstItem, { key: 'Escape' })
      vi.runAllTimers()
    })
    expect(begriffeTrigger).toHaveFocus()
  })
})
