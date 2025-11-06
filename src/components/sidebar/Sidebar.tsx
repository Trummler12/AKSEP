import type { NavigationController } from '@/hooks/useNavigationController';
import { SidebarSection } from './Section';

import '@/styles/components/sidebar/sidebar-shell.css';

interface SidebarProps {
  controller: NavigationController;
}

const Sidebar = ({ controller }: SidebarProps) => {
  if (!controller.navigationState.isMenuOpen) {
    return null;
  }

  return (
    <div className="nav-mobile-wrapper">
      <nav className="nav-mobile-scroll">
        <div className="nav-stack-space-2">
          {controller.navItems.map((item) => {
            const isOpen = Boolean(controller.navigationState.openMobileSections[item.key]);
            const hasGroups = Boolean(item.groups?.length);

            if (hasGroups) {
              return (
                <SidebarSection
                  key={item.key}
                  item={item}
                  isOpen={isOpen}
                  onToggle={() => controller.toggleMobileSection(item.key)}
                  onNavigate={() => controller.setMenuOpen(false)}
                />
              );
            }

            return (
              <div key={item.key} className="nav-mobile-item">
                <a
                  href={item.href}
                  className="nav-direct-link"
                  onClick={() => controller.setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
