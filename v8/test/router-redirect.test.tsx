import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Router from '../src/components/routing/Router'

describe('Router redirect', () => {
  const LocationDisplay = () => {
    const location = useLocation()
    return <div data-testid="location">{location.pathname}</div>
  }

  it('redirects / to /.start', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Router />
        <LocationDisplay />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/.start')
    })
  })
})
