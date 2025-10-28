import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import NavigationItem from '../src/components/navigation/NavigationItem'
import type { NavItem } from '../src/types/navigation'

const originalRAF = global.requestAnimationFrame

if (!('matchMedia' in window)) {
  const createMatchMedia = (matches: boolean): MediaQueryList => ({
    matches,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: () => createMatchMedia(false),
  })
}

describe('Navigation keyboard interactions', () => {
  beforeAll(() => {
    global.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      cb(performance.now())
      return 0
    }
  })

  afterAll(() => {
    global.requestAnimationFrame = originalRAF
  })

  const navItem: NavItem = {
    key: 'programm',
    label: 'Programm',
    href: '/programm',
    groups: [
      {
        key: 'group',
        items: [
          { label: 'Präambel', href: '/praeambel' },
          { label: 'AG Bildung', href: '/programm/bildung' },
        ],
      },
    ],
  }

  function Harness() {
    const [active, setActive] = useState<string | null>(null)
    return (
      <ul role="menubar">
        <NavigationItem
          item={navItem}
          isActive={false}
          registerItem={() => () => {}}
          onRequestCloseAll={setActive}
          currentPath="/"
          activeDropdownKey={active}
        />
      </ul>
    )
  }

  it('opens submenu with keyboard and closes with Escape', async () => {
    render(
      <MemoryRouter>
        <Harness />
      </MemoryRouter>,
    )

    const trigger = screen.getByRole('menuitem', { name: 'Programm' })
    fireEvent.focus(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    const firstSubItem = screen.getByRole('menuitem', { name: 'Präambel' })
    expect(firstSubItem).toHaveFocus()

    fireEvent.keyDown(firstSubItem, { key: 'ArrowDown' })
    const secondSubItem = screen.getByRole('menuitem', { name: 'AG Bildung' })
    expect(secondSubItem).toHaveFocus()

    fireEvent.keyDown(secondSubItem, { key: 'Escape' })
    expect(trigger).toHaveFocus()
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
  })
})
