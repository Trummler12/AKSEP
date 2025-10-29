import '@testing-library/jest-dom'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const ResizeObserverImplementation =
  globalThis.ResizeObserver ?? (ResizeObserverMock as unknown as typeof ResizeObserver)

globalThis.ResizeObserver = ResizeObserverImplementation
