import { MoreHorizontal, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../ui/utils';
import type { NavItem } from '../../types/navigation';

import '@/styles/components/navigation/nav-overflow.css';

interface NavOverflowProps {
  overflowItems: NavItem[];
  openOverflowSections: string[];
  onToggleOverflowSection: (key: string) => void;
  overflowTriggerRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Overflow navigation component for responsive navigation
 * Handles items that don't fit in the main navigation bar
 */
export const NavOverflow = ({
  overflowItems,
  openOverflowSections,
  onToggleOverflowSection,
  overflowTriggerRef,
}: NavOverflowProps) => {
  if (overflowItems.length === 0) return null;

  return (
    <div className="nav-overflow-wrapper">
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={overflowTriggerRef}
          className="nav-overflow-trigger"
        >
          <MoreHorizontal className="nav-dropdown-icon" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="nav-overflow-content"
          style={{ width: 'max-content', maxWidth: '13rem' }}
        >
          {overflowItems.map((item) => {
            const isOpen = openOverflowSections.includes(item.key);
            const hasGroups = Boolean(item.groups?.length);

            return (
              <div key={item.key} className="nav-overflow-scroll">
                {hasGroups ? (
                  <div className="nav-stack-space-2">
                    <button
                      type="button"
                      onClick={() => onToggleOverflowSection(item.key)}
                      className="nav-overflow-button"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'nav-dropdown-toggle',
                          isOpen ? 'nav-dropdown-open-state' : ''
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'nav-overflow-submenu',
                        isOpen ? 'block' : 'hidden'
                      )}
                    >
                      {item.groups?.map((group) => (
                        <div
                          key={group.key}
                          className={cn(
                            'nav-overflow-submenu-stack',
                            group.showTopBorder && 'nav-overflow-top-divider',
                            group.showBottomBorder && 'nav-overflow-bottom-divider'
                          )}
                        >
                          {group.title && (
                            <p className="nav-overflow-group-label">
                              {group.title}
                            </p>
                          )}
                          {group.items.map((child) => (
                            <DropdownMenuItem
                              key={child.href}
                              asChild
                              className="nav-overflow-description"
                            >
                              <a href={child.href} className="nav-overflow-full-width">
                                {child.label}
                              </a>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <DropdownMenuItem asChild className="nav-overflow-secondary-text">
                    <a href={item.href} className="nav-overflow-full-width">
                      {item.label}
                    </a>
                  </DropdownMenuItem>
                )}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
