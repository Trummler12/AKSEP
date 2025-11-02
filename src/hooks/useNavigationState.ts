import { useCallback, useEffect, useState } from 'react';
import type { NavigationState } from '../types/navigation';

/**
 * Custom hook for managing navigation state
 * Centralizes state management for all navigation interactions
 */
export const useNavigationState = (currentPath?: string) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isMenuOpen: false,
    activeDropdown: null,
    overflowKeys: [],
    openOverflowSections: [],
    openMobileSections: {},
  });

  // Reset state when path changes
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      isMenuOpen: false,
      activeDropdown: null,
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

  const setOverflowKeys = useCallback((keys: string[]) => {
    setNavigationState(prev => ({ ...prev, overflowKeys: keys }));
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
    setOverflowKeys,
    toggleOverflowSection,
    toggleMobileSection,
  };
};