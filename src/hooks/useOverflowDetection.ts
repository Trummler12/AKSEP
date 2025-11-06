import { useCallback, useEffect, useRef } from 'react';
import type { NavPrimaryEntry, OverflowEntry } from '../types/navigation';

interface UseOverflowDetectionProps {
  entries: NavPrimaryEntry[];
  onOverflowChange: (entries: OverflowEntry[]) => void;
}

const composeEntryId = (entry: OverflowEntry): string => `${entry.type}:${entry.key}`;

const getEntryDescriptor = (entry: NavPrimaryEntry): OverflowEntry => {
  if (entry.type === 'item') {
    return { type: 'item', key: entry.item.key };
  }

  return { type: 'action', key: entry.action.key };
};

const getEntryPriority = (entry: NavPrimaryEntry): number => {
  if (entry.type === 'item') {
    return entry.item.priority ?? 0;
  }

  return entry.action.priority;
};

/**
 * Priority-aware overflow detection
 */
export const useOverflowDetection = ({ entries, onOverflowChange }: UseOverflowDetectionProps) => {
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const overflowTriggerRef = useRef<HTMLButtonElement | null>(null);
  const entryRefs = useRef<Record<string, HTMLElement | null>>({});
  const entryWidths = useRef<Record<string, number>>({});

  const registerEntryRef = useCallback(
    (descriptor: OverflowEntry) => (element: HTMLElement | null) => {
      entryRefs.current[composeEntryId(descriptor)] = element;
    },
    []
  );

  const measureEntries = useCallback(() => {
    entries.forEach((entry) => {
      const descriptor = getEntryDescriptor(entry);
      const id = composeEntryId(descriptor);
      const element = entryRefs.current[id];
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

      entryWidths.current[id] = rect.width + margin;

      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.removeAttribute('style');
      }

      if (wasHidden) {
        element.setAttribute('hidden', '');
      }
    });
  }, [entries]);

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

    const entryData = entries.map((entry, index) => {
      const descriptor = getEntryDescriptor(entry);
      const id = composeEntryId(descriptor);
      return {
        descriptor,
        id,
        width: entryWidths.current[id] ?? 0,
        priority: getEntryPriority(entry),
        index,
      };
    });

    let totalWidth = entryData.reduce((sum, { width }) => sum + width, 0);
    if (totalWidth <= availableWidth) {
      onOverflowChange([]);
      return;
    }

    const overflowWidth = overflowTriggerRef.current?.getBoundingClientRect().width ?? 48;
    const removed = new Set<string>();
    const hiddenEntries: OverflowEntry[] = [];

    const getWidthWithOverflow = (currentWidth: number, hiddenCount: number) => {
      return hiddenCount === 0 ? currentWidth : currentWidth + overflowWidth;
    };

    let widthWithOverflow = getWidthWithOverflow(totalWidth, hiddenEntries.length);

    while (widthWithOverflow > availableWidth) {
      const candidate = entryData
        .filter(({ id, width }) => !removed.has(id) && width > 0)
        .sort((a, b) => {
          if (b.priority !== a.priority) {
            return b.priority - a.priority;
          }
          return b.index - a.index;
        })[0];

      if (!candidate) {
        break;
      }

      removed.add(candidate.id);
      hiddenEntries.push(candidate.descriptor);
      totalWidth -= candidate.width;
      widthWithOverflow = getWidthWithOverflow(totalWidth, hiddenEntries.length);

      if (hiddenEntries.length === entryData.length) {
        break;
      }
    }

    onOverflowChange(hiddenEntries);
  }, [entries, onOverflowChange]);

  useEffect(() => {
    const update = () => {
      measureEntries();
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
  }, [calculateVisibility, measureEntries]);

  return {
    navContainerRef,
    overflowTriggerRef,
    registerEntryRef,
  };
};