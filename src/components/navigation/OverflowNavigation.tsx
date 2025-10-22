import { MoreHorizontal, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../ui/utils';
import type { NavItem } from '../../types/navigation';

interface OverflowNavigationProps {
  overflowItems: NavItem[];
  openOverflowSections: string[];
  onToggleOverflowSection: (key: string) => void;
  overflowTriggerRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Overflow navigation component for responsive navigation
 * Handles items that don't fit in the main navigation bar
 */
export const OverflowNavigation = ({
  overflowItems,
  openOverflowSections,
  onToggleOverflowSection,
  overflowTriggerRef,
}: OverflowNavigationProps) => {
  if (overflowItems.length === 0) return null;

  return (
    <div className="relative flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={overflowTriggerRef}
          className="inline-flex h-10 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors hover:bg-muted/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-h-96 w-fit max-w-[13rem] overflow-y-auto p-3"
          style={{ width: 'max-content', maxWidth: '13rem' }}
        >
          {overflowItems.map((item) => {
            const isOpen = openOverflowSections.includes(item.key);
            const hasGroups = Boolean(item.groups?.length);

            return (
              <div key={item.key} className="py-1">
                {hasGroups ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => onToggleOverflowSection(item.key)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isOpen ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'space-y-1 rounded-md bg-muted/20 px-2 py-2',
                        isOpen ? 'block' : 'hidden'
                      )}
                    >
                      {item.groups?.map((group) => (
                        <div
                          key={group.key}
                          className={cn(
                            'space-y-1 px-1',
                            group.showTopBorder && 'pt-2 border-t border-border/60',
                            group.showBottomBorder && 'pb-2 border-b border-border/60'
                          )}
                        >
                          {group.title && (
                            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {group.title}
                            </p>
                          )}
                          {group.items.map((child) => (
                            <DropdownMenuItem
                              key={child.href}
                              asChild
                              className="whitespace-normal leading-snug"
                            >
                              <a href={child.href} className="w-full">
                                {child.label}
                              </a>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <DropdownMenuItem asChild className="leading-snug">
                    <a href={item.href} className="w-full">
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