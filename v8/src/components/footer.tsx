import { footerConfig } from '../data/footer'
import type { ContactInfo } from '../data/footer'
import { Icon } from './ui/icon'
import type { IconName } from './ui/icon'
import '../styles/components/footer.css'

const isExternal = (href: string) => href.startsWith('http')

function ContactLink({ info }: { info: ContactInfo }) {
  const { iconName, label, href, display } = info
  const external = isExternal(href)
  return (
    <li className="site-footer__contact-item">
      <a
        className="site-footer__contact-link"
        href={href}
        aria-label={label}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
      >
        <Icon name={iconName} className="site-footer__contact-icon" aria-hidden size={18} />
        <span className="site-footer__contact-text">{display}</span>
      </a>
    </li>
  )
}

export default function Footer() {
  const { contactInfo, socialLinks, participationLinks, legalLinks, copyright } = footerConfig

  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p id="site-footer-heading" className="site-footer__brand-title">
            DIE AKSEP
          </p>
          <p className="site-footer__brand-subtitle">
            Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
          </p>
          <p className="site-footer__brand-text">
            Informationspolitik als Hauptfokus: Wir verbinden Bildung, Medien und Digitalisierung zu einem integrativen Ansatz
            für evidenzbasierte Politik und AKSEPtanz.
          </p>
        </div>
        <div className="site-footer__grid" aria-label="Footer-Navigation">
          <section className="site-footer__section" aria-labelledby="footer-contact">
            <h2 id="footer-contact" className="site-footer__section-title">
              Kontakt
            </h2>
            <ul className="site-footer__contact-list">
              {contactInfo.map((info) => (
                <ContactLink key={info.label} info={info} />
              ))}
            </ul>
          </section>
          <section className="site-footer__section" aria-labelledby="footer-social">
            <h2 id="footer-social" className="site-footer__section-title">
              Folgen Sie uns
            </h2>
            <ul className="site-footer__social-list">
              {socialLinks.map((link) => (
                <li key={link.href} className="site-footer__social-item">
                  <a
                    className="site-footer__social-link"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={link.label}
                  >
                    {link.iconName ? (
                      <Icon name={link.iconName as IconName} aria-hidden size={18} />
                    ) : null}
                    <span className="site-footer__social-text">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="site-footer__section" aria-labelledby="footer-participation">
            <h2 id="footer-participation" className="site-footer__section-title">
              Aktiv werden
            </h2>
            <ul className="site-footer__link-list">
              {participationLinks.map((link) => (
                <li key={link.href} className="site-footer__link-item">
                  <a className="site-footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="site-footer__section" aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="site-footer__section-title">
              Rechtliches
            </h2>
            <ul className="site-footer__link-list">
              {legalLinks.map((link) => (
                <li key={link.href} className="site-footer__link-item">
                  <a className="site-footer__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <div className="site-footer__meta">
        <span className="site-footer__meta-text">{copyright}</span>
      </div>
    </footer>
  )
}
