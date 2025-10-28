import '@testing-library/jest-dom'

class TestResizeObserver implements ResizeObserver {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    this.callback([{ target } as ResizeObserverEntry], this)
  }

  unobserve(): void {}

  disconnect(): void {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: TestResizeObserver,
})
