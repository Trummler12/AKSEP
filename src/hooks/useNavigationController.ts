import { useCallback, useMemo } from 'react';
import type { RefObject } from 'react';
import { navigationItems, getPrimaryNavEntries, getNavActions } from '@/data/navigation';
import { normalizePath } from '@/utils/navigation';
import type { NavAction, NavItem, NavPrimaryEntry, OverflowEntry } from '@/types/navigation';
import { useNavigationState } from './useNavigationState';
import { useOverflowDetection } from './useOverflowDetection';

interface NavigationControllerOptions {
  currentPath?: string;
}

export interface NavigationController {
  currentPath: string;
  navItems: NavItem[];
  navActions: NavAction[];
  primaryEntries: NavPrimaryEntry[];
  overflowEntries: OverflowEntry[];
  overflowItems: NavItem[];
  overflowActions: NavAction[];
  navContainerRef: RefObject<HTMLDivElement>;
  overflowTriggerRef: RefObject<HTMLButtonElement>;
  registerEntryRef: (entry: OverflowEntry) => (element: HTMLElement | null) => void;
  isEntryOverflowing: (entry: OverflowEntry) => boolean;
  navigationState: ReturnType<typeof useNavigationState>['navigationState'];
  setMenuOpen: ReturnType<typeof useNavigationState>['setMenuOpen'];
  toggleMenu: ReturnType<typeof useNavigationState>['toggleMenu'];
  setActiveDropdown: ReturnType<typeof useNavigationState>['setActiveDropdown'];
  toggleOverflowSection: ReturnType<typeof useNavigationState>['toggleOverflowSection'];
  toggleMobileSection: ReturnType<typeof useNavigationState>['toggleMobileSection'];
}

const composeKey = (entry: OverflowEntry) => `${entry.type}:${entry.key}`;

export const useNavigationController = (
  { currentPath = '/' }: NavigationControllerOptions = {}
): NavigationController => {
  const normalizedPath = useMemo(() => normalizePath(currentPath), [currentPath]);
  const primaryEntries = useMemo(() => getPrimaryNavEntries(), []);
  const navActions = useMemo(() => getNavActions(), []);

  const {
    navigationState,
    setMenuOpen,
    toggleMenu,
    setActiveDropdown,
    setOverflowEntries,
    toggleOverflowSection,
    toggleMobileSection,
  } = useNavigationState(normalizedPath);

  const overflowDetection = useOverflowDetection({
    entries: primaryEntries,
    onOverflowChange: setOverflowEntries,
  });

  const overflowSet = useMemo(() => {
    return new Set(navigationState.overflowEntries.map(composeKey));
  }, [navigationState.overflowEntries]);

  const overflowItems = useMemo(() => {
    return navigationState.overflowEntries
      .filter((entry): entry is OverflowEntry & { type: 'item' } => entry.type === 'item')
      .map((entry) => navigationItems.find((item) => item.key === entry.key))
      .filter((item): item is NavItem => Boolean(item));
  }, [navigationState.overflowEntries]);

  const overflowActions = useMemo(() => {
    return navigationState.overflowEntries
      .filter((entry): entry is OverflowEntry & { type: 'action' } => entry.type === 'action')
      .map((entry) => navActions.find((action) => action.key === entry.key))
      .filter((action): action is NavAction => Boolean(action));
  }, [navigationState.overflowEntries, navActions]);

  const isEntryOverflowing = useCallback((entry: OverflowEntry) => {
    return overflowSet.has(composeKey(entry));
  }, [overflowSet]);

  return {
    currentPath: normalizedPath,
    navItems: navigationItems,
    navActions,
    primaryEntries,
    overflowEntries: navigationState.overflowEntries,
    overflowItems,
    overflowActions,
    navContainerRef: overflowDetection.navContainerRef,
    overflowTriggerRef: overflowDetection.overflowTriggerRef,
    registerEntryRef: overflowDetection.registerEntryRef,
    isEntryOverflowing,
    navigationState,
    setMenuOpen,
    toggleMenu,
    setActiveDropdown,
    toggleOverflowSection,
    toggleMobileSection,
  };
};
