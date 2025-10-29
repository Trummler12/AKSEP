import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '../src/components/navigation/Navigation'

class ResizeObserverMock {
  private callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  observe(target?: Element) {
    setTimeout(() => {
      const entry = {
        target: target ?? (document.createElement('div') as Element),
        contentRect: {
          width: 140,
          height: 40,
          top: 0,
          left: 0,
          bottom: 40,
          right: 140,
          x: 0,
          y: 0,
          toJSON() {},
        },
      } as ResizeObserverEntry
      this.callback([entry], this as unknown as ResizeObserver)
    }, 0)
  }
  disconnect() {}
  unobserve() {}
}

describe('Navigation keyboard accessibility', () => {
  const originalResizeObserver = global.ResizeObserver
  const originalRaf = window.requestAnimationFrame
  const originalCancel = window.cancelAnimationFrame
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect

  beforeAll(() => {
    ;(global as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      const handle = setTimeout(() => cb(performance.now()), 0)
      return handle as unknown as number
    }) as typeof window.requestAnimationFrame
    window.cancelAnimationFrame = ((handle: number) => {
      clearTimeout(handle)
    }) as typeof window.cancelAnimationFrame
    HTMLElement.prototype.getBoundingClientRect = function () {
      return {
        width: 140,
        height: 40,
        top: 0,
        left: 0,
        bottom: 40,
        right: 140,
        x: 0,
        y: 0,
        toJSON() {},
      }
    }
  })

  afterAll(() => {
    if (originalResizeObserver) {
      ;(global as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = originalResizeObserver
    }
    window.requestAnimationFrame = originalRaf
    window.cancelAnimationFrame = originalCancel
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  it('supports keyboard navigation within dropdown menus', async () => {
    render(
      <MemoryRouter initialEntries={['/.start']}>
        <Navigation currentPath="/.start" />
      </MemoryRouter>,
    )

    const menubar = screen.getByRole('menubar') as HTMLElement
    Object.defineProperty(menubar, 'getBoundingClientRect', {
      value: () => ({
        width: 1024,
        height: 48,
        top: 0,
        left: 0,
        bottom: 48,
        right: 1024,
        x: 0,
        y: 0,
        toJSON() {},
      }),
    })

    const triggers = screen.getAllByRole('menuitem', { name: 'Programm' })
    const programmTrigger = triggers[0]

    fireEvent.focus(programmTrigger)
    fireEvent.keyDown(programmTrigger, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(document.activeElement?.textContent).toContain('Programm')
    })

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toContain('Präambel')

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' })
    expect(programmTrigger).toHaveFocus()
  })
})
