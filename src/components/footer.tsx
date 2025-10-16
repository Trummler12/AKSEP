import { Separator } from './ui/separator';
import { Mail, MessageCircle, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import aksepLogo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

const Footer = () => {
  const participationLinks = [
    { label: 'Mitglied werden', href: '/mitglied-werden' },
    { label: 'Mitmachen', href: '/mitmachen' },
    { label: 'Unterstützen', href: '/unterstuetzen' },
  ];

  const legalLinks = [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'Finanzen & Transparenz', href: '/finanzen-transparenz' },
  ];

  const socialLinks = [
    { icon: <MessageCircle className="h-4 w-4" />, href: 'https://discord.gg/nE7TKtBQnr', label: 'Discord' },
    { icon: <Facebook className="h-4 w-4" />, href: 'https://facebook.com/dieaksep', label: 'Facebook' },
    { icon: <Twitter className="h-4 w-4" />, href: 'https://twitter.com/dieaksep', label: 'Twitter' },
    { icon: <Youtube className="h-4 w-4" />, href: 'https://youtube.com/dieaksep', label: 'YouTube' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={aksepLogo} alt="DIE AKSEP Logo" className="h-8 w-8" />
              <span className="text-xl">DIE AKSEP</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
            </p>
            <p className="text-muted-foreground mb-6 text-sm">
              Informationspolitik als Hauptfokus: Für eine transparente, evidenzbasierte Politik.
            </p>
            
            {/* Contact */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:kontakt@dieaksep.de" className="hover:text-primary transition-colors">
                  kontakt@dieaksep.de
                </a>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <a href="https://discord.gg/nE7TKtBQnr" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Discord-Server
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm mb-3">Folgen Sie uns</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Participation */}
          <div>
            <h3 className="mb-4">Aktiv werden</h3>
            <ul className="space-y-2">
              {participationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and Links */}
          <div>
            <h3 className="mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 DIE AKSEP. Alle Rechte vorbehalten.
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            AKSEPtanz · Für Transparenz, Evidenz und Bürgernähe
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;