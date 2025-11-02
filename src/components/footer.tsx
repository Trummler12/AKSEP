import { Separator } from './ui/separator';
import { Icon } from './ui/icon';
import { footerConfig, contactInfo, socialLinks, participationLinks, legalLinks } from '../data/footer';
import aksepLogo from 'figma:asset/Logo_AKSEP.png';

import '@/styles/components/footer.css';

const Footer = () => {
  // All links and configuration are now imported from external data

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo and Description */}
          <div>
            <div className="footer-brand">
              <img src={aksepLogo} alt="DIE AKSEP Logo" className="footer-logo-image" />
              <span className="footer-logo-text">DIE AKSEP</span>
            </div>
            <p className="footer-description">
              Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
            </p>
            <p className="footer-description">
              Informationspolitik als Hauptfokus: Für eine transparente, evidenzbasierte Politik.
            </p>

            {/* Contact */}
            <div className="footer-link-group">
              {contactInfo.map((contact) => (
                <div key={contact.href} className="footer-contact-item">
                  <Icon name={contact.iconName} />
                  <a
                    href={contact.href}
                    className="footer-contact-link"
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
              <h4 className="footer-section-title">Folgen Sie uns</h4>
              <div className="footer-social-row">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
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
            <h3 className="footer-section-title">Aktiv werden</h3>
            <ul className="footer-link-stack">
              {participationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="footer-nav-link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and Links */}
          <div>
            <h3 className="footer-section-title">Rechtliches</h3>
            <ul className="footer-link-stack">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="footer-legal-link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-text">
            {footerConfig.copyright}
          </div>
          <div className="footer-bottom-text-aligned">
            AKSEPtanz · Für Transparenz, Evidenz und Bürgernähe
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
