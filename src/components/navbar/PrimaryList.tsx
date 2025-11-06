import type { NavigationController } from '@/hooks/useNavigationController';
import type { NavPrimaryEntry, OverflowEntry } from '@/types/navigation';
import { isPathActive } from '@/utils/navigation';
import { NavbarPrimaryItem } from './PrimaryItem';
import { NavbarActionButton } from './ActionButton';

import '@/styles/components/navbar/navbar-primary.css';

interface NavbarPrimaryListProps {
  controller: NavigationController;
  onItemMouseEnter: (key: string, hasGroups: boolean) => void;
  onItemMouseLeave: (key: string, hasGroups: boolean) => void;
}

const toDescriptor = (entry: NavPrimaryEntry): OverflowEntry => {
  if (entry.type === 'item') {
    return { type: 'item', key: entry.item.key };
  }

  return { type: 'action', key: entry.action.key };
};

export const NavbarPrimaryList = ({
  controller,
  onItemMouseEnter,
  onItemMouseLeave,
}: NavbarPrimaryListProps) => {
  const itemEntries = controller.primaryEntries.filter(
    (entry): entry is NavPrimaryEntry & { type: 'item' } => entry.type === 'item'
  );
  const actionEntries = controller.primaryEntries.filter(
    (entry): entry is NavPrimaryEntry & { type: 'action' } => entry.type === 'action'
  );

  return (
    <div className="nav-primary-layout">
      <div className="nav-item-collection">
        {itemEntries.map((entry) => {
          const descriptor = toDescriptor(entry);
          const isOverflow = controller.isEntryOverflowing(descriptor);
          const isActive = isPathActive(entry.item, controller.currentPath);

          return (
            <NavbarPrimaryItem
              key={entry.item.key}
              item={entry.item}
              isActive={isActive}
              isOverflow={isOverflow}
              activeDropdown={controller.navigationState.activeDropdown}
              registerRef={controller.registerEntryRef(descriptor)}
              onMouseEnter={onItemMouseEnter}
              onMouseLeave={onItemMouseLeave}
            />
          );
        })}
      </div>

      <div className="nav-actions-desktop">
        {actionEntries.map((entry) => {
          const descriptor = toDescriptor(entry);
          const isOverflow = controller.isEntryOverflowing(descriptor);

          return (
            <NavbarActionButton
              key={entry.action.key}
              action={entry.action}
              isOverflow={isOverflow}
              registerRef={controller.registerEntryRef(descriptor)}
            />
          );
        })}
      </div>
    </div>
  );
};
