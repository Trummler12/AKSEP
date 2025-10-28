import '@testing-library/jest-dom/vitest'

class StubResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  // @ts-expect-error - provide minimal stub for tests
  window.ResizeObserver = StubResizeObserver
}

if (typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    const handle = window.setTimeout(() => callback(performance.now()), 16)
    return handle as unknown as number
  }
}

if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame !== 'function') {
  window.cancelAnimationFrame = (handle: number) => {
    window.clearTimeout(handle)
  }
}
