import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NavigationItem from '../src/components/navigation/NavigationItem'
import { navigationItems } from '../src/data/navigation'
import { useState } from 'react'

function setupItem(key: string) {
  const item = navigationItems.find((entry) => entry.key === key)!
  const registerItem = () => {}

  function Wrapper() {
    const [openKey, setOpenKey] = useState<string | null>(null)
    return (
      <NavigationItem
        item={item}
        isOpen={openKey === (item.key ?? item.label)}
        onOpenChange={setOpenKey}
        currentPath="/"
        registerItem={registerItem}
      />
    )
  }

  return (
    <MemoryRouter>
      <Wrapper />
    </MemoryRouter>
  )
}

describe('NavigationItem keyboard interactions', () => {
  it('opens on ArrowDown and restores focus on Escape', async () => {
    const user = userEvent.setup()
    render(setupItem('programm'))

    const trigger = screen.getByRole('menuitem', { name: 'Programm' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')

    const firstMenuItem = await screen.findByRole('menuitem', { name: 'Präambel' })
    expect(firstMenuItem).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
