import { ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import type { NavItem } from '../../types/navigation';
import { isPathActive } from '../../utils/navigation';

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
      className="group relative flex h-full items-center"
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
      
      {hasGroups && <div aria-hidden className="absolute left-0 top-full h-2 w-full" />}
      
      {hasGroups && activeDropdown === item.key && (
        <div
          className="absolute left-0 top-full z-50 mt-3 w-fit max-w-[13rem] rounded-md border border-border bg-card py-3 shadow-lg"
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
                  <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.title}
                  </p>
                )}
                <div className="mt-1 space-y-1">
                  {group.items.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-2 py-2 text-sm leading-snug text-foreground transition-colors hover:bg-muted hover:text-primary"
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