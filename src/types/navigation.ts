/**
 * Type definitions for navigation system
 */

export interface NavChildItem {
  label: string;
  href: string;
  important?: boolean;
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
  priority?: number;
}

export type NavActionVariant = 'primary' | 'outline';

export interface NavAction {
  key: string;
  label: string;
  href: string;
  priority: number;
  variant: NavActionVariant;
}

export type NavPrimaryEntry =
  | { type: 'item'; item: NavItem } 
  | { type: 'action'; action: NavAction };

export interface OverflowEntry {
  type: NavPrimaryEntry['type'];
  key: string;
}

export interface NavigationProps {
  currentPath?: string;
}

export interface NavigationState {
  isMenuOpen: boolean;
  activeDropdown: string | null;
  overflowEntries: OverflowEntry[];
  openOverflowSections: string[];
  openMobileSections: Record<string, boolean>;
}
