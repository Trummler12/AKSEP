import { Menu, X } from 'lucide-react';
import type { NavigationController } from '@/hooks/useNavigationController';

import '@/styles/components/navbar/navbar-menu-toggle.css';

interface NavbarMenuToggleProps {
  controller: NavigationController;
}

export const NavbarMenuToggle = ({ controller }: NavbarMenuToggleProps) => (
  <button
    className="nav-menu-button"
    onClick={controller.toggleMenu}
    aria-label="Navigation umschalten"
  >
    {controller.navigationState.isMenuOpen ? (
      <X className="nav-menu-icon" />
    ) : (
      <Menu className="nav-menu-icon" />
    )}
  </button>
);
