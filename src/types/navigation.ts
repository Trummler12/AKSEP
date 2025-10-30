/**
 * Type definitions for navigation system
 */

export interface NavChildItem {
  label: string;
  href: string;
}

export interface NavChildGroup {
  key: string;
  title?: string;
  items: NavChildItem[];
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  groups?: NavChildGroup[];
  displayInPrimary?: boolean;
}

export interface NavigationProps {
  currentPath?: string;
}

export interface NavigationState {
  isMenuOpen: boolean;
  activeDropdown: string | null;
  overflowKeys: string[];
  openOverflowSections: string[];
  openMobileSections: Record<string, boolean>;
}

export interface OverflowDetectionState {
  overflowKeys: string[];
  itemWidths: Record<string, number>;
}