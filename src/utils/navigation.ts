import type { NavItem } from '../types/navigation';
import { getChildHrefs } from '../data/navigation';

/**
 * Navigation utility functions
 */

/**
 * Checks if a path matches a navigation item or its children
 */
export const isPathActive = (item: NavItem, currentPath: string): boolean => {
  const childHrefs = getChildHrefs(item);

  // Check if current path matches any child href
  if (childHrefs.some(
    (href) => currentPath === href || currentPath.startsWith(`${href}/`)
  )) {
    return true;
  }

  // For items with groups, check if current path matches the main href
  if (item.groups) {
    if (currentPath === item.href || currentPath.startsWith(`${item.href}/`)) {
      return true;
    }
  }

  // Exact match
  return currentPath === item.href;
};

/**
 * Normalizes a URL path for consistent comparison
 */
export const normalizePath = (path: string): string => {
  if (!path) return '/';
  
  try {
    const url = new URL(path, globalThis.location?.origin || 'http://localhost');
    const normalized = url.pathname.replace(/\/+$/, '');
    return normalized === '' ? '/' : normalized;
  } catch {
    // Fallback for invalid URLs
    const normalized = path.replace(/\/+$/, '');
    return normalized === '' ? '/' : normalized;
  }
};

/**
 * Creates a Set from an array for O(1) lookup performance
 */
export const createLookupSet = <T>(items: T[]): Set<T> => {
  return new Set(items);
};

/**
 * Checks if an element is currently hidden
 */
export const isElementHidden = (element: HTMLElement): boolean => {
  return element.hasAttribute('hidden') || 
         element.style.display === 'none' ||
         element.style.visibility === 'hidden';
};

/**
 * Safely gets computed style value
 */
export const getComputedStyleValue = (element: Element, property: string): string => {
  try {
    const computed = globalThis.getComputedStyle(element);
    return computed.getPropertyValue(property) || '0';
  } catch {
    return '0';
  }
};

/**
 * Safely parses float with fallback
 */
export const safeParseFloat = (value: string | null | undefined): number => {
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};