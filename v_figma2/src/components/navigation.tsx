import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  priority?: number;
}

const navigationItems: NavItem[] = [
  { label: 'Begriffe', href: '/begriffe', priority: 5 },
  {
    label: 'Programm',
    href: '/programm',
    priority: 4,
    children: [
      { label: 'Präambel', href: '/programm/praeambel' },
      { label: 'AG Bildung', href: '/programm/bildung' },
      { label: 'AG Demokratie', href: '/programm/demokratie' },
      { label: 'AG Europa', href: '/programm/europa' },
      { label: 'AG Klima', href: '/programm/klima' },
      { label: 'AG Soziales', href: '/programm/soziales' },
    ],
  },
  {
    label: 'Über uns',
    href: '/ueber-uns',
    priority: 3,
    children: [
      { label: 'Geschichte', href: '/ueber-uns/geschichte' },
      { label: 'Satzung', href: '/ueber-uns/satzung' },
      { label: 'Mitglieder', href: '/ueber-uns/mitglieder' },
    ],
  },
  { label: 'Aktuelles', href: '/aktuelles', priority: 2 },
  { label: 'Kontakt', href: '/kontakt', priority: 1 },
];

interface DisclosureProps {
  item: NavItem;
  onNavigate: () => void;
}

const Disclosure: React.FC<DisclosureProps> = ({ item, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav-menu-disclosure">
      <button
        className="nav-menu-disclosure-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        type="button"
      >
        {item.label}
        <ChevronDown className="nav-menu-disclosure-icon" />
      </button>
      {isOpen && item.children && (
        <div className="nav-menu-disclosure-content">
          {item.children.map((child) => (
            <a
              key={child.href}
              href={child.href}
              className="nav-menu-disclosure-item"
              onClick={onNavigate}
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(navigationItems);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);
  
  const navRef = useRef<HTMLDivElement>(null);
  const overflowMenuRef = useRef<HTMLDivElement>(null);

  // Priority+ Logik
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (window.innerWidth <= 1024) {
        // Auf Mobile/Tablet alle Items anzeigen (im Drawer)
        setVisibleItems(navigationItems);
        setOverflowItems([]);
        return;
      }

      // Simuliere Platzberechnung (vereinfacht)
      const availableWidth = navRef.current?.offsetWidth || 0;
      const itemWidth = 120; // Durchschnittliche Breite eines Items
      const maxVisibleItems = Math.floor(availableWidth / itemWidth);

      if (maxVisibleItems >= navigationItems.length) {
        setVisibleItems(navigationItems);
        setOverflowItems([]);
      } else {
        // Items nach Priorität sortieren (niedrigere Priorität = zuerst verstecken)
        const sorted = [...navigationItems].sort((a, b) => 
          (b.priority || 0) - (a.priority || 0)
        );
        setVisibleItems(sorted.slice(0, maxVisibleItems));
        setOverflowItems(sorted.slice(maxVisibleItems));
      }
    };

    calculateVisibleItems();
    window.addEventListener('resize', calculateVisibleItems);
    return () => window.removeEventListener('resize', calculateVisibleItems);
  }, []);

  // Click outside handler für Overflow-Menü
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overflowMenuRef.current &&
        !overflowMenuRef.current.contains(event.target as Node)
      ) {
        setOverflowMenuOpen(false);
      }
    };

    if (overflowMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [overflowMenuOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOverflowMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Zum Hauptinhalt springen
      </a>

      <nav className="nav-bar" role="navigation" aria-label="Hauptnavigation">
        <div className="nav-inner">
          {/* Logo/Brand */}
          <a
            href="/start"
            className="nav-brand"
            title="Zur Startseite"
            aria-label="DIE AKSEP - Zur Startseite"
          >
            <img src={logo} alt="DIE AKSEP Logo" className="nav-logo" />
            <span className="nav-wordmark">DIE AKSEP</span>
          </a>

          {/* Desktop Navigation */}
          <div className="nav-center" ref={navRef}>
            <div className="nav-items" role="menubar">
              {visibleItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-item"
                  role="menuitem"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {/* Overflow Menu (Priority+) */}
            {overflowItems.length > 0 && (
              <div className="nav-overflow" ref={overflowMenuRef}>
                <button
                  className="nav-overflow-trigger"
                  onClick={() => setOverflowMenuOpen(!overflowMenuOpen)}
                  aria-expanded={overflowMenuOpen}
                  aria-controls="overflow-menu"
                  aria-haspopup="true"
                  type="button"
                >
                  Mehr …
                  <ChevronDown className="nav-overflow-icon" />
                </button>
                {overflowMenuOpen && (
                  <div
                    id="overflow-menu"
                    className="nav-menu"
                    role="menu"
                  >
                    {overflowItems.map((item) =>
                      item.children ? (
                        <Disclosure
                          key={item.href}
                          item={item}
                          onNavigate={() => setOverflowMenuOpen(false)}
                        />
                      ) : (
                        <a
                          key={item.href}
                          href={item.href}
                          className="nav-menu-item"
                          role="menuitem"
                          onClick={() => setOverflowMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Menü öffnen"
              type="button"
            >
              <Menu className="nav-mobile-icon" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className={`nav-overlay ${mobileMenuOpen ? 'nav-overlay--visible' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className={`nav-drawer ${mobileMenuOpen ? 'nav-drawer--open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="nav-drawer-header">
              <span className="nav-drawer-title">Menü</span>
              <button
                className="nav-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Menü schließen"
                type="button"
              >
                <X className="nav-mobile-icon" />
              </button>
            </div>
            <div className="nav-drawer-content">
              {navigationItems.map((item) =>
                item.children ? (
                  <Disclosure
                    key={item.href}
                    item={item}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="nav-drawer-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
