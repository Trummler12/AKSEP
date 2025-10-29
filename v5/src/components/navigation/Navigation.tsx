import { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/components/navigation.css'
import { getPrimaryNavItems } from '../../data/navigation'
import type { NavItem } from '../../types/navigation'
import useOverflowNav from '../../hooks/useOverflowNav'
import NavigationItem from './NavigationItem'
import OverflowNavigation from './OverflowNavigation'
import Tooltip from '../ui/tooltip'
import Icon from '../ui/icon'

const primaryItems = getPrimaryNavItems()

export default function Navigation() {
  const containerRef = useRef<HTMLUListElement | null>(null)
  const [itemWidths, setItemWidths] = useState<Record<string, number>>({})
  const [overflowTriggerWidth, setOverflowTriggerWidth] = useState(72)
  const [openKey, setOpenKey] = useState<string | null>(null)

  const itemsWithWidths = useMemo(
    () =>
      primaryItems.map((item) => ({
        key: item.key ?? item.label,
        width: itemWidths[item.key ?? item.label] ?? 0,
        pinned: item.cta,
      })),
    [itemWidths],
  )

  const { visible, overflow } = useOverflowNav({
    items: itemsWithWidths,
    containerRef,
    overflowTriggerWidth,
  })

  const visibleItems = useMemo(
    () => filterItems(primaryItems, visible),
    [visible],
  )
  const overflowItems = useMemo(
    () => filterItems(primaryItems, overflow),
    [overflow],
  )

  const handleMeasure = useCallback((key: string, width: number) => {
    setItemWidths((prev) => {
      if (Math.abs((prev[key] ?? 0) - width) < 1) return prev
      return { ...prev, [key]: width }
    })
  }, [])

  const closeAll = useCallback(() => setOpenKey(null), [])

  return (
    <nav className="nav" aria-label="Hauptnavigation">
      <div className="container nav__inner">
        <div className="nav__brand">
          <Tooltip content="Zur Startseite" placement="bottom">
            <Link to="/.start" className="nav__logo" aria-label="Zur Startseite">
              <span className="nav__logo-mark" aria-hidden="true">
                <Icon name="Globe" size={28} />
              </span>
              <span className="nav__logo-text">DIE AKSEP</span>
            </Link>
          </Tooltip>
        </div>
        <div className="nav__primary">
          <ul className="nav__list" ref={containerRef}>
            {visibleItems.map((item) => (
              <NavigationItem
                key={item.key ?? item.label}
                item={item}
                isOpen={openKey === (item.key ?? item.label)}
                onOpenChange={(key, open) => setOpenKey(open ? key : null)}
                onMeasure={handleMeasure}
                onRequestCloseAll={closeAll}
              />
            ))}
          </ul>
          <OverflowNavigation
            overflowItems={overflowItems}
            allItems={primaryItems}
            onNavigate={closeAll}
            onOverflowButtonMeasure={setOverflowTriggerWidth}
          />
        </div>
      </div>
    </nav>
  )
}

function filterItems(items: NavItem[], keys: string[]) {
  const keySet = new Set(keys)
  return items.filter((item) => keySet.has(item.key ?? item.label))
}
