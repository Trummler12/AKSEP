import { useCallback, useEffect, useRef } from 'react';
import type { NavItem } from '../types/navigation';

interface UseOverflowDetectionProps {
  primaryNavItems: NavItem[];
  onOverflowChange: (keys: string[]) => void;
}

/**
 * Custom hook for detecting navigation overflow
 * Handles responsive behavior and overflow menu management
 */
export const useOverflowDetection = ({ 
  primaryNavItems, 
  onOverflowChange 
}: UseOverflowDetectionProps) => {
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const overflowTriggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const itemWidths = useRef<Record<string, number>>({});

  const measureItems = useCallback(() => {
    primaryNavItems.forEach((item) => {
      const element = itemRefs.current[item.key];
      if (!element) {
        return;
      }

      const wasHidden = element.hasAttribute('hidden');
      if (wasHidden) {
        element.removeAttribute('hidden');
      }

      const originalStyle = element.getAttribute('style');
      element.setAttribute(
        'style',
        `${originalStyle ? `${originalStyle}; ` : ''}position:absolute;visibility:hidden;display:flex;`
      );

      const rect = element.getBoundingClientRect();
      const computed = window.getComputedStyle(element);
      const margin =
        parseFloat(computed.marginLeft || '0') + parseFloat(computed.marginRight || '0');

      itemWidths.current[item.key] = rect.width + margin;

      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.removeAttribute('style');
      }

      if (wasHidden) {
        element.setAttribute('hidden', '');
      }
    });
  }, [primaryNavItems]);

  const calculateVisibility = useCallback(() => {
    const container = navContainerRef.current;
    if (!container) {
      return;
    }

    const parent = container.parentElement;
    let availableWidth = container.getBoundingClientRect().width;

    if (parent) {
      const parentWidth = parent.getBoundingClientRect().width;
      let siblingsWidth = 0;

      Array.from(parent.children).forEach((child) => {
        if (child === container) {
          return;
        }

        const rect = child.getBoundingClientRect();
        const style = window.getComputedStyle(child);
        const margin =
          parseFloat(style.marginLeft || '0') + parseFloat(style.marginRight || '0');

        siblingsWidth += rect.width + margin;
      });

      const parentStyle = window.getComputedStyle(parent);
      const columnGap =
        parseFloat(parentStyle.columnGap || parentStyle.gap || '0') || 0;
      const gapCount = Math.max(parent.children.length - 1, 0);

      availableWidth = Math.max(parentWidth - siblingsWidth - columnGap * gapCount, 0);
    }

    if (availableWidth === 0) {
      onOverflowChange([]);
      return;
    }

    const widths = primaryNavItems.map((item) => itemWidths.current[item.key] ?? 0);
    let totalWidth = widths.reduce((sum, width) => sum + width, 0);
    let visibleCount = primaryNavItems.length;
    const overflowWidth =
      overflowTriggerRef.current?.getBoundingClientRect().width ?? 48;

    if (totalWidth <= availableWidth) {
      onOverflowChange([]);
      return;
    }

    let widthWithOverflow = totalWidth + overflowWidth;
    const newOverflow: string[] = [];

    while (visibleCount > 0 && widthWithOverflow > availableWidth) {
      newOverflow.unshift(primaryNavItems[visibleCount - 1].key);
      totalWidth -= widths[visibleCount - 1];
      visibleCount -= 1;
      widthWithOverflow = totalWidth + overflowWidth;
    }

    onOverflowChange(newOverflow);
  }, [primaryNavItems, onOverflowChange]);

  useEffect(() => {
    const update = () => {
      measureItems();
      calculateVisibility();
    };

    update();

    const observer = new ResizeObserver(update);
    const container = navContainerRef.current;
    if (container) {
      observer.observe(container);
    }

    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [calculateVisibility, measureItems]);

  return {
    navContainerRef,
    overflowTriggerRef,
    itemRefs,
  };
};