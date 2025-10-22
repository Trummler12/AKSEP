import { Separator } from './ui/separator';
import { Icon } from './ui/icon';
import { footerConfig, contactInfo, socialLinks, participationLinks, legalLinks } from '../data/footer';
import aksepLogo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

const Footer = () => {
  // All links and configuration are now imported from external data

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
              {contactInfo.map((contact) => (
                <div key={contact.href} className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name={contact.iconName} />
                  <a 
                    href={contact.href} 
                    className="hover:text-primary transition-colors"
                    {...(contact.href.startsWith('https://') && {
                      target: "_blank",
                      rel: "noopener noreferrer"
                    })}
                  >
                    {contact.display}
                  </a>
                </div>
              ))}
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
                    <Icon name={social.iconName} />
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
            {footerConfig.copyright}
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