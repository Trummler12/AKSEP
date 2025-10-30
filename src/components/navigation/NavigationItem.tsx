import { ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import type { NavItem } from '../../types/navigation';

// Import our custom styles
import '../../styles/components/navigation.css';

interface NavigationItemProps {
  item: NavItem;
  isOverflow: boolean;
  isActive: boolean;
  activeDropdown: string | null;
  onMouseEnter: (key: string, hasGroups: boolean) => void;
  onMouseLeave: (key: string, hasGroups: boolean) => void;
  itemRef: (element: HTMLDivElement | null) => void;
}

/**
 * Individual navigation item component
 * Handles both regular items and dropdown items with groups
 */
export const NavigationItem = ({
  item,
  isOverflow,
  isActive,
  activeDropdown,
  onMouseEnter,
  onMouseLeave,
  itemRef,
}: NavigationItemProps) => {
  const hasGroups = Boolean(item.groups?.length);

  return (
    <div
      ref={itemRef}
      className="nav-item-wrapper"
      hidden={isOverflow}
      onMouseEnter={() => onMouseEnter(item.key, hasGroups)}
      onMouseLeave={() => onMouseLeave(item.key, hasGroups)}
    >
      <a
        href={item.href}
        className={cn(
          'nav-item-base',
          isActive ? 'nav-item-active-state' : 'nav-item-default-state'
        )}
      >
        <span>{item.label}</span>
        {hasGroups && <ChevronDown className="nav-dropdown-icon" />}
      </a>

      {hasGroups && <div aria-hidden className="nav-dropdown-spacer" />}

      {hasGroups && activeDropdown === item.key && (
        <div
          className="nav-dropdown-panel"
          style={{ width: 'max-content', maxWidth: '13rem' }}
        >
          <div className="nav-dropdown-scroll">
            {item.groups?.map((group, groupIndex) => (
              <div
                key={group.key}
                className={cn(
                  'nav-dropdown-group-wrapper',
                  group.showTopBorder && 'nav-dropdown-group-top-divider',
                  group.showBottomBorder && 'nav-dropdown-group-bottom-divider',
                  !group.showTopBorder && groupIndex === 0 && 'nav-dropdown-group-first'
                )}
              >
                {group.title && (
                  <p className="nav-dropdown-group-label">
                    {group.title}
                  </p>
                )}
                <div className="nav-dropdown-stack">
                  {group.items.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="nav-dropdown-link"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
