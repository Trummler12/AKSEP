import { Link } from 'react-router-dom'
import {
  contactInfo,
  footerConfig,
  legalLinks,
  participationLinks,
  socialLinks,
} from '../data/footer'
import type { LinkItem, SocialLink } from '../types/navigation'
import Icon, { type IconProps } from './ui/icon'
import '../styles/components/footer.css'

function isExternal(href: string) {
  return /^https?:/i.test(href)
}

function LinkOrAnchor({ item }: { item: LinkItem }) {
  if (isExternal(item.href)) {
    return (
      <a className="footer__link" href={item.href} rel="noreferrer" target="_blank">
        {item.label}
      </a>
    )
  }

  return (
    <Link className="footer__link" to={item.href}>
      {item.label}
    </Link>
  )
}

type IconName = IconProps['name']

function SocialLinkItem({ link }: { link: SocialLink }) {
  const iconName: IconName = (link.iconName ?? 'MessageCircle') as IconName
  return (
    <a
      className="footer__social-link"
      href={link.href}
      rel="noreferrer"
      target="_blank"
      aria-label={link.label}
    >
      <Icon name={iconName} size={20} />
      <span className="footer__social-label">{link.label}</span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <div className="footer__inner">
        <div className="footer__intro">
          <h2 className="footer__heading" id="footer-heading">
            DIE AKSEP
          </h2>
          <p className="footer__description">
            Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
          </p>
        </div>
        <div className="footer__columns">
          <section aria-label="Kontakt" className="footer__column">
            <h3 className="footer__title">Kontakt</h3>
            <ul className="footer__list">
              {contactInfo.map((info) => (
                <li className="footer__list-item" key={info.label}>
                  <a className="footer__link footer__link--contact" href={info.href}>
                    <Icon name={info.iconName} size={20} className="footer__icon" />
                    <span>{info.display}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section aria-label="Aktiv werden" className="footer__column">
            <h3 className="footer__title">Aktiv werden</h3>
            <ul className="footer__list">
              {participationLinks.map((item) => (
                <li className="footer__list-item" key={item.href}>
                  <LinkOrAnchor item={item} />
                </li>
              ))}
            </ul>
          </section>
          <section aria-label="Folgen Sie uns" className="footer__column">
            <h3 className="footer__title">Folgen Sie uns</h3>
            <ul className="footer__social-list">
              {socialLinks.map((item) => (
                <li className="footer__social-item" key={item.href}>
                  <SocialLinkItem link={item} />
                </li>
              ))}
            </ul>
          </section>
          <section aria-label="Rechtliches" className="footer__column">
            <h3 className="footer__title">Rechtliches</h3>
            <ul className="footer__list">
              {legalLinks.map((item) => (
                <li className="footer__list-item" key={item.href}>
                  <LinkOrAnchor item={item} />
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="footer__meta">
          <p className="footer__copyright">{footerConfig.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
