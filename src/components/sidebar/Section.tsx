import { ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import type { NavItem } from '@/types/navigation';

import '@/styles/components/sidebar/sidebar-section.css';

interface SidebarSectionProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export const SidebarSection = ({ item, isOpen, onToggle, onNavigate }: SidebarSectionProps) => (
  <div className="nav-mobile-item">
    <button
      type="button"
      onClick={onToggle}
      className="nav-mobile-button"
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
      className="nav-mobile-disclosure"
      data-open={isOpen ? 'true' : 'false'}
    >
      {item.groups?.map((group) => (
        <div
          key={group.key}
          className={cn(
            'nav-mobile-group-card',
            group.showTopBorder && 'nav-section-divider-top',
            group.showBottomBorder && 'nav-section-divider-bottom'
          )}
        >
          {group.title && (
            <p className="nav-group-label">
              {group.title}
            </p>
          )}
          <div className="nav-mobile-link-list">
            {group.items.map((child) => (
              <a
                key={child.href}
                href={child.href}
                className="nav-child-link"
                onClick={onNavigate}
              >
                {child.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
