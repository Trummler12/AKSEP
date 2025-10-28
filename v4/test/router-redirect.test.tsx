import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppRouter from '../src/components/routing/Router'

function LocationSpy() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

describe('AppRouter', () => {
  it('redirects root path to /.start', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LocationSpy />
        <AppRouter />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/.start')
    })

    expect(screen.getByRole('heading', { name: /Informationspolitik/i })).toBeInTheDocument()
  })
})
