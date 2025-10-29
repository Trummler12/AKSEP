import { Link } from 'react-router-dom'
import '../styles/components/footer.css'
import { footerConfig } from '../data/footer'
import Icon, { type IconName } from './ui/icon'

function Footer() {
  const { contactInfo, socialLinks, participationLinks, legalLinks, copyright } = footerConfig

  return (
    <footer className="footer" aria-label="Footer">
      <div className="container footer__grid">
        <div className="footer__section footer__section--brand">
          <h2 className="footer__title">DIE AKSEP</h2>
          <p className="footer__description">
            Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
          </p>
        </div>
        <div className="footer__section">
          <h3 className="footer__heading">Kontakt</h3>
          <ul className="footer__list">
            {contactInfo.map((item) => (
              <li key={item.type} className="footer__list-item">
                <a
                  href={item.href}
                  className="footer__link"
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                >
                  <Icon name={item.iconName} size={18} className="footer__icon" />
                  <span>{item.display}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__section">
          <h3 className="footer__heading">Aktiv werden</h3>
          <ul className="footer__list">
            {participationLinks.map((link) => (
              <li key={link.href} className="footer__list-item">
                <Link className="footer__link" to={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__section">
          <h3 className="footer__heading">Folgen Sie uns</h3>
          <ul className="footer__list footer__list--social">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a className="footer__social-link" href={link.href} target="_blank" rel="noreferrer noopener">
                  <Icon name={(link.iconName as IconName) ?? 'MessageCircle'} size={20} className="footer__icon" />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__section">
          <h3 className="footer__heading">Rechtliches</h3>
          <ul className="footer__list">
            {legalLinks.map((link) => (
              <li key={link.href} className="footer__list-item">
                <Link className="footer__link" to={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__meta" role="contentinfo">
        <div className="container footer__meta-inner">
          <span className="footer__copyright">{copyright}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
