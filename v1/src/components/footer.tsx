import { Link } from 'react-router-dom'

import { footerConfig } from '../data/footer'
import Icon, { type IconName } from './ui/icon'
import '../styles/components/footer.css'

const isExternalLink = (href: string) => href.startsWith('http') || href.startsWith('mailto:')

const Footer = () => {
  const { contactInfo, socialLinks, participationLinks, legalLinks, copyright } = footerConfig

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__section footer__section--brand">
          <div className="footer__brand-heading">
            <Icon name="Aksep" className="footer__logo" aria-hidden="true" />
            <div>
              <p className="footer__title">DIE AKSEP</p>
              <p className="footer__tagline">Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei</p>
            </div>
          </div>
          <p className="footer__description">
            Informationspolitik als Hauptfokus: Wir verbinden Bildung, Medien und Digitalisierung zu einem integrativen Ansatz
            für evidenzbasierte Politik und AKSEPtanz.
          </p>
          <div className="footer__social">
            <span className="footer__social-label">Folgen Sie uns</span>
            <ul className="footer__social-list" aria-label="Social Media Links">
              {socialLinks.map((link) => {
                const iconName = (link.iconName ?? 'External') as IconName

                return (
                <li key={link.href} className="footer__social-item">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="footer__social-link"
                    aria-label={link.label}
                  >
                    <Icon name={iconName} aria-hidden="true" />
                  </a>
                </li>
              )})}
            </ul>
          </div>
        </div>

        <div className="footer__section">
          <h2 className="footer__heading">Aktiv werden</h2>
          <ul className="footer__link-list">
            {participationLinks.map((link) => (
              <li key={link.href} className="footer__link-item">
                <Link to={link.href} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__section">
          <h2 className="footer__heading">Kontakt</h2>
          <ul className="footer__link-list footer__link-list--contact">
            {contactInfo.map((contact) => (
              <li key={contact.href} className="footer__link-item">
                <a
                  href={contact.href}
                  className="footer__link footer__link--contact"
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <Icon name={contact.iconName} aria-hidden="true" />
                  <span className="footer__contact-content">
                    <span className="footer__contact-label">{contact.label}</span>
                    <span className="footer__contact-value">{contact.display}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__section">
          <h2 className="footer__heading">Rechtliches</h2>
          <ul className="footer__link-list">
            {legalLinks.map((link) => (
              <li key={link.href} className="footer__link-item">
                {isExternalLink(link.href) ? (
                  <a href={link.href} className="footer__link">
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.href} className="footer__link">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__meta">
        <p className="footer__copyright">{copyright}</p>
        <p className="footer__disclaimer">DIE AKSEP — Für Transparenz, Evidenz und Digitalisierung.</p>
      </div>
    </footer>
  )
}

export default Footer
