import { footerConfig } from '../data/footer'
import { Icon, type IconName } from './ui/icon'
import type { ContactInfo } from '../data/footer'
import type { SocialLink } from '../types/navigation'
import { NavLink } from 'react-router-dom'

const { contactInfo, socialLinks, participationLinks, legalLinks, copyright } = footerConfig

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <section className="footer__section footer__section--contact" aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="footer__heading">
            Kontakt
          </h2>
          <ul className="footer__list">
            {contactInfo.map((info) => (
              <li key={info.type} className="footer__item">
                <FooterContact info={info} />
              </li>
            ))}
          </ul>
        </section>

        <section className="footer__section footer__section--social" aria-labelledby="footer-social">
          <h2 id="footer-social" className="footer__heading">
            Folgen Sie uns
          </h2>
          <ul className="footer__social-list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <FooterExternalLink link={link} />
              </li>
            ))}
          </ul>
        </section>

        <section className="footer__section footer__section--participation" aria-labelledby="footer-participation">
          <h2 id="footer-participation" className="footer__heading">
            Mitmachen
          </h2>
          <ul className="footer__list">
            {participationLinks.map((link) => (
              <li key={link.label} className="footer__item">
                <NavLink to={link.href} className="footer__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="footer__section footer__section--legal" aria-labelledby="footer-legal">
          <h2 id="footer-legal" className="footer__heading">
            Rechtliches
          </h2>
          <ul className="footer__list">
            {legalLinks.map((link) => (
              <li key={link.label} className="footer__item">
                <NavLink to={link.href} className="footer__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="footer__bottom">
        <p className="footer__copyright">{copyright}</p>
      </div>
    </footer>
  )
}

function FooterContact({ info }: { info: ContactInfo }) {
  return (
    <a href={info.href} className="footer__contact-link">
      <span className="footer__icon" aria-hidden="true">
        <Icon name={info.iconName} />
      </span>
      <span className="footer__contact-text">
        <span className="footer__contact-label">{info.label}</span>
        <span className="footer__contact-value">{info.display}</span>
      </span>
    </a>
  )
}

function FooterExternalLink({ link }: { link: SocialLink }) {
  const iconName = (link.iconName ?? 'MessageCircle') as IconName
  return (
    <a
      href={link.href}
      className="footer__social-link"
      target="_blank"
      rel="noreferrer noopener"
      aria-label={link.label}
    >
      <Icon name={iconName} />
    </a>
  )
}
