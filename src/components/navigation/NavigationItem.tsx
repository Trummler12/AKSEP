import { ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import type { NavItem } from '../../types/navigation';
import { isPathActive } from '../../utils/navigation';

// Import our custom styles
import '../../styles/components/navigation.css';

interface NavigationItemProps {
  item: NavItem;
  currentPath: string;
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
  currentPath,
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
          'flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors',
          isActive
            ? 'bg-muted/40 text-primary'
            : 'text-foreground hover:bg-muted/30 hover:text-primary'
        )}
      >
        <span>{item.label}</span>
        {hasGroups && <ChevronDown className="h-4 w-4" />}
      </a>
      
      {hasGroups && <div aria-hidden className="nav-dropdown-spacer" />}
      
      {hasGroups && activeDropdown === item.key && (
        <div
          className="nav-dropdown-panel"
          style={{ width: 'max-content', maxWidth: '13rem' }}
        >
          <div
            className={cn(
              'max-h-96 overflow-y-auto pr-2',
              item.key === 'programm' ? 'pr-2' : ''
            )}
          >
            {item.groups?.map((group, groupIndex) => (
              <div
                key={group.key}
                className={cn(
                  'px-3',
                  group.showTopBorder && 'mt-2 border-t border-border/60 pt-3',
                  group.showBottomBorder && 'mb-2 border-b border-border/60 pb-3',
                  !group.showTopBorder && groupIndex === 0 && 'pt-1'
                )}
              >
                {group.title && (
                  <p className="nav-dropdown-group-label">
                    {group.title}
                  </p>
                )}
                <div className="mt-1 space-y-1">
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