import { MemoryRouter, useLocation } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Router from '../src/components/routing/Router'

function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

describe('App router', () => {
  it('redirects from / to /.start', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
        <LocationDisplay />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/.start'))
  })
})
