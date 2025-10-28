import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import Router from '../src/components/routing/Router'

describe('Router', () => {
  beforeEach(() => {
    class StubResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    vi.stubGlobal('ResizeObserver', StubResizeObserver)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(16)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('redirects root path to /.start', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
      </MemoryRouter>
    )

    const heroHeading = await screen.findByRole('heading', {
      name: /Informationspolitik als Hauptfokus/i
    })

    expect(heroHeading).toBeInTheDocument()
  })
})
