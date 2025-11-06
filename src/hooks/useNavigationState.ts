import { useCallback, useEffect, useState } from 'react';
import type { NavigationState, OverflowEntry } from '../types/navigation';

/**
 * Custom hook for managing navigation state
 * Centralizes state management for all navigation interactions
 */
export const useNavigationState = (currentPath?: string) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isMenuOpen: false,
    activeDropdown: null,
    overflowEntries: [],
    openOverflowSections: [],
    openMobileSections: {},
  });

  // Reset state when path changes
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      isMenuOpen: false,
      activeDropdown: null,
      overflowEntries: [],
      openOverflowSections: [],
      openMobileSections: {},
    }));
  }, [currentPath]);

  const setMenuOpen = useCallback((isOpen: boolean) => {
    setNavigationState(prev => ({ ...prev, isMenuOpen: isOpen }));
  }, []);

  const toggleMenu = useCallback(() => {
    setNavigationState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);

  const setActiveDropdown = useCallback((key: string | null) => {
    setNavigationState(prev => ({ ...prev, activeDropdown: key }));
  }, []);

  const setOverflowEntries = useCallback((entries: OverflowEntry[]) => {
    setNavigationState(prev => ({ ...prev, overflowEntries: entries }));
  }, []);

  const toggleOverflowSection = useCallback((key: string) => {
    setNavigationState(prev => ({
      ...prev,
      openOverflowSections: prev.openOverflowSections.includes(key)
        ? prev.openOverflowSections.filter(item => item !== key)
        : [...prev.openOverflowSections, key],
    }));
  }, []);

  const toggleMobileSection = useCallback((key: string) => {
    setNavigationState(prev => ({
      ...prev,
      openMobileSections: {
        ...prev.openMobileSections,
        [key]: !prev.openMobileSections[key],
      },
    }));
  }, []);

  return {
    navigationState,
    setMenuOpen,
    toggleMenu,
    setActiveDropdown,
    setOverflowEntries,
    toggleOverflowSection,
    toggleMobileSection,
  };
};