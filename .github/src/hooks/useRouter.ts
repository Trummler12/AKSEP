import { useCallback, useEffect, useState } from 'react';
import { normalizePath } from '../utils/navigation';

/**
 * Custom router hook for handling client-side navigation
 * Provides navigation state and navigation functions
 */
export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(() => 
    normalizePath(globalThis.location?.pathname || '/')
  );

  const navigate = useCallback((path: string) => {
    const target = normalizePath(path);
    if (target === currentPath) {
      return;
    }

    globalThis.history?.pushState({}, '', target);
    setCurrentPath(target);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(globalThis.location?.pathname || '/'));
    };

    const handleClick = (event: MouseEvent) => {
      // Skip if event is already handled or modified
      if (event.defaultPrevented || 
          event.button !== 0 || 
          event.metaKey || 
          event.ctrlKey || 
          event.shiftKey || 
          event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      const download = anchor.hasAttribute('download');
      const targetAttr = anchor.getAttribute('target');

      // Skip if not a navigation link
      if (!href || 
          download || 
          (targetAttr && targetAttr !== '_self')) {
        return;
      }

      // Skip non-navigation links
      if (href.startsWith('#') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:')) {
        return;
      }

      try {
        const url = new URL(href, globalThis.location?.origin);
        if (url.origin !== globalThis.location?.origin) {
          return;
        }

        event.preventDefault();
        navigate(url.pathname);
      } catch {
        // Invalid URL, let browser handle it
        return;
      }
    };

    globalThis.addEventListener?.('popstate', handlePopState);
    globalThis.document?.addEventListener('click', handleClick);

    return () => {
      globalThis.removeEventListener?.('popstate', handlePopState);
      globalThis.document?.removeEventListener('click', handleClick);
    };
  }, [navigate]);

  return {
    currentPath,
    navigate,
  };
};