import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Menu, MoreHorizontal, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from './ui/utils';
import aksepLogo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

interface NavigationProps {
  currentPath?: string;
}

interface NavChildItem {
  label: string;
  href: string;
}

interface NavChildGroup {
  key: string;
  title?: string;
  items: NavChildItem[];
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
}

interface NavItem {
  key: string;
  label: string;
  href: string;
  groups?: NavChildGroup[];
  displayInPrimary?: boolean;
}

const Navigation = ({ currentPath = '/' }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [overflowKeys, setOverflowKeys] = useState<string[]>([]);
  const [openOverflowSections, setOpenOverflowSections] = useState<string[]>([]);
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({});

  const navItems = useMemo<NavItem[]>(() => {
    const begriffeGroups: NavChildGroup[] = [
      {
        key: 'begriffe-intro',
        items: [
          {
            label: 'Warum Begriffklärungen wichtig sind',
            href: '/begriffe/warum-begriffklaerungen-wichtig-sind',
          },
        ],
      },
      {
        key: 'begriffe-wichtige',
        items: [
          { label: 'Rechts vs. Links', href: '/begriffe/rechts-vs-links' },
          { label: 'Radikal', href: '/begriffe/radikal' },
          { label: 'Pädophil vs. Pädokriminell', href: '/begriffe/paedophil-vs-paedokriminell' },
          { label: 'Nationalsozialismus', href: '/begriffe/nationalsozialismus' },
          { label: 'Faschismus', href: '/begriffe/faschismus' },
        ],
        showTopBorder: true,
      },
      {
        key: 'begriffe-weitere',
        items: [{ label: 'Weitere Begriffe...', href: '/begriffe/weitere' }],
        showTopBorder: true,
      },
    ];

    const programmGroups: NavChildGroup[] = [
      {
        key: 'programm-praeambel',
        items: [{ label: 'Präambel', href: '/praeambel' }],
      },
      {
        key: 'programm-ags',
        items: [
          { label: 'AG Regierung', href: '/programm/regierung' },
          { label: 'AG Innere Sicherheit', href: '/programm/innere-sicherheit' },
          { label: 'AG Klimaschutz', href: '/programm/klimaschutz' },
          { label: 'AG Umweltschutz', href: '/programm/umweltschutz' },
          { label: 'AG Gesundheit', href: '/programm/gesundheit' },
          { label: 'AG Forschung und KI', href: '/programm/forschung-ki' },
          { label: 'AG Wirtschaft', href: '/programm/wirtschaft' },
          { label: 'AG Bildung', href: '/programm/bildung' },
          { label: 'AG Soziales', href: '/programm/soziales' },
          { label: 'AG Europa und Migration', href: '/programm/europa-migration' },
          { label: 'AG Außenpolitik', href: '/programm/aussenpolitik' },
          { label: 'AG Tierrechte', href: '/programm/tierrechte' },
          { label: 'AG Agrarpolitik', href: '/programm/agrarpolitik' },
          { label: 'AG Sonstiges', href: '/programm/sonstiges' },
        ],
        showTopBorder: true,
      },
    ];

    const ueberUnsGroups: NavChildGroup[] = [
      {
        key: 'ueber-uns-organisation',
        items: [
          { label: 'Satzung', href: '/satzung' },
          { label: 'Projekte', href: '/projekte' },
          { label: 'Partner-Projekte', href: '/partner-projekte' },
          { label: 'Finanzen & Transparenz', href: '/finanzen-transparenz' },
        ],
      },
    ];

    const aktuellGroups: NavChildGroup[] = [
      {
        key: 'aktuelles-updates',
        items: [
          { label: 'Termine', href: '/termine' },
          { label: 'Presse', href: '/presse' },
        ],
      },
    ];

    const mitmachenGroups: NavChildGroup[] = [
      {
        key: 'mitmachen-options',
        items: [
          { label: 'Mitglied werden', href: '/mitglied-werden' },
          { label: 'Mitmachen', href: '/mitmachen' },
          { label: 'Unterstützen', href: '/unterstuetzen' },
          { label: 'Kontakt', href: '/kontakt' },
        ],
      },
    ];

    return [
      { key: 'begriffe', label: 'Begriffe', href: '/begriffe', groups: begriffeGroups },
      { key: 'programm', label: 'Programm', href: '/programm', groups: programmGroups },
      { key: 'ueber-uns', label: 'Über uns', href: '/ueber-uns', groups: ueberUnsGroups },
      { key: 'aktuelles', label: 'Aktuelles', href: '/termine', groups: aktuellGroups },
      { key: 'mitmachen', label: 'Mitmachen', href: '/mitmachen', groups: mitmachenGroups },
      { key: 'datenschutz', label: 'Datenschutz', href: '/datenschutz', displayInPrimary: false },
      { key: 'impressum', label: 'Impressum', href: '/impressum', displayInPrimary: false },
    ];
  }, []);

  const primaryNavItems = useMemo(
    () => navItems.filter((item) => item.displayInPrimary !== false),
    [navItems]
  );

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const overflowTriggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const itemWidths = useRef<Record<string, number>>({});
  const dropdownCloseTimeout = useRef<number | null>(null);

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
      setOverflowKeys([]);
      return;
    }

    const widths = primaryNavItems.map((item) => itemWidths.current[item.key] ?? 0);
    let totalWidth = widths.reduce((sum, width) => sum + width, 0);
    let visibleCount = primaryNavItems.length;
    const overflowWidth =
      overflowTriggerRef.current?.getBoundingClientRect().width ?? 48;

    if (totalWidth <= availableWidth) {
      setOverflowKeys([]);
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

    setOverflowKeys(newOverflow);
  }, [primaryNavItems]);

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

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setOpenOverflowSections([]);
    setOpenMobileSections({});
  }, [currentPath]);

  const toggleOverflowSection = (key: string) => {
    setOpenOverflowSections((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleMobileSection = (key: string) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const overflowSet = useMemo(() => new Set(overflowKeys), [overflowKeys]);
  const overflowItems = useMemo(
    () => primaryNavItems.filter((item) => overflowSet.has(item.key)),
    [primaryNavItems, overflowSet]
  );

  const isPathActive = useCallback(
    (item: NavItem) => {
      const childHrefs =
        item.groups?.flatMap((group) => group.items.map((child) => child.href)) ?? [];

      if (
        childHrefs.some(
          (href) => currentPath === href || currentPath.startsWith(`${href}/`)
        )
      ) {
        return true;
      }

      if (item.groups) {
        if (currentPath === item.href || currentPath.startsWith(`${item.href}/`)) {
          return true;
        }
      }

      return currentPath === item.href;
    },
    [currentPath]
  );

  const handleItemMouseEnter = (key: string, hasGroups: boolean) => {
    if (!hasGroups) {
      return;
    }

    if (dropdownCloseTimeout.current) {
      window.clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }

    setActiveDropdown(key);
  };

  const handleItemMouseLeave = (key: string, hasGroups: boolean) => {
    if (!hasGroups) {
      return;
    }

    if (dropdownCloseTimeout.current) {
      window.clearTimeout(dropdownCloseTimeout.current);
    }

    dropdownCloseTimeout.current = window.setTimeout(() => {
      setActiveDropdown((current) => (current === key ? null : current));
    }, 150);
  };

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
              const isActive = isPathActive(item);
              const hasGroups = Boolean(item.groups?.length);

              return (
                <div
                  key={item.key}
                  ref={(element) => {
                    itemRefs.current[item.key] = element;
                  }}
                  className="group relative flex h-full items-center"
                  hidden={isOverflow}
                  onMouseEnter={() => handleItemMouseEnter(item.key, hasGroups)}
                  onMouseLeave={() => handleItemMouseLeave(item.key, hasGroups)}
                >
                  <a
                    href={item.href}
                    className={cn(
                      'flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-muted/40 text-primary'
                        : 'text-foreground hover:bg-muted/30 hover:text-primary'
                    )}
                  >
                    <span>{item.label}</span>
                    {hasGroups && <ChevronDown className="h-4 w-4" />}
                  </a>
                  {hasGroups && <div aria-hidden className="absolute left-0 top-full h-2 w-full" />}
                  {hasGroups && activeDropdown === item.key && (
                    <div
                      className="absolute left-0 top-full z-50 mt-3 w-fit max-w-[13rem] rounded-md border border-border bg-card py-3 shadow-lg"
                      style={{ width: 'max-content', maxWidth: '13rem' }}
                    >
                      <div
                        className={cn(
                          'max-h-96 overflow-y-auto pr-2',
                          item.key === 'programm' ? 'pr-2' : ''
                        )}
                      >
                        {item.groups?.map((group, groupIndex) => (
                          <div
                            key={group.key}
                            className={cn(
                              'px-3',
                              group.showTopBorder && 'mt-2 border-t border-border/60 pt-3',
                              group.showBottomBorder && 'mb-2 border-b border-border/60 pb-3',
                              !group.showTopBorder && groupIndex === 0 && 'pt-1'
                            )}
                          >
                            {group.title && (
                              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {group.title}
                              </p>
                            )}
                            <div className="mt-1 space-y-1">
                              {group.items.map((child) => (
                                <a
                                  key={child.href}
                                  href={child.href}
                                  className="block rounded-md px-2 py-2 text-sm leading-snug text-foreground transition-colors hover:bg-muted hover:text-primary"
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {overflowItems.length > 0 && (
              <div className="relative flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    ref={overflowTriggerRef}
                    className="inline-flex h-10 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors hover:bg-muted/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="max-h-96 w-fit max-w-[13rem] overflow-y-auto p-3"
                    style={{ width: 'max-content', maxWidth: '13rem' }}
                  >
                    {overflowItems.map((item) => {
                      const isOpen = openOverflowSections.includes(item.key);
                      const hasGroups = Boolean(item.groups?.length);

                      return (
                        <div key={item.key} className="py-1">
                          {hasGroups ? (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => toggleOverflowSection(item.key)}
                                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
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
                                  'space-y-1 rounded-md bg-muted/20 px-2 py-2',
                                  isOpen ? 'block' : 'hidden'
                                )}
                              >
                                {item.groups?.map((group) => (
                                  <div
                                    key={group.key}
                                    className={cn(
                                      'space-y-1 px-1',
                                      group.showTopBorder && 'pt-2 border-t border-border/60',
                                      group.showBottomBorder && 'pb-2 border-b border-border/60'
                                    )}
                                  >
                                    {group.title && (
                                      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        {group.title}
                                      </p>
                                    )}
                                    {group.items.map((child) => (
                                      <DropdownMenuItem
                                        key={child.href}
                                        asChild
                                        className="whitespace-normal leading-snug"
                                      >
                                        <a href={child.href} className="w-full">
                                          {child.label}
                                        </a>
                                      </DropdownMenuItem>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <DropdownMenuItem asChild className="leading-snug">
                              <a href={item.href} className="w-full">
                                {item.label}
                              </a>
                            </DropdownMenuItem>
                          )}
                        </div>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Navigation umschalten"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border bg-card">
            <nav className="max-h-[70vh] overflow-y-auto py-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isOpen = openMobileSections[item.key];
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
                                      onClick={() => setIsMenuOpen(false)}
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
                          onClick={() => setIsMenuOpen(false)}
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
