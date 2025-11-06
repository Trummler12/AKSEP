import { ChevronDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';
import type { NavigationController } from '@/hooks/useNavigationController';

import '@/styles/components/navbar/navbar-overflow.css';

interface NavbarOverflowMenuProps {
  controller: NavigationController;
}

export const NavbarOverflowMenu = ({ controller }: NavbarOverflowMenuProps) => {
  if (controller.overflowEntries.length === 0) {
    return null;
  }

  return (
    <div className="nav-overflow-wrapper">
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={controller.overflowTriggerRef}
          className="nav-overflow-trigger"
        >
          <MoreHorizontal className="nav-dropdown-icon" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="nav-overflow-content"
          style={{ width: 'max-content', maxWidth: '13rem' }}
        >
          {controller.overflowItems.map((item) => {
            const isOpen = controller.navigationState.openOverflowSections.includes(item.key);
            const hasGroups = Boolean(item.groups?.length);

            return (
              <div key={item.key} className="nav-overflow-scroll">
                {hasGroups ? (
                  <div className="nav-stack-space-2">
                    <button
                      type="button"
                      onClick={() => controller.toggleOverflowSection(item.key)}
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

          {controller.overflowActions.length > 0 && (
            <div className="nav-overflow-actions">
              {controller.overflowActions.map((action) => (
                <DropdownMenuItem key={action.key} asChild className="nav-overflow-secondary-text">
                  <a href={action.href} className="nav-overflow-full-width">
                    {action.label}
                  </a>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
