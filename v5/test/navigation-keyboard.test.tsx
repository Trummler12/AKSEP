import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navigation from '../src/components/navigation/Navigation'

describe('Navigation keyboard controls', () => {
  it('allows arrow navigation inside dropdown and closes on escape', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    )

    const trigger = screen.getByRole('button', { name: /Begriffe/i })
    trigger.focus()

    await user.keyboard('{ArrowDown}')
    const firstItem = await screen.findByRole('menuitem', { name: /Warum Begriffklärungen wichtig sind/i })
    expect(firstItem).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: /Rechts vs. Links/i })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
