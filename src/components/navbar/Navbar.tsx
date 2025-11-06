import { useCallback, useEffect, useRef } from 'react';
import type { NavigationController } from '@/hooks/useNavigationController';
import { NavbarBrand } from './Brand';
import { NavbarPrimaryList } from './PrimaryList';
import { NavbarOverflowMenu } from './OverflowMenu';
import { NavbarMenuToggle } from './MenuToggle';

import '@/styles/components/navbar/navbar-shell.css';
import '@/styles/components/navbar/navbar-action.css';

interface NavbarProps {
  controller: NavigationController;
}

const Navbar = ({ controller }: NavbarProps) => {
  const dropdownCloseTimeout = useRef<number | null>(null);

  const handleItemMouseEnter = useCallback((key: string, hasGroups: boolean) => {
    if (!hasGroups) {
      return;
    }

    if (dropdownCloseTimeout.current) {
      window.clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }

    controller.setActiveDropdown(key);
  }, [controller]);

  const handleItemMouseLeave = useCallback((key: string, hasGroups: boolean) => {
    if (!hasGroups) {
      return;
    }

    if (dropdownCloseTimeout.current) {
      window.clearTimeout(dropdownCloseTimeout.current);
    }

    dropdownCloseTimeout.current = window.setTimeout(() => {
      controller.setActiveDropdown(null);
    }, 150);
  }, [controller]);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimeout.current) {
        window.clearTimeout(dropdownCloseTimeout.current);
      }
    };
  }, []);

  return (
    <header className="nav-header">
      <div className="nav-inner-container">
        <div className="nav-toolbar">
          <NavbarBrand />

          <nav ref={controller.navContainerRef} className="nav-group-items">
            <NavbarPrimaryList
              controller={controller}
              onItemMouseEnter={handleItemMouseEnter}
              onItemMouseLeave={handleItemMouseLeave}
            />
            <NavbarOverflowMenu controller={controller} />
          </nav>

          <div className="nav-actions-area">
            <NavbarMenuToggle controller={controller} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
