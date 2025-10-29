import '@testing-library/jest-dom'

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class ResizeObserverStub implements ResizeObserver {
    private readonly callback: ResizeObserverCallback

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback
    }

    observe(target: Element) {
      const entry = {
        target,
        contentRect: target.getBoundingClientRect(),
      } as ResizeObserverEntry
      this.callback([entry], this)
    }

    unobserve() {}

    disconnect() {}
  }

  ;(window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserverStub
}
