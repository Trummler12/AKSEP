import { ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import type { NavItem } from '@/types/navigation';

import '@/styles/components/navbar/navbar-item.css';
import '@/styles/components/navbar/navbar-dropdown.css';

interface NavbarPrimaryItemProps {
  item: NavItem;
  isActive: boolean;
  isOverflow: boolean;
  activeDropdown: string | null;
  registerRef: (element: HTMLElement | null) => void;
  onMouseEnter: (key: string, hasGroups: boolean) => void;
  onMouseLeave: (key: string, hasGroups: boolean) => void;
}

export const NavbarPrimaryItem = ({
  item,
  isActive,
  isOverflow,
  activeDropdown,
  registerRef,
  onMouseEnter,
  onMouseLeave,
}: NavbarPrimaryItemProps) => {
  const hasGroups = Boolean(item.groups?.length);

  return (
    <div
      ref={registerRef}
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
