/**
 * New modular navigation system
 * This file serves as the main entry point and coordinates all navigation components
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, Menu, MoreHorizontal, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../ui/utils';
import aksepLogo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

// Import our refactored data and hooks
import { navigationItems, getPrimaryNavItems } from '../../data/navigation';
import { useNavigationState } from '../../hooks/useNavigationState';
import { useOverflowDetection } from '../../hooks/useOverflowDetection';
import { isPathActive, createLookupSet } from '../../utils/navigation';
import type { NavigationProps } from '../../types/navigation';

// Import navigation components
import { NavigationItem } from './NavigationItem';
import { OverflowNavigation } from './OverflowNavigation';

// import '../../styles/globals.css'; // vorerst auskommentiert auf Grund von Konflikten mit Tailwind

const Navigation = ({ currentPath = '/' }: NavigationProps) => {
  const primaryNavItems = useMemo(() => getPrimaryNavItems(), []);
  
  const {
    navigationState,
    setMenuOpen,
    toggleMenu,
    setActiveDropdown,
    setOverflowKeys,
    toggleOverflowSection,
    toggleMobileSection,
  } = useNavigationState(currentPath);

  const {
    navContainerRef,
    overflowTriggerRef,
    itemRefs,
  } = useOverflowDetection({
    primaryNavItems,
    onOverflowChange: setOverflowKeys,
  });

  const dropdownCloseTimeout = useRef<number | null>(null);

  const overflowSet = useMemo(() => createLookupSet(navigationState.overflowKeys), [navigationState.overflowKeys]);
  const overflowItems = useMemo(
    () => primaryNavItems.filter((item) => overflowSet.has(item.key)),
    [primaryNavItems, overflowSet]
  );

  const handleItemMouseEnter = useCallback((key: string, hasGroups: boolean) => {
    if (!hasGroups) return;

    if (dropdownCloseTimeout.current) {
      window.clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }

    setActiveDropdown(key);
  }, [setActiveDropdown]);

  const handleItemMouseLeave = useCallback((key: string, hasGroups: boolean) => {
    if (!hasGroups) return;

    if (dropdownCloseTimeout.current) {
      window.clearTimeout(dropdownCloseTimeout.current);
    }

    dropdownCloseTimeout.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, [setActiveDropdown]);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimeout.current) {
        window.clearTimeout(dropdownCloseTimeout.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="w-full px-6 sm:px-8">
        <div className="flex h-16 items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="/"
                  className="mr-8 flex flex-shrink-0 items-center space-x-3 transition-opacity hover:opacity-80"
                  aria-label="Zur Startseite"
                >
                  <img src={aksepLogo} alt="DIE AKSEP Logo" className="h-10 w-10" />
                  <span className="text-xl font-semibold whitespace-nowrap">DIE AKSEP</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zur Startseite</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <nav
            ref={navContainerRef}
            className="flex min-w-0 max-w-full flex-1 items-stretch gap-1 overflow-visible md:gap-2 lg:gap-3"
          >
            {primaryNavItems.map((item) => {
              const isOverflow = overflowSet.has(item.key);
              const isActive = isPathActive(item, currentPath);

              return (
                <NavigationItem
                  key={item.key}
                  item={item}
                  currentPath={currentPath}
                  isOverflow={isOverflow}
                  isActive={isActive}
                  activeDropdown={navigationState.activeDropdown}
                  onMouseEnter={handleItemMouseEnter}
                  onMouseLeave={handleItemMouseLeave}
                  itemRef={(element) => {
                    itemRefs.current[item.key] = element;
                  }}
                />
              );
            })}

            <OverflowNavigation
              overflowItems={overflowItems}
              openOverflowSections={navigationState.openOverflowSections}
              onToggleOverflowSection={toggleOverflowSection}
              overflowTriggerRef={overflowTriggerRef}
            />
          </nav>

          <div className="ml-4 flex items-center gap-3">
            <div className="hidden items-center space-x-3 2xl:flex">
              <Button variant="outline" size="sm" asChild>
                <a href="/mitglied-werden">Mitglied werden</a>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                <a href="/unterstuetzen">Unterstützen</a>
              </Button>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-md border border-transparent transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={toggleMenu}
              aria-label="Navigation umschalten"
            >
              {navigationState.isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {navigationState.isMenuOpen && (
          <div className="border-t border-border bg-card">
            <nav className="max-h-[70vh] overflow-y-auto py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const isOpen = navigationState.openMobileSections[item.key];
                  const hasGroups = Boolean(item.groups?.length);

                  return (
                    <div key={item.key} className="border-b border-border/60 px-4 py-3 last:border-b-0">
                      {hasGroups ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleMobileSection(item.key)}
                            className="flex w-full items-center justify-between text-left text-base font-medium text-foreground"
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isOpen ? 'rotate-180' : ''
                              )}
                            />
                          </button>
                          <div
                            className={cn(
                              'space-y-2 pt-3',
                              isOpen ? 'block' : 'hidden'
                            )}
                          >
                            {item.groups?.map((group) => (
                              <div
                                key={group.key}
                                className={cn(
                                  'rounded-md bg-muted/10 px-3 py-2',
                                  group.showTopBorder && 'border-t border-border/60 pt-3',
                                  group.showBottomBorder && 'border-b border-border/60 pb-3'
                                )}
                              >
                                {group.title && (
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {group.title}
                                  </p>
                                )}
                                <div className="mt-2 space-y-1">
                                  {group.items.map((child) => (
                                    <a
                                      key={child.href}
                                      href={child.href}
                                      className="block rounded px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                      onClick={() => setMenuOpen(false)}
                                    >
                                      {child.label}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <a
                          href={item.href}
                          className="block rounded px-2 py-2 text-base text-foreground transition-colors hover:bg-muted hover:text-primary"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;