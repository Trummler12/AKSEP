import { Link } from 'react-router-dom'
import { footerConfig } from '../data/footer'
import Icon, { type IconName } from './ui/icon'

const isExternal = (href: string) => href.startsWith('http')

export default function Footer() {
  const { contactInfo, socialLinks, participationLinks, legalLinks, copyright } = footerConfig

  return (
    <footer className="footer" aria-label="Fußzeile">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo" aria-hidden="true">
            <span className="footer__logo-glow" />
            <span className="footer__logo-core" />
          </span>
          <div className="footer__brand-text">
            <span className="footer__brand-title">DIE AKSEP</span>
            <span className="footer__brand-subtitle">Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei</span>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__column">
            <h3 className="footer__heading">Kontakt</h3>
            <ul className="footer__list">
              {contactInfo.map((entry) => (
                <li key={entry.href} className="footer__item">
                  <a href={entry.href} className="footer__link">
                    <Icon name={entry.iconName} className="footer__icon" aria-hidden="true" decorative />
                    <span className="footer__link-text">{entry.display}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Aktiv werden</h3>
            <ul className="footer__list">
              {participationLinks.map((entry) => (
                <li key={entry.href} className="footer__item">
                  {isExternal(entry.href) ? (
                    <a href={entry.href} className="footer__link">
                      {entry.label}
                    </a>
                  ) : (
                    <Link to={entry.href} className="footer__link">
                      {entry.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Folgen Sie uns</h3>
            <ul className="footer__list footer__list--icons">
              {socialLinks.map((entry) => (
                <li key={entry.href} className="footer__item">
                  <a href={entry.href} className="footer__social-link" aria-label={entry.label}>
                    {entry.iconName ? (
                      <Icon name={entry.iconName as IconName} className="footer__icon" aria-hidden="true" decorative />
                    ) : null}
                    <span>{entry.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Rechtliches</h3>
            <ul className="footer__list">
              {legalLinks.map((entry) => (
                <li key={entry.href} className="footer__item">
                  <Link to={entry.href} className="footer__link">
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">{copyright}</p>
      </div>
    </footer>
  )
}
