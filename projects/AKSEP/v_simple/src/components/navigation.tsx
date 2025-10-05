import { useState } from 'react';
import { ChevronDown, Menu, X, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import aksepLogo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const begriffeItems = [
    { label: 'Rechts vs. Links', href: '/begriffe/rechts-vs-links' },
    { label: 'Radikal', href: '/begriffe/radikal' },
    { label: 'Pädophil vs. Pädokriminell', href: '/begriffe/paedophil-vs-paedokriminell' },
    { label: 'Nationalsozialismus', href: '/begriffe/nationalsozialismus' },
    { label: 'Faschismus', href: '/begriffe/faschismus' },
    { label: 'Weitere Begriffe...', href: '/begriffe/weitere' },
  ];

  const programmItems = [
    { label: 'Präambel', href: '/praeambel' },
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
    { label: 'AG Aussenpolitik', href: '/programm/aussenpolitik' },
    { label: 'AG Tierrechte', href: '/programm/tierrechte' },
    { label: 'AG Agrarpolitik', href: '/programm/agrarpolitik' },
    { label: 'Sonstiges', href: '/programm/sonstiges' },
  ];

  const ueberUnsItems = [
    { label: 'Über uns', href: '/ueber-uns' },
    { label: 'Satzung', href: '/satzung' },
    { label: 'Projekte', href: '/projekte' },
    { label: 'Partner & Projekte', href: '/partner-projekte' },
  ];

  const aktuellItems = [
    { label: 'Termine', href: '/termine' },
    { label: 'Presse', href: '/presse' },
  ];

  const mitmachenItems = [
    { label: 'Mitglied werden', href: '/mitglied-werden' },
    { label: 'Mitmachen', href: '/mitmachen' },
    { label: 'Unterstützen', href: '/unterstuetzen' },
    { label: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo - Fixed Left Position */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href="/" className="flex items-center space-x-3 mr-8 hover:opacity-80 transition-opacity">
                  <img src={aksepLogo} alt="DIE AKSEP Logo" className="h-10 w-10" />
                  <span className="text-xl whitespace-nowrap">DIE AKSEP</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zur Startseite</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1">
            {/* Core Navigation - Always Visible */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('begriffe')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="/begriffe" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors whitespace-nowrap">
                <span>Begriffe</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'begriffe' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-md shadow-lg py-2 z-50">
                  {begriffeItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('programm')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="/programm" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors whitespace-nowrap">
                <span>Programm</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'programm' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                  {programmItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('ueber-uns')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="/ueber-uns" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors whitespace-nowrap">
                <span>Über uns</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'ueber-uns' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-md shadow-lg py-2 z-50">
                  {ueberUnsItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Secondary Navigation - Hidden on smaller screens */}
            <div 
              className="relative hidden xl:block"
              onMouseEnter={() => setActiveDropdown('aktuelles')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="/termine" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors whitespace-nowrap">
                <span>Aktuelles</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'aktuelles' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg py-2 z-50">
                  {aktuellItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="relative hidden 2xl:block"
              onMouseEnter={() => setActiveDropdown('mitmachen')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="/mitmachen" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors whitespace-nowrap">
                <span>Mitmachen</span>
                <ChevronDown className="h-4 w-4" />
              </a>
              {activeDropdown === 'mitmachen' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg py-2 z-50">
                  {mitmachenItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* More Menu - Shows items that don't fit */}
            <div className="2xl:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
                  <div className="xl:hidden">
                    <DropdownMenuItem asChild>
                      <a href="/termine" className="w-full">Termine</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/presse" className="w-full">Presse</a>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuItem asChild>
                    <a href="/mitglied-werden" className="w-full">Mitglied werden</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/mitmachen" className="w-full">Mitmachen</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/unterstuetzen" className="w-full">Unterstützen</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/kontakt" className="w-full">Kontakt</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {/* Action Buttons - Only visible on larger screens */}
          <div className="hidden 2xl:flex items-center space-x-3 ml-auto">
            <Button variant="outline" size="sm" asChild>
              <a href="/mitglied-werden">Mitglied werden</a>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <a href="/unterstuetzen">Unterstützen</a>
            </Button>
          </div>

          {/* Mobile Menu Button - Only for small screens */}
          <button
            className="lg:hidden ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <nav className="py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {/* Begriffe */}
                <div className="px-4 py-2">
                  <a href="/begriffe" className="block text-foreground hover:text-primary transition-colors mb-2">Begriffe</a>
                  <div className="ml-4 space-y-1">
                    {begriffeItems.map((item) => (
                      <a key={item.href} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Programm */}
                <div className="px-4 py-2">
                  <a href="/programm" className="block text-foreground hover:text-primary transition-colors mb-2">Programm</a>
                  <div className="ml-4 space-y-1">
                    {programmItems.slice(0, 8).map((item) => (
                      <a key={item.href} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    ))}
                    <a href="/programm" className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      Alle Arbeitsgruppen...
                    </a>
                  </div>
                </div>

                {/* Über uns */}
                <div className="px-4 py-2">
                  <a href="/ueber-uns" className="block text-foreground hover:text-primary transition-colors mb-2">Über uns</a>
                  <div className="ml-4 space-y-1">
                    {ueberUnsItems.map((item) => (
                      <a key={item.href} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Aktuelles */}
                <a href="/termine" className="block px-4 py-2 text-foreground hover:text-primary transition-colors">
                  Termine
                </a>
                <a href="/presse" className="block px-4 py-2 text-foreground hover:text-primary transition-colors">
                  Presse
                </a>

                {/* Kontakt */}
                <a href="/kontakt" className="block px-4 py-2 text-foreground hover:text-primary transition-colors">
                  Kontakt
                </a>
              </div>
              
              {/* Action Buttons */}
              <div className="border-t border-border mt-4 pt-4 px-4 space-y-2">
                <Button className="w-full" asChild>
                  <a href="/mitglied-werden">Mitglied werden</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/mitmachen">Mitmachen</a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/unterstuetzen">Unterstützen</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;