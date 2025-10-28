import '@testing-library/jest-dom/vitest'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
import { useState } from 'react'

import NavigationItem from '../src/components/navigation/NavigationItem'
import { navigationItems } from '../src/data/navigation'

const programmableItem = navigationItems.find((item) => item.key === 'programm')

describe('NavigationItem keyboard interactions', () => {
  test('supports arrow navigation and escape to close', async () => {
    const user = userEvent.setup()

    const item = programmableItem

    if (!item) {
      throw new Error('Programm navigation item missing')
    }

    const Harness = () => {
      const [openKey, setOpenKey] = useState<string | null>(null)

      const handleOpen = (key: string) => setOpenKey(key)
      const handleClose = () => setOpenKey(null)

      return (
        <MemoryRouter initialEntries={['/.start']}>
          <ul role="menubar">
            <NavigationItem
              item={item}
              isOpen={openKey === (item.key ?? item.label)}
              onOpen={handleOpen}
              onClose={handleClose}
              registerItem={() => {}}
              activePath="/.start"
            />
          </ul>
        </MemoryRouter>
      )
    }

    render(<Harness />)

    const trigger = await screen.findByRole('menuitem', { name: item.label })

    await user.tab()
    expect(trigger).toHaveFocus()

    await user.keyboard('{ArrowDown}')

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))

    const firstChild = await screen.findByRole('menuitem', { name: 'Präambel' })
    expect(firstChild).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    const secondChild = await screen.findByRole('menuitem', { name: 'AG Regierung' })
    expect(secondChild).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(firstChild).toHaveFocus()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    expect(trigger).toHaveFocus()
  })
})
